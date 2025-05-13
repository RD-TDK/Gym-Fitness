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
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Slf4j
@RequiredArgsConstructor
public class TrainingRequestServiceImpl implements TrainingRequestService {
    @Autowired
    private TrainingRequestMapper mapper;

    @Autowired
    private SessionInfoMapper sessionMapper;

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Override
    public TrainingRequest createRequest(Integer sessionId, Integer memberId,String reason) {
        // Get the lesson the member wants to request.
        SessionInfo target = sessionMapper.selectById(sessionId);
        if (target == null) {
            throw new ResourceNotFoundException("Course does not exist");
        }

        // Check all ‘approved’ requests to see if there are any for the same time period
        QueryWrapper<TrainingRequest> w1 = new QueryWrapper<>();
        w1.eq("member_id", memberId)
                .eq("status", "APPROVED");
        List<TrainingRequest> approved = mapper.selectList(w1);

        for (TrainingRequest r : approved) {
            SessionInfo s = sessionMapper.selectById(r.getSessionId());
            if (s.getSessionDatetime().equals(target.getSessionDatetime())) {
                throw new InvalidBusinessRuleException(
                        "Time conflict: You have already enrolled at "
                                + s.getSessionDatetime()
                                + " for another course");
            }
        }

        // Check to see if the same session request has been sent repeatedly.
        QueryWrapper<TrainingRequest> w2 = new QueryWrapper<>();
        w2.eq("session_id", sessionId)
                .eq("member_id", memberId);
        if (!mapper.selectList(w2).isEmpty()) {
            throw new InvalidBusinessRuleException("Requests for this course have been initiated");
        }

        // Real insertion of data
        TrainingRequest r = new TrainingRequest();
        r.setSessionId(sessionId);
        r.setMemberId(memberId);
        r.setReason(reason);
        r.setStatus("PENDING");
        r.setCreatedAt(LocalDateTime.now());
        r.setUpdatedAt(LocalDateTime.now());
        mapper.insert(r);
        return r;
    }

    @Override
    public List<TrainingRequest> findRequests(Integer trainerId) {
        List<SessionInfo> allSessions = sessionMapper.selectList(null);
        log.info(">> Debug: selectList(null) 从 session_info 拿到所有 sessions = {}", allSessions);
        // 1. 查出这个 trainerId 在 session_info 里对应的所有 session
        QueryWrapper<SessionInfo> qwSession = new QueryWrapper<>();
        qwSession.eq("trainer_id", trainerId);
        List<SessionInfo> sessions = sessionMapper.selectList(qwSession);

        // 日志打印出查到的 SessionInfo 对象列表
        log.info(">> Debug: sessions for trainerId {} = {}", trainerId, sessions);

        // 提取出 session_id 列表
        List<Integer> sessionIds = sessions.stream()
                .map(SessionInfo::getSessionId)
                .collect(Collectors.toList());
        log.info(">> Debug: sessionIds for trainerId {} = {}", trainerId, sessionIds);

        // 如果没有任何 session，直接返回空
        if (sessionIds.isEmpty()) {
            return Collections.emptyList();
        }

        // 2. 用 in 过滤出 training_request 里，这些 session_id 对应的请求
        QueryWrapper<TrainingRequest> qwReq = new QueryWrapper<>();
        qwReq.in("session_id", sessionIds);
        List<TrainingRequest> requests = mapper.selectList(qwReq);

        log.info(">> Debug: fetched {} TrainingRequest rows for trainerId {}",
                requests.size(), trainerId);
        return requests;
    }

    @Override
    public TrainingRequest reviewRequest(Integer requestId, String status, String reason) {
        TrainingRequest r = mapper.selectById(requestId);
        if (r == null) {
            throw new ResourceNotFoundException("Request does not exist");
        }
        if (!"PENDING".equals(r.getStatus())) {
            throw new InvalidBusinessRuleException("Request processed");
        }

        // If the tutor permits
        if ("APPROVED".equals(status)) {
            // Re-check: whether the member already has an approved course for that time slot
            SessionInfo target = sessionMapper.selectById(r.getSessionId());
            QueryWrapper<TrainingRequest> w3 = new QueryWrapper<>();
            w3.eq("member_id", r.getMemberId())
                    .eq("status", "APPROVED");
            List<TrainingRequest> list = mapper.selectList(w3);
            for (TrainingRequest ex : list) {
                SessionInfo s = sessionMapper.selectById(ex.getSessionId());
                if (s.getSessionDatetime().equals(target.getSessionDatetime())) {
                    throw new InvalidBusinessRuleException(
                            "Time conflict: the member is already attending another course at this point in time");
                }
            }
        }

        //Update status and reason for rejection
        r.setStatus(status);
        r.setReason(reason);
        r.setUpdatedAt(LocalDateTime.now());
        mapper.updateById(r);
        return r;
    }

    @Override
    public List<TrainingRequest> findByMemberIdAndStatus(Integer memberId, String status) {
        QueryWrapper<TrainingRequest> qw = new QueryWrapper<>();
        qw.eq("member_id", memberId)
                .eq("status", status);
        return mapper.selectList(qw);
    }

    @Override
    public List<Integer> getApprovedSessionIdsByMember(Integer memberId) {
        QueryWrapper<TrainingRequest> qw = new QueryWrapper<>();
        qw.eq("member_id", memberId)
                .eq("status", "APPROVED");
        List<TrainingRequest> approved = mapper.selectList(qw);
        if (approved.isEmpty()) {
            return Collections.emptyList();
        }
        return approved.stream()
                .map(TrainingRequest::getSessionId)
                .collect(Collectors.toList());
    }
}
