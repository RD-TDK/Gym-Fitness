package com.myfitnessapp.service.session.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.myfitnessapp.service.session.model.SessionInfo;
import org.apache.ibatis.annotations.Mapper;
import org.springframework.stereotype.Repository;

/**
 * SessionInfoMapper Implement，for session_info CRUD
 */
@Repository
@Mapper
public interface SessionInfoMapper extends BaseMapper<SessionInfo> {

}
