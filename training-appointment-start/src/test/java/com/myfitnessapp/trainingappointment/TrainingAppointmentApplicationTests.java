package com.myfitnessapp.trainingappointment;

import com.myfitnessapp.service.appointment.model.SessionInfo;
import com.myfitnessapp.service.appointment.service.SessionInfoService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;



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

    }


}
