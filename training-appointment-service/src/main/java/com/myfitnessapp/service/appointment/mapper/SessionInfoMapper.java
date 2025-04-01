package com.myfitnessapp.service.appointment.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.myfitnessapp.service.appointment.model.SessionInfo;
import org.apache.ibatis.annotations.Mapper;

/**
 * SessionInfoMapper Implement，for session_info CRUD
 */
@Mapper
public interface SessionInfoMapper extends BaseMapper<SessionInfo> {

}
