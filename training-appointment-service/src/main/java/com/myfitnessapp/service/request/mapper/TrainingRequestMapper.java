package com.myfitnessapp.service.request.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.myfitnessapp.service.request.model.TrainingRequest;
import org.apache.ibatis.annotations.Mapper;
import org.springframework.stereotype.Repository;

@Mapper
@Repository
public interface TrainingRequestMapper extends BaseMapper<TrainingRequest> {
}
