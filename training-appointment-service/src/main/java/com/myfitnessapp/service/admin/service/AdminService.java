package com.myfitnessapp.service.admin.service;

import com.myfitnessapp.service.user.domain.User;
import com.myfitnessapp.service.trainer.domain.Trainer;

public interface AdminService {
    public void banUser(int userId);
    public void verifyTrainer(int trainerId);
}
