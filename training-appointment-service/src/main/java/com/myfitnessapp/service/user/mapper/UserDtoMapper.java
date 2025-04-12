package com.myfitnessapp.service.user.mapper;

import com.myfitnessapp.service.user.domain.User;
import com.myfitnessapp.service.user.dto.*;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface UserDtoMapper {

    // Entity -> DTO
    UserResponseDTO toUserResponseDTO(User user);

    // DTO -> Entity: 更新邮箱时，将 newEmail 映射到 email 字段
    @Mapping(source = "newEmail", target = "email")
    void userEmailUpdateDTOtoUser(UserEmailUpdateDTO userEmailUpdateDTO, @MappingTarget User user);

    // DTO -> Entity: 更新密码时，将 newPassword 映射到 password 字段
    @Mapping(source = "newPassword", target = "password")
    void userPasswordUpdateDTOtoUser(UserPasswordUpdateDTO userPasswordUpdateDTO, @MappingTarget User user);

    // DTO -> Entity: 用户注册时的转换
    User userRegistrationDTOtoUser(UserRegistrationDTO userRegistrationDTO);

    // DTO -> Entity: 更新用户基本信息
    @Mapping(source = "newName", target = "name")
    void userUpdateDTOtoUser(UserUpdateDTO userUpdateDTO, @MappingTarget User user);
}
