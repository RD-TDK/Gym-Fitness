package com.myfitnessapp.trainingappointment.demos.web.controller;

import com.myfitnessapp.service.request.model.TrainingRequest;
import com.myfitnessapp.service.request.service.TrainingRequestService;
import com.myfitnessapp.service.session.model.SessionInfo;
import com.myfitnessapp.service.session.service.SessionInfoService;
import com.myfitnessapp.trainingappointment.demos.web.dto.CreateSessionDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("api/sessions")
@Slf4j
@RequiredArgsConstructor
public class SessionController {
    @Autowired
    private SessionInfoService sessionInfoService;

    @Autowired
    private TrainingRequestService trainingRequestService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public SessionInfo createCourse(@RequestBody @Validated CreateSessionDto dto) {
        log.debug("Received goalDescription: {}", dto.getGoalDescription());
        SessionInfo s = new SessionInfo();
        s.setTrainerId(dto.getTrainerId());
        s.setCenterId(dto.getCenterId());
        s.setSessionDatetime(dto.getSessionDatetime());
        s.setDuration(dto.getDuration());
        s.setPrice(dto.getPrice());
        s.setGoalDescription(dto.getGoalDescription());
        return sessionInfoService.createCourse(s);
    }

    @DeleteMapping("/{sessionId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteCourse(@PathVariable Integer sessionId,
                             @RequestParam Integer trainerId) {
        sessionInfoService.deleteCourse(sessionId, trainerId);
    }

    @GetMapping
    public List<SessionInfo> listCourses(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime start,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime end) {
        return sessionInfoService.findCourses(start, end);
    }

    @GetMapping("/history/{memberId}")
    public ResponseEntity<List<SessionInfo>> getHistory(@PathVariable Integer memberId) {
        List<TrainingRequest> approved =
                trainingRequestService.findByMemberIdAndStatus(memberId, "APPROVED");

        if (approved.isEmpty()) {
            return ResponseEntity.ok(Collections.<SessionInfo>emptyList());
        }

        List<Integer> sessionIds = approved.stream()
                .map(TrainingRequest::getSessionId)
                .collect(Collectors.toList());

        List<SessionInfo> history = sessionInfoService.getSessionsByIds(sessionIds);
        return ResponseEntity.ok(history);
    }


    @GetMapping("/total-duration/{memberId}")
    public Integer getTotalDuration(@PathVariable Integer memberId,
                                    @RequestParam String durationType) {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime start = "week".equalsIgnoreCase(durationType)
                ? now.minusWeeks(1) : now.minusMonths(1);
        return sessionInfoService.getTotalDuration(memberId, start, now);
    }

    @PutMapping("/{sessionId}")
    public void updateRecord(@PathVariable Integer sessionId,
                             @RequestParam Integer duration,
                             @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime nextSessionDatetime,
                             @RequestParam String status) {
        sessionInfoService.updateSessionRecord(sessionId, duration, nextSessionDatetime, status);
    }

    @PutMapping("/cancel/{sessionId}")
    public void cancelSession(@PathVariable Integer sessionId) {
        sessionInfoService.cancelSession(sessionId);
    }
}
