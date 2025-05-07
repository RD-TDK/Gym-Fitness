package com.myfitnessapp.service.user.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.myfitnessapp.service.exception.DuplicationEmailException;
import com.myfitnessapp.service.exception.InvalidCredentialsException;
import com.myfitnessapp.service.exception.InvalidVerificationCodeException;
import com.myfitnessapp.service.exception.AccountCancelledException;
import com.myfitnessapp.service.user.domain.Role;
import com.myfitnessapp.service.user.domain.User;
import com.myfitnessapp.service.user.domain.UserStatus;
import com.myfitnessapp.service.user.dto.*;
import com.myfitnessapp.service.user.mapstruct.UserDtoMapper;
import com.myfitnessapp.service.user.mapper.UserMapper;
import com.myfitnessapp.service.user.service.UserService;
import com.myfitnessapp.service.user.service.VerificationCodeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@SuppressWarnings("SpringJavaInjectionPointsAutowiringInspection")
@Service
public class UserServiceImpl implements UserService {

    private final UserMapper userMapper;
    private final UserDtoMapper userDtoMapper;
    private final BCryptPasswordEncoder passwordEncoder;
    private final VerificationCodeService verificationCodeService;

    @Autowired
    public UserServiceImpl(UserMapper userMapper,UserDtoMapper userDtoMapper, VerificationCodeService verificationCodeService) {
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
                userRegistrationDTO.getVerificationCode()
        );
        if (!validCode) {
            throw new InvalidVerificationCodeException();
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
        newUser.setRole(Role.VISITOR);
        newUser.setPhone(userRegistrationDTO.getPhoneNumber());
        newUser.setAddress(userRegistrationDTO.getAddress());
        newUser.setBirthday(userRegistrationDTO.getBirthday());

        // Encrypt password and save it to avoid plain text
        newUser.setPassword(passwordEncoder.encode(userRegistrationDTO.getPassword()));
        newUser.setUserStatus(UserStatus.ACTIVE);

        userMapper.insert(newUser);

        return userDtoMapper.toUserResponseDTO(newUser);
    }

    @Override
    public UserResponseDTO loginUser(UserLoginDTO loginDTO) {
        //According to the email structure to construct the query conditions, make sure to find the corresponding user.
        QueryWrapper<User> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("email", loginDTO.getEmail());
        User user = userMapper.selectOne(queryWrapper);

        //If the user cannot be found, throw a uniform "Email or password error" exception
        if (user == null) {
            throw new InvalidCredentialsException();
        }

        // Verify whether the password passed in from the front end matches the encrypted password in the database
        if (!passwordEncoder.matches(loginDTO.getPassword(), user.getPassword())) {
            throw new InvalidCredentialsException();
        }

        // Check the user's status based on business logic
        // If the status is INACTIVE (soft deleted)
        if (user.getUserStatus() == UserStatus.INACTIVE) {
            throw new AccountCancelledException("\"This account has been cancelled, please contact the administrator to restore it");
        }
        //If the status is SUSPENDED
        else if (user.getUserStatus() == UserStatus.SUSPENDED) {
            throw new RuntimeException("This account has been banned, please contact the administrator to unblock");
        }

        // If the status is "ACTIVE", the login processing will continue
        return userDtoMapper.toUserResponseDTO(user);
    }

    @Override
    public UserResponseDTO updateUser(Integer id, UserUpdateDTO userUpdateDTO) {
        User user = userMapper.selectById(id);
        if (user == null) {
            throw new RuntimeException("User not found with id: " + id);
        }
        // MapStruct implements DTO to entity conversion
        userDtoMapper.userUpdateDTOtoUser(userUpdateDTO, user);
        userMapper.updateById(user);
        return userDtoMapper.toUserResponseDTO(user);
    }

    @Override
    public UserResponseDTO updateUserPassword(Integer id, UserPasswordUpdateDTO userPasswordUpdateDTO) {
        // Query the user based on the user id
        User user = userMapper.selectById(id);
        if (user == null) {
            throw new RuntimeException("User not found with id: " + id);
        }

        // Verify whether the old password is correct
        if (!passwordEncoder.matches(userPasswordUpdateDTO.getOldPassword(), user.getPassword())) {
            throw new InvalidCredentialsException("Old password is incorrect.");
        }

        // Verify that the verification code is valid through the verification code service
        boolean validCode = verificationCodeService.validateVerificationCode(
                user.getEmail(),
                userPasswordUpdateDTO.getVerificationCode()
        );
        if (!validCode) {
            throw new InvalidVerificationCodeException();
        }

        if (!userPasswordUpdateDTO.getNewPassword().equals(userPasswordUpdateDTO.getConfirmPassword())) {
            throw new IllegalArgumentException("New password and confirm password do not match.");
        }

        user.setPassword(passwordEncoder.encode(userPasswordUpdateDTO.getNewPassword()));
        userMapper.updateById(user);

        return userDtoMapper.toUserResponseDTO(user);
    }

//    @Override
//    public UserResponseDTO updateUserEmail(Integer id, UserEmailUpdateDTO userEmailUpdateDTO) {
//        // 1. 根据用户 id 查询用户是否存在
//        User user = userMapper.selectById(id);
//        if (user == null) {
//            throw new RuntimeException("User not found with id: " + id);
//        }
//
//        // 2. 校验前端传入的旧邮箱是否与当前用户的邮箱匹配（可选）
//        if (!user.getEmail().equalsIgnoreCase(userEmailUpdateDTO.getOldEmail())) {
//            throw new IllegalArgumentException("Old email does not match current email.");
//        }
//
//        // 3. 校验用户的密码是否正确（确认修改操作是由该用户发起的）
//        if (!passwordEncoder.matches(userEmailUpdateDTO.getPassword(), user.getPassword())) {
//            throw new RuntimeException("Password is incorrect.");
//        }
//
//        // 4. 检查新邮箱是否已经被其他用户注册
//        QueryWrapper<User> queryWrapper = new QueryWrapper<>();
//        queryWrapper.eq("email", userEmailUpdateDTO.getNewEmail());
//        User existingUser = userMapper.selectOne(queryWrapper);
//        if (existingUser != null && !existingUser.getUserId().equals(user.getUserId())) {
//            throw new RuntimeException("New email is already registered: " + userEmailUpdateDTO.getNewEmail());
//        }
//
//        // 5. 调用验证码服务，使用新邮箱和验证码进行验证
//        boolean validCode = verificationCodeService.validateVerificationCode(
//                userEmailUpdateDTO.getNewEmail(),
//                userEmailUpdateDTO.getVerificationCode()  // 注意字段名要与 DTO 保持一致
//        );
//        if (!validCode) {
//            throw new InvalidVerificationCodeException();
//        }
//
//        // 6. 更新用户的邮箱。此处可以使用 MapStruct 完成 DTO -> 实体的转换
//        userDtoMapper.userEmailUpdateDTOtoUser(userEmailUpdateDTO, user);
//
//        // 7. 将更新后的用户保存到数据库
//        userMapper.updateById(user);
//
//        // 8. 返回用户更新后的信息，转换为响应 DTO
//        return userDtoMapper.toUserResponseDTO(user);
//    }

    @Override
    public void cancelAccount(Integer id) {
        User user = userMapper.selectById(id);
        if (user == null) {
            throw new RuntimeException("User not found with id: " + id);
        }
        // 软删除：将状态设置为 INACTIVE 表示账号取消
        user.setUserStatus(UserStatus.INACTIVE);
        userMapper.updateById(user);
    }

    @Override
    public User loadDomainUserByEmail(String email) {
        QueryWrapper<User> query = new QueryWrapper<>();
        query.eq("email", email);
        return userMapper.selectOne(query);
    }


}
