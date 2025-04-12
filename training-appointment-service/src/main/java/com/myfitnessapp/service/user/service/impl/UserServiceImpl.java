package com.myfitnessapp.service.user.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.myfitnessapp.service.exception.DuplicationEmailException;
import com.myfitnessapp.service.user.domain.Gender;
import com.myfitnessapp.service.user.domain.Status;
import com.myfitnessapp.service.user.domain.User;
import com.myfitnessapp.service.user.dto.*;
import com.myfitnessapp.service.user.mapper.UserDtoMapper;
import com.myfitnessapp.service.user.mapper.UserMapper;
import com.myfitnessapp.service.user.service.UserService;
import com.myfitnessapp.service.user.service.VerificationCodeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserServiceImpl implements UserService {

    private final UserMapper userMapper;
    private final UserDtoMapper userDtoMapper;
    private final BCryptPasswordEncoder passwordEncoder;
    private final VerificationCodeService verificationCodeService;

    @Autowired
    public UserServiceImpl(UserMapper userMapper, UserDtoMapper userDtoMapper, VerificationCodeService verificationCodeService) {
        this.userMapper = userMapper;
        this.userDtoMapper = userDtoMapper;
        this.verificationCodeService = verificationCodeService;
        this.passwordEncoder = new BCryptPasswordEncoder();
    }

    @Override
    public UserResponseDTO registerUser(UserRegistrationDTO userRegistrationDTO) {

        // Check that the password and confirmation password match
        if (!userRegistrationDTO.getPassword().equals(userRegistrationDTO.getConfirmPassword())) {
            throw new IllegalArgumentException("Password and confirmation password do not match");
        }

        boolean validCode = verificationCodeService.validateVerificationCode(
                userRegistrationDTO.getEmail(),
                userRegistrationDTO.getVerfiticationCode()
        );
        if (!validCode) {
            throw new IllegalArgumentException("Invalid verification code");
        }

        // Check if email is already existed
        QueryWrapper<User> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("email", userRegistrationDTO.getEmail());
        User existingUser = userMapper.selectOne(queryWrapper);
        if (existingUser != null) {
            throw new DuplicationEmailException("This email has been registered:" + userRegistrationDTO.getEmail());
        }

        User newUser = new User();
        newUser.setEmail(userRegistrationDTO.getEmail());
        newUser.setName(userRegistrationDTO.getName());
        newUser.setGender(userRegistrationDTO.getGender());

        // Encrypt password and save it to avoid plain text
        newUser.setPassword(passwordEncoder.encode(userRegistrationDTO.getPassword()));
        newUser.setStatus(Status.ACTIVE);

        userMapper.insert(newUser);

        return userDtoMapper.toUserResponseDTO(newUser);
    }
    @Override
    public UserResponseDTO loginUser(UserLoginDTO loginDTO) {
        // 先返回 null，后续再添加具体业务逻辑
        return null;
    }

    @Override
    public UserResponseDTO updateUser(Integer id, UserUpdateDTO userUpdateDTO) {
        // 根据 id 获取用户
        User user = userMapper.selectById(id);
        if (user == null) {
            throw new IllegalArgumentException("User not found with id: " + id);
        }
        // 如有需要，更新姓名和性别（其他字段也可按需要添加）
        if (userUpdateDTO.getNewName() != null) {
            user.setName(userUpdateDTO.getNewName());
        }
        if (userUpdateDTO.getNewGender() != null) {
            user.setGender(Gender.valueOf(userUpdateDTO.getNewGender()));
        }
        userMapper.updateById(user);
        return userDtoMapper.toUserResponseDTO(user);
    }

    @Override
    public UserResponseDTO updateUserPassword(Integer id, UserPasswordUpdateDTO userPasswordUpdateDTO) {
        // 先返回 null，后续再添加具体业务逻辑
        return null;
    }

    @Override
    public UserResponseDTO updateUserEmail(Integer id, UserEmailUpdateDTO userEmailUpdateDTO) {
        // 先返回 null，后续再添加具体业务逻辑
        return null;
    }

    @Override
    public void cancelAccount(Integer id) {
        // 方法体留空，后续再添加具体业务逻辑
    }
}
