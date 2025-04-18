package com.myfitnessapp.trainingappointment.demos.web.listener;

import com.myfitnessapp.service.session.event.SessionUpdatedEvent;
import com.myfitnessapp.service.session.model.SessionInfo;
import com.myfitnessapp.trainingappointment.demos.web.model.Notification;
import com.myfitnessapp.trainingappointment.demos.web.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

@Component
@Slf4j
@RequiredArgsConstructor
public class SessionEventListener {
    private final NotificationRepository notificationRepository;

    @EventListener
    public void handleSessionUpdated(SessionUpdatedEvent event) {
        SessionInfo session = event.getSessionInfo();
        Notification n = new Notification();
        // 通知的接收者：根据你的业务，应该是 memberId 才对
        n.setUserId(session.getMemberId());
        n.setMessage("您的课程 #" + session.getSessionId() + " 已更新，状态：" + session.getStatus());
        n.setType("SESSION_UPDATED");
        n.setLink("/sessions/" + session.getSessionId());
        notificationRepository.save(n);
        log.info("已发送通知给用户 {}: {}", n.getUserId(), n.getMessage());
    }
}
