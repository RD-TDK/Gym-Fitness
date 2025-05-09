package com.myfitnessapp.service.session.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.myfitnessapp.service.exception.InvalidBusinessRuleException;
import com.myfitnessapp.service.session.event.SessionUpdatedEvent;
import com.myfitnessapp.service.session.mapper.SessionInfoMapper;
import com.myfitnessapp.service.session.model.SessionInfo;
import com.myfitnessapp.service.session.service.SessionInfoService;
import com.myfitnessapp.service.exception.ResourceNotFoundException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;

@Service
@Slf4j
public class SessionInfoServiceImpl implements SessionInfoService {

    @Autowired
    private SessionInfoMapper sessionInfoMapper;

    @Autowired
    private ApplicationEventPublisher eventPublisher;

    @Override
    public SessionInfo createSession(SessionInfo sessionInfo) {
        // 校验：每位会员同一时段只能有一个预约
        LocalDateTime start = sessionInfo.getSessionDatetime();
        LocalDateTime end = start.plusHours(1);
        Integer memberId = sessionInfo.getMemberId();
        QueryWrapper<SessionInfo> wrapper = new QueryWrapper<>();
        wrapper.eq("member_id", memberId)
                .between("session_datetime", start, end);
        if (!sessionInfoMapper.selectList(wrapper).isEmpty()) {
            throw new InvalidBusinessRuleException("该时间段已有预约，无法重复创建");
        }

        sessionInfo.setStatus("PENDING");
        sessionInfo.setCreatedAt(LocalDateTime.now());
        sessionInfo.setUpdatedAt(LocalDateTime.now());
        sessionInfoMapper.insert(sessionInfo);
        log.info("创建训练会话：{}", sessionInfo);
        return sessionInfo;
    }

    @Override
    public List<SessionInfo> getSessionsByMember(Integer memberId) {
        QueryWrapper<SessionInfo> w = new QueryWrapper<>();
        // 只有已审批通过的课程对会员可见
        w.eq("member_id", memberId)
                .in("status", "APPROVED", "COMPLETED", "ACTIVE");
        return sessionInfoMapper.selectList(w);
    }


    @Override
    public boolean updateSessionRecord(Integer sessionId, Integer duration, LocalDateTime nextSessionDatetime, String status) {
        SessionInfo session = sessionInfoMapper.selectById(sessionId);
        if (session == null) {
            log.warn("训练会话记录 {} 不存在", sessionId);
            throw new ResourceNotFoundException("训练会话不存在: " + sessionId);
        }

        /* 2) 业务校验：下次训练时间至少要晚于当前时间 1 小时
        if (nextSessionDatetime != null &&
                nextSessionDatetime.isBefore(LocalDateTime.now().plusHours(1))) {
            throw new InvalidBusinessRuleException("下次训练时间必须至少在 1 小时后");
        }*/

        // 3) 更新
        session.setDuration(duration);
        session.setNextSessionDatetime(nextSessionDatetime);
        session.setStatus(status);
        session.setUpdatedAt(LocalDateTime.now());
        int rows = sessionInfoMapper.updateById(session);
        log.info("训练记录 {} 更新结果: {}", sessionId, rows > 0);

        // 4) 发布事件
        if (rows > 0) {
            SessionUpdatedEvent evt = new SessionUpdatedEvent(this, session);
            eventPublisher.publishEvent(evt);
            log.info("已发布 SessionUpdatedEvent: {}", sessionId);
            return true;
        }
        return false;
    }

    @Override
    public boolean cancelSession(Integer sessionId) {
        SessionInfo s = sessionInfoMapper.selectById(sessionId);
        if (s == null) {
            throw new ResourceNotFoundException("训练会话 " + sessionId + " 不存在");
        }
        s.setStatus("CANCELED");
        s.setUpdatedAt(LocalDateTime.now());
        boolean ok = sessionInfoMapper.updateById(s) > 0;
        log.info("取消训练会话 {} 结果: {}", sessionId, ok);
        return ok;
    }

    @Override
    public Integer getTotalDuration(Integer memberId, LocalDateTime startTime, LocalDateTime endTime) {
        QueryWrapper<SessionInfo> wrapper = new QueryWrapper<>();
        wrapper.eq("member_id", memberId)
                .between("session_datetime", startTime, endTime);
        // 使用 selectObjs 获取所有训练时长（duration）数据
        List<Object> durations = sessionInfoMapper.selectObjs(wrapper.select("duration"));
        int total = durations.stream()
                .filter(obj -> obj != null)
                .mapToInt(obj -> (Integer) obj)
                .sum();
        log.info("统计会员 {} 在 {} 到 {} 期间的总训练时长：{} 分钟", memberId, startTime, endTime, total);
        return total;
    }

    @Override
    public SessionInfo createCourse(SessionInfo session) {
        // Calibration: no duplicates of the same private tutor in the same session
        QueryWrapper<SessionInfo> w = new QueryWrapper<>();
        w.eq("trainer_id", session.getTrainerId())
                .eq("session_datetime", session.getSessionDatetime());
        if (!sessionInfoMapper.selectList(w).isEmpty()) {
            throw new InvalidBusinessRuleException("You have already published a course at this time");
        }
        session.setStatus("ACTIVE");
        session.setCreatedAt(LocalDateTime.now());
        session.setUpdatedAt(LocalDateTime.now());
        sessionInfoMapper.insert(session);
        log.info("Course Created: {}", session);
        return session;
    }

    @Override
    public boolean deleteCourse(Integer sessionId, Integer trainerId) {
        SessionInfo s = sessionInfoMapper.selectById(sessionId);
        if (s == null || !s.getTrainerId().equals(trainerId)) {
            throw new ResourceNotFoundException("课程不存在或无权限删除");
        }
        s.setStatus("CANCELED");
        s.setUpdatedAt(LocalDateTime.now());
        boolean ok = sessionInfoMapper.updateById(s) > 0;
        log.info("课程 {} 删除结果: {}", sessionId, ok);
        return ok;
    }

    @Override
    public List<SessionInfo> findCourses(LocalDateTime start, LocalDateTime end) {
        QueryWrapper<SessionInfo> w = new QueryWrapper<>();
        w.between("session_datetime", start, end)
                .eq("status", "ACTIVE");
        return sessionInfoMapper.selectList(w);
    }

    @Override
    public List<SessionInfo> getSessionsByIds(List<Integer> sessionIds) {
        if (sessionIds == null || sessionIds.isEmpty()) {
            return Collections.emptyList();
        }
        return sessionInfoMapper.selectBatchIds(sessionIds);
    }
}
