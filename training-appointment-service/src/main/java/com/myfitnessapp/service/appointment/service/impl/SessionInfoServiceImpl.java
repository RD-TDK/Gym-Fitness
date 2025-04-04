package com.myfitnessapp.service.appointment.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.myfitnessapp.service.appointment.mapper.SessionInfoMapper;
import com.myfitnessapp.service.appointment.model.SessionInfo;
import com.myfitnessapp.service.appointment.service.SessionInfoService;
import com.myfitnessapp.service.exception.ResourceNotFoundException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@Slf4j
public class SessionInfoServiceImpl implements SessionInfoService {

    @Autowired
    private SessionInfoMapper sessionInfoMapper;

    @Override
    public SessionInfo createSession(SessionInfo sessionInfo) {
        sessionInfo.setStatus("PENDING");
        sessionInfo.setCreatedAt(LocalDateTime.now());
        sessionInfo.setUpdatedAt(LocalDateTime.now());
        sessionInfoMapper.insert(sessionInfo);
        log.info("创建训练会话记录：{}", sessionInfo);
        return sessionInfo;
    }

    @Override
    public List<SessionInfo> getSessionsByMember(Integer memberId) {
        QueryWrapper<SessionInfo> wrapper = new QueryWrapper<>();
        wrapper.eq("member_id", memberId);
        List<SessionInfo> list = sessionInfoMapper.selectList(wrapper);
        log.info("查询会员 {} 的训练记录：{}", memberId, list);
        return list;
    }

    @Override
    public boolean reviewSession(Integer sessionId, String status, String goalDescription) {
        SessionInfo session = sessionInfoMapper.selectById(sessionId);
        if (session == null) {
            log.warn("训练会话记录 {} 不存在", sessionId);
            throw new ResourceNotFoundException("训练会话记录 " + sessionId + " 不存在");
        }
        session.setStatus(status);
        if (goalDescription != null && !goalDescription.isEmpty()) {
            session.setGoalDescription(goalDescription);
        }
        session.setUpdatedAt(LocalDateTime.now());
        int rows = sessionInfoMapper.updateById(session);
        log.info("审核训练会话 {} 更新状态为 {}，目标描述：{}", sessionId, status, goalDescription);
        return rows > 0;
    }

    @Override
    public boolean updateSessionRecord(Integer sessionId, Integer duration, LocalDateTime nextSessionDatetime, String status) {
        SessionInfo session = sessionInfoMapper.selectById(sessionId);
        if (session == null) {
            log.warn("训练会话记录 {} 不存在", sessionId);
            throw new ResourceNotFoundException("训练会话记录 " + sessionId + " 不存在");
        }
        session.setDuration(duration);
        session.setNextSessionDatetime(nextSessionDatetime);
        session.setStatus(status);
        session.setUpdatedAt(LocalDateTime.now());
        int rows = sessionInfoMapper.updateById(session);
        if (rows > 0) {
            log.info("更新训练会话 {} 记录：训练时长 {} 分钟，下次训练时间：{}，状态：{}",
                    sessionId, duration, nextSessionDatetime, status);
            // 发布更新事件，用于触发通知
            //eventPublisher.publishEvent(new SessionUpdatedEvent(this, session));
        }
        return rows > 0;
    }

    @Override
    public boolean cancelSession(Integer sessionId) {
        SessionInfo session = sessionInfoMapper.selectById(sessionId);
        if (session == null) {
            log.warn("训练会话记录 {} 不存在，无法取消", sessionId);
            throw new ResourceNotFoundException("训练会话记录 " + sessionId + " 不存在");
        }
        session.setStatus("CANCELED");
        int rows = sessionInfoMapper.updateById(session);
        log.info("取消训练会话 {} 结果：{}", sessionId, rows > 0);
        return rows > 0;
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
}
