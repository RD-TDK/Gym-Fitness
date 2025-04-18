package com.myfitnessapp.service.session.service;

import com.myfitnessapp.service.session.model.SessionInfo;

import java.time.LocalDateTime;
import java.util.List;

/**
 * SessionInfoService Define interfaces related to training records management
 */
public interface SessionInfoService {
    SessionInfo createSession(SessionInfo sessionInfo);

    List<SessionInfo> getSessionsByMember(Integer memberId);

    boolean updateSessionRecord(Integer sessionId, Integer duration, LocalDateTime nextSessionDatetime, String status);

    boolean cancelSession(Integer sessionId);

    Integer getTotalDuration(Integer memberId, LocalDateTime startTime, LocalDateTime endTime);
    /** 私教创建课程 */
    SessionInfo createCourse(SessionInfo session);
    /** 私教删除自己课程 */
    boolean deleteCourse(Integer sessionId, Integer trainerId);
    /** 按月/周查询所有可加入课程 */
    List<SessionInfo> findCourses(LocalDateTime start, LocalDateTime end);
}
