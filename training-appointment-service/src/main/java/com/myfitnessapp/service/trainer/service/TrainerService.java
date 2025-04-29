package com.myfitnessapp.service.trainer.service;


import com.baomidou.mybatisplus.core.metadata.IPage;
import com.myfitnessapp.service.trainer.domain.Trainer;
import com.myfitnessapp.service.trainer.dto.TrainerRegistrationDTO;
import com.myfitnessapp.service.trainer.dto.TrainerResponseDTO;
import com.myfitnessapp.service.trainer.dto.TrainerSearchDTO;
import com.myfitnessapp.service.trainer.dto.TrainerUpdateDTO;
import com.myfitnessapp.service.user.domain.User;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;

public interface TrainerService {
    TrainerResponseDTO registerTrainer(TrainerRegistrationDTO dto, User user);

    TrainerResponseDTO updateTrainer(TrainerUpdateDTO dto, User user);

    IPage<TrainerResponseDTO> searchTrainers(Page<Trainer> page, TrainerSearchDTO dto, User user);
}
