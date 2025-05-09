package com.myfitnessapp.trainingappointment.demos.web.listener;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.myfitnessapp.service.request.mapper.TrainingRequestMapper;
import com.myfitnessapp.service.request.model.TrainingRequest;
import com.myfitnessapp.service.session.event.SessionUpdatedEvent;
import com.myfitnessapp.service.session.model.SessionInfo;
import com.myfitnessapp.trainingappointment.demos.web.model.Notification;
import com.myfitnessapp.trainingappointment.demos.web.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Component
@Slf4j
@RequiredArgsConstructor
public class SessionEventListener {
    private final NotificationRepository notificationRepository;
    private final TrainingRequestMapper requestMapper;
    @EventListener
    public void handleSessionUpdated(SessionUpdatedEvent event) {
        Integer sessionId = event.getSessionInfo().getSessionId();
        String newStatus = event.getSessionInfo().getStatus();
        SessionInfo session = event.getSessionInfo();


        QueryWrapper<TrainingRequest> qw = new QueryWrapper<>();
        qw.eq("session_id", sessionId)
                .eq("status", "APPROVED");
        List<TrainingRequest> approvedRequests = requestMapper.selectList(qw);

        if (approvedRequests.isEmpty()) {
            log.warn("No approved training_request found for session {}", sessionId);
            return;
        }


        for (TrainingRequest req : approvedRequests) {
            Integer memberId = req.getMemberId();
            Notification n = new Notification();
            n.setUserId(memberId);
            n.setMessage("Your Course #" + sessionId + " is now " + newStatus);
            n.setType("SESSION_UPDATED");
            n.setLink("/sessions/" + sessionId);
            notificationRepository.save(n);
            log.info("Sent notification to user {}: {}", memberId, n.getMessage());

            LocalDateTime nextDt = session.getNextSessionDatetime();
            if (nextDt != null) {
                Notification nextN = new Notification();
                nextN.setUserId(memberId);
                nextN.setType("NEXT_SESSION_CREATED");
                nextN.setLink("/sessions/" + sessionId);
                String formatted = nextDt.format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm"));
                nextN.setMessage("Your next lesson is scheduled on " + formatted);
                notificationRepository.save(nextN);
                log.info("Sent next-session notification to user {}: {}", memberId, nextN.getMessage());
            }
        }
    }
}
