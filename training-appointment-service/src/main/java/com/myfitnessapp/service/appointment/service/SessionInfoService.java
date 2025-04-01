package com.myfitnessapp.service.appointment.service;

import com.myfitnessapp.service.appointment.model.SessionInfo;

import java.lang.reflect.Member;
import java.time.LocalDateTime;
import java.util.List;

/**
 * SessionInfoService Define interfaces related to training records management
 */
public interface SessionInfoService {
    SessionInfo createSession(SessionInfo sessionInfo);

    List<SessionInfo> getSessionsByMember(Integer memberId);

    boolean reviewSession(Integer sessionId, String status, String goalDescription);

    boolean updateSessionRecord(Integer sessionId, Integer duration, LocalDateTime nextSessionDatetime, String status);

    boolean cancelSession(Integer sessionId);

    Integer getTotalDuration(Integer memberId, LocalDateTime startTime, LocalDateTime endTime);
}
