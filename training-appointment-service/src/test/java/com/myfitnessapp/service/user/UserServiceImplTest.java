package com.myfitnessapp.service.user;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.myfitnessapp.service.exception.DuplicationEmailException;
import com.myfitnessapp.service.user.domain.Gender;
import com.myfitnessapp.service.user.domain.Status;
import com.myfitnessapp.service.user.domain.User;
import com.myfitnessapp.service.user.dto.UserRegistrationDTO;
import com.myfitnessapp.service.user.dto.UserResponseDTO;
import com.myfitnessapp.service.user.mapper.UserDtoMapper;
import com.myfitnessapp.service.user.mapper.UserMapper;
import com.myfitnessapp.service.user.service.VerificationCodeService;
import com.myfitnessapp.service.user.service.impl.UserServiceImpl;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doAnswer;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class UserServiceImplTest {

    @Mock
    private UserMapper userMapper;

    @Mock
    private UserDtoMapper userDtoMapper;

    @Mock
    private VerificationCodeService verificationCodeService;

    @InjectMocks
    private UserServiceImpl userService;

    @Test
    public void testRegisterUser_success() {
        // 构造注册 DTO，并设置新增字段
        UserRegistrationDTO regDTO = new UserRegistrationDTO();
        regDTO.setName("Mike");
        regDTO.setEmail("mike@gmail.com");
        regDTO.setPassword("Password123");
        regDTO.setConfirmPassword("Password123");
        regDTO.setVerfiticationCode("123456");
        regDTO.setGender(Gender.MALE);

        // 假设验证码验证成功
        when(verificationCodeService.validateVerificationCode(any(), any())).thenReturn(true);

        // 模拟 UserDtoMapper 将 User 对象映射为响应 DTO
        when(userDtoMapper.toUserResponseDTO(any(User.class)))
                .thenAnswer(invocation -> {
                    User user = invocation.getArgument(0);
                    UserResponseDTO dto = new UserResponseDTO();
                    dto.setUserId(user.getUserId());
                    dto.setName(user.getName());
                    dto.setEmail(user.getEmail());
                    dto.setGender(user.getGender());
                    dto.setStatus(user.getStatus());
                    return dto;
                });

        // 模拟邮箱不存在
        when(userMapper.selectOne(any(QueryWrapper.class))).thenReturn(null);

        // 模拟数据库插入行为：插入后给 user 设置 userId
        doAnswer(invocation -> {
            User user = invocation.getArgument(0);
            user.setUserId(1);
            return 1;
        }).when(userMapper).insert(any(User.class));

        // 调用注册方法
        UserResponseDTO result = userService.registerUser(regDTO);

        // 验证返回结果
        assertNotNull(result);
        assertEquals(1, result.getUserId());
        assertEquals("Mike", result.getName());
        assertEquals("mike@gmail.com", result.getEmail());
        assertEquals(Gender.MALE, result.getGender());
        assertEquals(Status.ACTIVE, result.getStatus());
    }

    @Test
    public void testRegisterUser_DuplicationEmail() {
        UserRegistrationDTO regDTO = new UserRegistrationDTO();
        regDTO.setName("Lisa");
        regDTO.setEmail("Lisa@gmail.com");
        regDTO.setPassword("Password123");
        regDTO.setConfirmPassword("Password123");
        regDTO.setGender(Gender.FEMALE);

        // Simylated the code verified succeed
        when(verificationCodeService.validateVerificationCode(any(), any())).thenReturn(true);

        //Simulated query to existing user, duplicated Email
        User existingUser = new User();
        existingUser.setUserId(2);
        existingUser.setEmail("Lisa@gmail.com");

        when(userMapper.selectOne(any(QueryWrapper.class))).thenReturn(existingUser);

        DuplicationEmailException exception = assertThrows(DuplicationEmailException.class, () ->
                userService.registerUser(regDTO));

        assertTrue(exception.getMessage().contains("This email has been registered:"));
    }

    @Test
    public void testRegisterUser_passwordMismatch() {
        UserRegistrationDTO regDTO = new UserRegistrationDTO();
        regDTO.setName("TestUser");
        regDTO.setEmail("test@example.com");
        regDTO.setPassword("Password123");
        regDTO.setConfirmPassword("Password321"); // 不匹配
        regDTO.setVerfiticationCode(null);
        regDTO.setGender(Gender.MALE);
        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () ->
                userService.registerUser(regDTO));
        assertTrue(exception.getMessage().contains("do not match"));
    }

    @Test
    public void testRegisterUser_invalidVerificationCode() {
        UserRegistrationDTO regDTO = new UserRegistrationDTO();
        regDTO.setName("TestUser");
        regDTO.setEmail("test@example.com");
        regDTO.setPassword("Password123");
        regDTO.setConfirmPassword("Password123");
        regDTO.setVerfiticationCode("wrongCode");

        // 验证码验证假设失败（Mock返回 false）
        when(verificationCodeService.validateVerificationCode(any(), any())).thenReturn(false);

        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () ->
                userService.registerUser(regDTO));
        assertTrue(exception.getMessage().contains("Invalid verification code"));
    }
}
