package com.myfitnessapp.trainingappointment.demos.web.controller;

import com.myfitnessapp.service.request.model.TrainingRequest;
import com.myfitnessapp.service.request.service.TrainingRequestService;
import com.myfitnessapp.trainingappointment.demos.web.dto.CreateRequestDto;
import com.myfitnessapp.trainingappointment.demos.web.dto.ReviewRequestDto;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/requests")
@RequiredArgsConstructor
public class TrainingRequestController {
    @Autowired
    private TrainingRequestService service;

    @PostMapping("/sessions/{sessionId}")
    @ResponseStatus(HttpStatus.CREATED)
    public TrainingRequest createRequest(@PathVariable Integer sessionId,
                                         @RequestBody @Validated CreateRequestDto dto) {
        return service.createRequest(sessionId, dto.getMemberId());
    }

    @GetMapping("/trainers/{trainerId}")
    public List<TrainingRequest> listRequests(@PathVariable Integer trainerId) {
        return service.findRequests(trainerId);
    }

    @PutMapping("/{requestId}")
    public TrainingRequest reviewRequest(@PathVariable Integer requestId,
                                         @RequestBody @Validated ReviewRequestDto dto) {
        return service.reviewRequest(requestId, dto.getStatus(), dto.getReason());
    }
}
