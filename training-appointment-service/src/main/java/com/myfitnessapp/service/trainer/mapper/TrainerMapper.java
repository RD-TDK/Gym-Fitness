package com.myfitnessapp.service.trainer.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.myfitnessapp.service.trainer.domain.Trainer;
import org.apache.ibatis.annotations.Mapper;
import org.springframework.stereotype.Repository;

@Mapper
@Repository
public interface TrainerMapper extends BaseMapper<Trainer> {
}
