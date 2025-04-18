package com.myfitnessapp.service.request.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.myfitnessapp.service.exception.InvalidBusinessRuleException;
import com.myfitnessapp.service.exception.ResourceNotFoundException;
import com.myfitnessapp.service.request.mapper.TrainingRequestMapper;
import com.myfitnessapp.service.request.model.TrainingRequest;
import com.myfitnessapp.service.request.service.TrainingRequestService;
import com.myfitnessapp.service.session.mapper.SessionInfoMapper;
import com.myfitnessapp.service.session.model.SessionInfo;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
public class TrainingRequestServiceImpl implements TrainingRequestService {
    @Autowired
    private TrainingRequestMapper mapper;

    @Autowired
    private SessionInfoMapper sessionMapper;

    @Override
    public TrainingRequest createRequest(Integer sessionId, Integer memberId) {
        // 拿到要请求的那节课
        SessionInfo target = sessionMapper.selectById(sessionId);
        if (target == null) {
            throw new ResourceNotFoundException("课程不存在");
        }

        // 查所有「已批准」的请求，看看有没有同时间段的
        QueryWrapper<TrainingRequest> w1 = new QueryWrapper<>();
        w1.eq("member_id", memberId)
                .eq("status", "APPROVED");
        List<TrainingRequest> approved = mapper.selectList(w1);

        for (TrainingRequest r : approved) {
            SessionInfo s = sessionMapper.selectById(r.getSessionId());
            if (s.getSessionDatetime().equals(target.getSessionDatetime())) {
                throw new InvalidBusinessRuleException(
                        "时间冲突：您已在 "
                                + s.getSessionDatetime()
                                + " 报名了另一门课");
            }
        }

        // 再检查有没有重复发过同一个 session 的请求
        QueryWrapper<TrainingRequest> w2 = new QueryWrapper<>();
        w2.eq("session_id", sessionId)
                .eq("member_id", memberId);
        if (!mapper.selectList(w2).isEmpty()) {
            throw new InvalidBusinessRuleException("已对该课程发起过请求");
        }

        // 真正插入
        TrainingRequest r = new TrainingRequest();
        r.setSessionId(sessionId);
        r.setMemberId(memberId);
        r.setStatus("PENDING");
        r.setCreatedAt(LocalDateTime.now());
        r.setUpdatedAt(LocalDateTime.now());
        mapper.insert(r);
        return r;
    }

    @Override
    public List<TrainingRequest> findRequests(Integer trainerId) {
        // 简单实现：查询所有，前端或 Service 可根据 sessionId 再过滤
        return mapper.selectList(null);
    }

    @Override
    public TrainingRequest reviewRequest(Integer requestId, String status, String reason) {
        TrainingRequest r = mapper.selectById(requestId);
        if (r == null) {
            throw new ResourceNotFoundException("请求不存在");
        }
        if (!"PENDING".equals(r.getStatus())) {
            throw new InvalidBusinessRuleException("请求已被处理");
        }

        // 如果教练同意
        if ("APPROVED".equals(status)) {
            // 再次检查：该会员在该时段是否已有已批准的课程
            SessionInfo target = sessionMapper.selectById(r.getSessionId());
            QueryWrapper<TrainingRequest> w3 = new QueryWrapper<>();
            w3.eq("member_id", r.getMemberId())
                    .eq("status", "APPROVED");
            List<TrainingRequest> list = mapper.selectList(w3);
            for (TrainingRequest ex : list) {
                SessionInfo s = sessionMapper.selectById(ex.getSessionId());
                if (s.getSessionDatetime().equals(target.getSessionDatetime())) {
                    throw new InvalidBusinessRuleException(
                            "时间冲突：会员已在此时段参加其它课程");
                }
            }
        }

        // 更新状态和拒绝原因
        r.setStatus(status);
        r.setReason(reason);
        r.setUpdatedAt(LocalDateTime.now());
        mapper.updateById(r);
        return r;
    }
}
