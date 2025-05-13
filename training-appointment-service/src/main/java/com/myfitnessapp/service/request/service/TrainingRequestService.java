package com.myfitnessapp.service.request.service;

import com.myfitnessapp.service.request.model.TrainingRequest;

import java.util.List;

public interface TrainingRequestService {
    TrainingRequest createRequest(Integer sessionId, Integer memberId,String reason);

    List<TrainingRequest> findRequests(Integer trainerId);

    TrainingRequest reviewRequest(Integer requestId, String status, String reason);

    List<TrainingRequest> findByMemberIdAndStatus(Integer memberId, String status);

    List<Integer> getApprovedSessionIdsByMember(Integer memberId);
}
