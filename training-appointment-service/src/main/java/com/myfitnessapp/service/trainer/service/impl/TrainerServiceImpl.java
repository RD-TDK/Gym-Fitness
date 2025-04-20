package com.myfitnessapp.service.trainer.service.impl;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;

import com.myfitnessapp.service.trainer.domain.Trainer;
import com.myfitnessapp.service.trainer.dto.TrainerRegistrationDTO;
import com.myfitnessapp.service.trainer.dto.TrainerResponseDTO;
import com.myfitnessapp.service.trainer.dto.TrainerUpdateDTO;
import com.myfitnessapp.service.trainer.mapper.TrainerMapper;
import com.myfitnessapp.service.trainer.mapstruct.TrainerDtoMapper;
import com.myfitnessapp.service.trainer.service.TrainerService;
import com.myfitnessapp.service.user.domain.Role;
import com.myfitnessapp.service.user.domain.User;
import com.myfitnessapp.service.user.mapper.UserMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;

@Service
@Slf4j
public class TrainerServiceImpl implements TrainerService {
    private final TrainerMapper trainerMapper;
    private final TrainerDtoMapper map;
    private final UserMapper userMapper;

    @Autowired
    public TrainerServiceImpl(TrainerMapper trainerMapper,
                              TrainerDtoMapper map,
                              UserMapper userMapper) {
        this.trainerMapper = trainerMapper;
        this.map = map;
        this.userMapper = userMapper;
    }

    @Override
    public TrainerResponseDTO registerTrainer(TrainerRegistrationDTO dto, User currentUser) {
        // 1. DTO → Entity
        Trainer trainer = map.toEntity(dto);
        // 2. 绑定当前用户 ID，并把当前用户角色升为 TRAINER
        trainer.setUserId(currentUser.getUserId());
        trainerMapper.insert(trainer);

        log.info("新教练自增 ID={}", trainer.getTrainerId());

        currentUser.setRole(Role.TRAINER);
        userMapper.updateById(currentUser);

        // 3. Entity → ResponseDTO
        return map.toDto(trainer);
    }

    @Override
    public TrainerResponseDTO updateTrainer(TrainerUpdateDTO dto, User currentUser) {
        // 1. 查找当前用户对应的教练记录
        QueryWrapper<Trainer> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("user_id", currentUser.getUserId());
        Trainer trainer = trainerMapper.selectOne(queryWrapper);
        if (trainer == null) {
            throw new RuntimeException("No trainer found for user");
        }

        // 2. 将更新字段映射到实体
        map.updatetoEntity(dto, trainer);

        // 3. 更新数据库记录
        trainerMapper.updateById(trainer);

        // 4. 返回更新后的 DTO
        return map.toDto(trainer);
    }
}
