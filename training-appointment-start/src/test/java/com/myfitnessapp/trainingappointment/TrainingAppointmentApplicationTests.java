package com.myfitnessapp.trainingappointment;

import com.myfitnessapp.service.appointment.model.SessionInfo;
import com.myfitnessapp.service.appointment.service.SessionInfoService;
import com.myfitnessapp.service.exception.ResourceNotFoundException;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;


@SpringBootTest
@Transactional
class TrainingAppointmentApplicationTests {

    @Autowired
    private SessionInfoService sessionInfoService;

    @Test
    void contextLoads() {
    }

    @Test
    void testCreateAndQuerySession(){
        SessionInfo session = new SessionInfo();
        session.setMemberId(1);
        session.setSessionDatetime(LocalDateTime.now().plusHours(1));
        session.setGoalDescription("Improve endurance");

        SessionInfo created = sessionInfoService.createSession(session);
        assertNotNull(created.getSessionId(), "Session ID should be generated after creation");

        List<SessionInfo> sessions = sessionInfoService.getSessionsByMember(1);
        assertFalse(sessions.isEmpty(), "Sessions list should not be empty");
        boolean found = sessions.stream()
                .anyMatch(s -> s.getSessionId().equals(created.getSessionId()));
        assertTrue(found, "Created session should be found in query result");
    }

    @Test
    void testReviewSessionNotFound() {
        // 测试审核一个不存在的记录，期望抛出 ResourceNotFoundException
        ResourceNotFoundException ex = assertThrows(ResourceNotFoundException.class, () -> {
            sessionInfoService.reviewSession(9999, "APPROVED", "Test review");
        });
        assertTrue(ex.getMessage().contains("不存在"));
    }

    @Test
    void testUpdateSessionRecord() {
        // 创建一个测试记录
        SessionInfo session = new SessionInfo();
        session.setMemberId(1);
        session.setSessionDatetime(LocalDateTime.now().plusHours(2));
        session.setGoalDescription("Build muscle");
        SessionInfo created = sessionInfoService.createSession(session);
        Integer sessionId = created.getSessionId();
        assertNotNull(sessionId, "Session ID should be generated");

        // 更新训练记录：设置时长和安排下次课程
        boolean updated = sessionInfoService.updateSessionRecord(
                sessionId,
                60,  // 训练时长 60 分钟
                LocalDateTime.now().plusDays(7),
                "COMPLETED"
        );
        assertTrue(updated, "Session update should succeed");
    }

    @Test
    void testCancelSession() {
        // 创建一个测试记录，然后取消预约
        SessionInfo session = new SessionInfo();
        session.setMemberId(1);
        session.setSessionDatetime(LocalDateTime.now().plusHours(3));
        session.setGoalDescription("Improve flexibility");
        SessionInfo created = sessionInfoService.createSession(session);
        Integer sessionId = created.getSessionId();
        assertNotNull(sessionId, "Session ID should be generated");

        boolean canceled = sessionInfoService.cancelSession(sessionId);
        assertTrue(canceled, "Session cancellation should succeed");
    }

    @Test
    void testGetTotalDuration() {
        // 创建两条记录，并分别更新训练时长
        SessionInfo session1 = new SessionInfo();
        session1.setMemberId(1);
        session1.setSessionDatetime(LocalDateTime.now().plusHours(1));
        session1.setGoalDescription("Session 1");
        SessionInfo created1 = sessionInfoService.createSession(session1);
        sessionInfoService.updateSessionRecord(created1.getSessionId(), 30, LocalDateTime.now().plusDays(1), "COMPLETED");

        SessionInfo session2 = new SessionInfo();
        session2.setMemberId(1);
        session2.setSessionDatetime(LocalDateTime.now().plusHours(2));
        session2.setGoalDescription("Session 2");
        SessionInfo created2 = sessionInfoService.createSession(session2);
        sessionInfoService.updateSessionRecord(created2.getSessionId(), 45, LocalDateTime.now().plusDays(1), "COMPLETED");

        LocalDateTime start = LocalDateTime.now().minusDays(1);
        LocalDateTime end = LocalDateTime.now().plusDays(1);
        Integer total = sessionInfoService.getTotalDuration(1, start, end);
        assertEquals(75, total, "Total duration should be 75 minutes");
    }
}
