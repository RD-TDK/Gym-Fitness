package com.myfitnessapp.service.trainer.service;


import com.myfitnessapp.service.trainer.dto.TrainerRegistrationDTO;
import com.myfitnessapp.service.trainer.dto.TrainerResponseDTO;
import com.myfitnessapp.service.trainer.dto.TrainerUpdateDTO;
import com.myfitnessapp.service.user.domain.User;

public interface TrainerService {
    TrainerResponseDTO registerTrainer(TrainerRegistrationDTO dto, User user);

    TrainerResponseDTO updateTrainer(TrainerUpdateDTO dto, User user);
}
