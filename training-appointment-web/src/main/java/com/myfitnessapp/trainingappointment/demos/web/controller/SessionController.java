package com.myfitnessapp.trainingappointment.demos.web.controller;

import com.myfitnessapp.service.appointment.model.SessionInfo;
import com.myfitnessapp.service.appointment.service.SessionInfoService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("api/sessions")
@Slf4j
public class SessionController {
    @Autowired
    private SessionInfoService sessionInfoService;

    @PostMapping("/create")
    public SessionInfo createSession(@RequestBody SessionInfo sessionInfo){
        SessionInfo created=sessionInfoService.createSession(sessionInfo);
        log.info("Created training session records：{}", created);
        return created;
    }

    @GetMapping("/member/{memberId}")
    public List<SessionInfo> getSessionsByMember(@PathVariable Integer memberId){
        return sessionInfoService.getSessionsByMember(memberId);
    }

    @PostMapping("/review")
    public String reviewSession(@RequestParam Integer sessionId, @RequestParam String status, @RequestParam(required = false) String goalDescription){
        boolean result = sessionInfoService.reviewSession(sessionId, status, goalDescription);
        return result ? "The audit was successful." : "Audit failed or record does not exist";
    }

    @PostMapping("/update")
    public String updateSession(@RequestParam Integer sessionId,
                                @RequestParam Integer duration,
                                @RequestParam(required = false) String nextSessionDatetime,
                                @RequestParam String status) {
        LocalDateTime nextSession = null;
        if (nextSessionDatetime != null && !nextSessionDatetime.isEmpty()) {
            nextSession = LocalDateTime.parse(nextSessionDatetime);
        }
        boolean updated = sessionInfoService.updateSessionRecord(sessionId, duration, nextSession, status);
        return updated ? "Updated successfully" : "Update failed or record does not exist";
    }

    @PostMapping("/cancel")
    public String cancelSession(@RequestParam Integer sessionId) {
        boolean canceled = sessionInfoService.cancelSession(sessionId);
        return canceled ? "Successful cancellation" : "Failed to cancel appointment or record does not exist";
    }

    @GetMapping("/totalDuration")
    public Integer getTotalDuration(@RequestParam Integer memberId,
                                    @RequestParam String startTime,
                                    @RequestParam String endTime) {
        LocalDateTime start = LocalDateTime.parse(startTime);
        LocalDateTime end = LocalDateTime.parse(endTime);
        return sessionInfoService.getTotalDuration(memberId, start, end);
    }
}
