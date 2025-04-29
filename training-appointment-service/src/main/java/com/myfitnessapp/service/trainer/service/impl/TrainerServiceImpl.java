package com.myfitnessapp.service.trainer.service.impl;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.myfitnessapp.service.user.domain.User;
import java.util.stream.Collectors;
import java.util.List;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.myfitnessapp.service.trainer.domain.CertificationStatus;
import com.myfitnessapp.service.trainer.domain.Trainer;
import com.myfitnessapp.service.trainer.dto.TrainerRegistrationDTO;
import com.myfitnessapp.service.trainer.dto.TrainerResponseDTO;
import com.myfitnessapp.service.trainer.dto.TrainerSearchDTO;
import com.myfitnessapp.service.trainer.dto.TrainerUpdateDTO;
import com.myfitnessapp.service.user.domain.User;
import com.myfitnessapp.service.trainer.dto.TrainerResponseDTO;
import com.myfitnessapp.service.trainer.mapper.TrainerMapper;
import com.myfitnessapp.service.trainer.mapstruct.TrainerDtoMapper;
import com.myfitnessapp.service.trainer.service.TrainerService;
import com.myfitnessapp.service.user.domain.Role;
import com.myfitnessapp.service.user.domain.User;
import com.myfitnessapp.service.user.mapper.UserMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import com.myfitnessapp.service.trainer.domain.Trainer;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import org.springframework.stereotype.Service;

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
        trainer.setIsCertified(CertificationStatus.UNVERIFIED);
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

    @Override
    public IPage<TrainerResponseDTO> searchTrainers(Page<Trainer> page, TrainerSearchDTO dto, User user) {
        QueryWrapper<Trainer> queryWrapper = buildWrapper(dto);
        IPage<Trainer> trainerIPage = trainerMapper.selectPage(page, queryWrapper);
        return trainerIPage.convert(trainer -> {
            // 基本字段转换
            TrainerResponseDTO dtoRes = map.toDto(trainer);
            // 填充用户信息
            User u = userMapper.selectById(trainer.getUserId());
            if (u != null) {
                dtoRes.setUserId(u.getUserId());
                dtoRes.setName(u.getName());
                dtoRes.setEmail(u.getEmail());
                dtoRes.setGender(u.getGender());
            }
            return dtoRes;
        });
    }


    private QueryWrapper<Trainer> buildWrapper(TrainerSearchDTO dto) {
        QueryWrapper<Trainer> qw = new QueryWrapper<>();

        // 筛选：按用户性别
        if (dto.getGender() != null) {
            QueryWrapper<User> uw = new QueryWrapper<>();
            uw.eq("gender", dto.getGender());
            List<Integer> userIds = userMapper.selectList(uw)
                .stream().map(User::getUserId).collect(Collectors.toList());
            if (userIds.isEmpty()) {
                // 没有匹配用户，返回空结果
                qw.eq("user_id", -1);
                return qw;
            }
            qw.in("user_id", userIds);
        }

        // 关键字搜索：用户名或教练字段
        if (dto.getKeyword() != null && !dto.getKeyword().isEmpty()) {
            String raw = dto.getKeyword();
            String pattern = "%" + raw + "%";
            qw.and(w ->
                w.inSql("user_id", "select user_id from `t_user` where name LIKE '" + pattern + "'")
                 .or().like("specialty", raw)
                 .or().like("certification", raw)
                 .or().like("bio", raw)
            );
            // 构造 CASE 排序逻辑
            StringBuilder orderSql = new StringBuilder();
            orderSql.append("ORDER BY CASE ")
                    .append("WHEN user_id IN (select user_id from `t_user` where name LIKE '").append(pattern).append("') THEN 0 ")
                    .append("WHEN specialty LIKE '").append(pattern).append("' THEN 1 ")
                    .append("WHEN certification LIKE '").append(pattern).append("' THEN 2 ")
                    .append("WHEN bio LIKE '").append(pattern).append("' THEN 3 ELSE 4 END");
            // 如果用户指定了 sortBy，则在 CASE 排序后追加次级排序
            if (dto.getSortBy() != null && !dto.getSortBy().isEmpty()) {
                boolean isAsc = "asc".equalsIgnoreCase(dto.getSortOrder());
                orderSql.append(", ").append(dto.getSortBy()).append(isAsc ? " ASC" : " DESC");
            }
            qw.last(orderSql.toString());
        } else if (dto.getSortBy() != null && !dto.getSortBy().isEmpty()) {
            boolean isAsc = "asc".equalsIgnoreCase(dto.getSortOrder());
            qw.orderBy(true, isAsc, dto.getSortBy());
        }

        if (dto.getTrainerId() != null) {
            qw.eq("trainer_id", dto.getTrainerId());
        }

        if (dto.getExperienceRange() != null && dto.getExperienceRange().size() == 2) {
            qw.between("experience",
                    dto.getExperienceRange().get(0),
                    dto.getExperienceRange().get(1));
        }

        if (dto.getCertificationStatus() != null) {
            qw.eq("is_certified", dto.getCertificationStatus());
        }

        if (dto.getStatus() != null) {
            qw.eq("status", dto.getStatus());
        }

        // 如果既没 keyword 也没 sortBy，就按 trainer_id 升序
        if (dto.getKeyword()==null && (dto.getSortBy()==null || dto.getSortBy().isEmpty())) {
            qw.orderByAsc("trainer_id");
        }
        return qw;
    }
}
