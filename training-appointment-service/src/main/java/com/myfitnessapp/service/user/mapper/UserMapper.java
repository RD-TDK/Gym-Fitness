package com.myfitnessapp.service.user.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.myfitnessapp.service.user.domain.User;
import org.apache.ibatis.annotations.Mapper;
import org.springframework.stereotype.Repository;

@Mapper
@Repository
public interface UserMapper extends BaseMapper<User> {
}
