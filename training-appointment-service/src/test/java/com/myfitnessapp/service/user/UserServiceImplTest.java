package com.myfitnessapp.service.user;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.myfitnessapp.service.exception.DuplicationEmailException;
import com.myfitnessapp.service.user.domain.Gender;
import com.myfitnessapp.service.user.domain.User;
import com.myfitnessapp.service.user.domain.UserStatus;
import com.myfitnessapp.service.user.dto.*;
import com.myfitnessapp.service.user.mapstruct.UserDtoMapper;
import com.myfitnessapp.service.user.mapper.UserMapper;
import com.myfitnessapp.service.user.service.VerificationCodeService;
import com.myfitnessapp.service.user.service.impl.UserServiceImpl;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.test.util.ReflectionTestUtils;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

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

    /**
     * 辅助方法：使用 ReflectionTestUtils 将 userService 内部的 passwordEncoder 替换为 mock 对象
     */
    private BCryptPasswordEncoder injectMockPasswordEncoder() {
        BCryptPasswordEncoder mockEncoder = mock(BCryptPasswordEncoder.class);
        ReflectionTestUtils.setField(userService, "passwordEncoder", mockEncoder);
        return mockEncoder;
    }

    @Test
    public void testRegisterUser_success() {
        // 构造注册 DTO，并设置新增字段
        UserRegistrationDTO regDTO = new UserRegistrationDTO();
        regDTO.setName("Mike");
        regDTO.setEmail("mike@gmail.com");
        regDTO.setPassword("Password123");
        regDTO.setConfirmPassword("Password123");
        regDTO.setVerifiticationCode("123456");
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
                    dto.setUserStatus(user.getUserStatus());
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
        assertEquals(UserStatus.ACTIVE, result.getUserStatus());
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
        regDTO.setVerifiticationCode(null);
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
        regDTO.setVerifiticationCode("wrongCode");

        // 验证码验证假设失败（Mock返回 false）
        when(verificationCodeService.validateVerificationCode(any(), any())).thenReturn(false);

        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () ->
                userService.registerUser(regDTO));
        assertTrue(exception.getMessage().contains("Invalid verification code"));
    }

    @Test
    public void testUpdateUserPassword_success() {

        // 使用具体的 BCryptPasswordEncoder 类型创建 mock 对象
        BCryptPasswordEncoder mockedPasswordEncoder = mock(BCryptPasswordEncoder.class);
        ReflectionTestUtils.setField(userService, "passwordEncoder", mockedPasswordEncoder);

        // 构造一个用户实体，模拟数据库中已有记录
        User user = new User();
        user.setUserId(10);
        user.setEmail("user@test.com");

        // 假设数据库中存储了编码后的旧密码
        user.setPassword("encodedOldPassword123");
        user.setUserStatus(UserStatus.ACTIVE);

        // 创建更新密码 DTO
        UserPasswordUpdateDTO updateDTO = new UserPasswordUpdateDTO();
        updateDTO.setOldPassword("oldPassword123");
        updateDTO.setNewPassword("NewPassword123");
        updateDTO.setConfirmPassword("NewPassword123");
        updateDTO.setVerfiticationCode("123456");

        // 模拟查询返回该用户
        when(userMapper.selectById(10)).thenReturn(user);
        // 模拟旧密码校验成功
        when(mockedPasswordEncoder.matches(anyString(), anyString())).thenReturn(true);
        // 模拟验证码服务校验成功（使用用户的邮箱）
        when(verificationCodeService.validateVerificationCode(user.getEmail(), "123456")).thenReturn(true);
        // 模拟新密码编码返回结果
        when(mockedPasswordEncoder.encode("NewPassword123")).thenReturn("encodedNewPassword123");
        // 模拟更新后返回 DTO（这里直接返回一个包含当前信息的 DTO）
        UserResponseDTO responseDTO = new UserResponseDTO();
        responseDTO.setUserId(10);
        responseDTO.setEmail(user.getEmail());
        responseDTO.setName(user.getName());
        responseDTO.setGender(user.getGender());
        responseDTO.setUserStatus(user.getUserStatus());
        when(userDtoMapper.toUserResponseDTO(user)).thenReturn(responseDTO);

        // 调用 updateUserPassword 方法
        UserResponseDTO result = userService.updateUserPassword(10, updateDTO);

        // 验证：用户对象的密码已更新为新编码密码
        assertEquals("encodedNewPassword123", user.getPassword());
        // 验证响应 DTO 各字段正确（此处状态仍然为 ACTIVE）
        assertNotNull(result);
        assertEquals(10, result.getUserId());
        assertEquals(UserStatus.ACTIVE, result.getUserStatus());
        // 验证 updateById 调用
        verify(userMapper).updateById(user);
    }

    @Test
    public void testUpdateUserPassword_wrongOldPassword() {
        // 使用具体的 BCryptPasswordEncoder 类型创建 mock 对象并注入
        BCryptPasswordEncoder mockedPasswordEncoder = mock(BCryptPasswordEncoder.class);
        ReflectionTestUtils.setField(userService, "passwordEncoder", mockedPasswordEncoder);

        // 构造一个用户实体，模拟数据库中已有记录
        User user = new User();
        user.setUserId(11);
        user.setEmail("user_wrong@test.com");
        // 假设存储的旧密码已被编码
        user.setPassword("encodedOldPassword123");
        user.setUserStatus(UserStatus.ACTIVE);

        // 创建更新密码 DTO，使用错误的旧密码
        UserPasswordUpdateDTO updateDTO = new UserPasswordUpdateDTO();
        updateDTO.setOldPassword("wrongOldPassword");
        updateDTO.setNewPassword("NewPassword456");
        updateDTO.setConfirmPassword("NewPassword456");
        updateDTO.setVerfiticationCode("123456");

        // 模拟根据用户 id 查找到该用户
        when(userMapper.selectById(11)).thenReturn(user);
        // 模拟密码校验，返回 false 表示旧密码不匹配
        when(mockedPasswordEncoder.matches("wrongOldPassword", "encodedOldPassword123")).thenReturn(false);

        // 断言调用 updateUserPassword 后抛出异常，并检查异常信息是否包含"Old password is incorrect."
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            userService.updateUserPassword(11, updateDTO);
        });
        assertTrue(exception.getMessage().contains("Old password is incorrect."));
    }

    @Test
    public void testLoginUser_success() {
        // 注入 mock 密码编码器
        BCryptPasswordEncoder mockedPasswordEncoder = injectMockPasswordEncoder();

        // 模拟存在的用户
        User user = new User();
        user.setUserId(20);
        user.setEmail("login@test.com");
        user.setPassword("encodedPassword");
        user.setUserStatus(UserStatus.ACTIVE);

        // 构造登录 DTO
        UserLoginDTO loginDTO = new UserLoginDTO();
        loginDTO.setEmail("login@test.com");
        loginDTO.setPassword("plainPassword");

        // 模拟根据 email 查询到用户（注意：登录方法中使用 QueryWrapper 查询）
        when(userMapper.selectOne(any(QueryWrapper.class))).thenReturn(user);
        // 模拟密码校验成功
        when(mockedPasswordEncoder.matches("plainPassword", "encodedPassword")).thenReturn(true);
        // 模拟转换为响应 DTO
        UserResponseDTO responseDTO = new UserResponseDTO();
        responseDTO.setUserId(20);
        responseDTO.setEmail(user.getEmail());
        when(userDtoMapper.toUserResponseDTO(user)).thenReturn(responseDTO);

        // 调用登录方法
        UserResponseDTO result = userService.loginUser(loginDTO);
        assertNotNull(result);
        assertEquals(20, result.getUserId());
        assertEquals("login@test.com", result.getEmail());
    }

    @Test
    public void testLoginUser_userNotFound() {
        UserLoginDTO loginDTO = new UserLoginDTO();
        loginDTO.setEmail("nonexistent@test.com");
        loginDTO.setPassword("whatever");

        // 模拟用户查询返回 null
        when(userMapper.selectOne(any(QueryWrapper.class))).thenReturn(null);

        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            userService.loginUser(loginDTO);
        });
        assertTrue(exception.getMessage().contains("Invalid email or password"));
    }

    @Test
    public void testLoginUser_invalidPassword() {
        // 注入 mock 密码编码器
        BCryptPasswordEncoder mockedPasswordEncoder = injectMockPasswordEncoder();

        User user = new User();
        user.setUserId(30);
        user.setEmail("login@test.com");
        user.setPassword("encodedPassword");
        user.setUserStatus(UserStatus.ACTIVE);

        UserLoginDTO loginDTO = new UserLoginDTO();
        loginDTO.setEmail("login@test.com");
        loginDTO.setPassword("wrongPassword");

        when(userMapper.selectOne(any(QueryWrapper.class))).thenReturn(user);
        when(mockedPasswordEncoder.matches("wrongPassword", "encodedPassword")).thenReturn(false);

        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            userService.loginUser(loginDTO);
        });
        assertTrue(exception.getMessage().contains("Invalid email or password"));
    }

    @Test
    public void testUpdateUser_success() {
        // 构造已有用户
        User user = new User();
        user.setUserId(40);
        user.setEmail("update@test.com");
        user.setName("OldName");
        user.setUserStatus(UserStatus.ACTIVE);

        // 构造更新 DTO，假设只更新名称
        UserUpdateDTO updateDTO = new UserUpdateDTO();
        updateDTO.setNewName("NewName");

        when(userMapper.selectById(40)).thenReturn(user);
        // 模拟 MapStruct 转换，直接将 DTO 中的新名称设置到用户上
        doAnswer(invocation -> {
            UserUpdateDTO dto = invocation.getArgument(0);
            User u = invocation.getArgument(1);
            u.setName(dto.getNewName());
            return null;
        }).when(userDtoMapper).userUpdateDTOtoUser(updateDTO, user);

        // 模拟转换为响应 DTO
        UserResponseDTO responseDTO = new UserResponseDTO();
        responseDTO.setUserId(40);
        responseDTO.setName("NewName");
        responseDTO.setEmail(user.getEmail());
        responseDTO.setUserStatus(user.getUserStatus());
        when(userDtoMapper.toUserResponseDTO(user)).thenReturn(responseDTO);

        // 调用更新用户方法
        UserResponseDTO result = userService.updateUser(40, updateDTO);
        assertNotNull(result);
        assertEquals("NewName", result.getName());
        verify(userMapper).updateById(user);
    }

    @Test
    public void testUpdateUser_userNotFound() {
        when(userMapper.selectById(50)).thenReturn(null);
        UserUpdateDTO updateDTO = new UserUpdateDTO();
        updateDTO.setNewName("AnyName");

        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            userService.updateUser(50, updateDTO);
        });
        assertTrue(exception.getMessage().contains("User not found"));
    }

    @Test
    public void testUpdateUserEmail_success() {
        // 注入 mock 密码编码器
        BCryptPasswordEncoder mockedPasswordEncoder = injectMockPasswordEncoder();

        // 构造现有用户
        User user = new User();
        user.setUserId(60);
        user.setEmail("old@test.com");
        user.setPassword("encodedPassword");
        user.setUserStatus(UserStatus.ACTIVE);

        // 构造更新邮箱 DTO
        UserEmailUpdateDTO updateEmailDTO = new UserEmailUpdateDTO();
        updateEmailDTO.setOldEmail("old@test.com");
        updateEmailDTO.setPassword("plainPassword");
        updateEmailDTO.setNewEmail("new@test.com");
        updateEmailDTO.setVerifiticationCode("999999");

        // 模拟用户查询返回该用户
        when(userMapper.selectById(60)).thenReturn(user);
        // 模拟密码校验成功
        when(mockedPasswordEncoder.matches("plainPassword", "encodedPassword")).thenReturn(true);
        // 模拟新邮箱查询未找到（未被占用）
        when(userMapper.selectOne(any(QueryWrapper.class))).thenReturn(null);
        // 模拟验证码验证成功
        when(verificationCodeService.validateVerificationCode("new@test.com", "999999")).thenReturn(true);
        // 模拟 MapStruct 转换，直接将新邮箱设置到用户上
        doAnswer(invocation -> {
            UserEmailUpdateDTO dto = invocation.getArgument(0);
            User u = invocation.getArgument(1);
            u.setEmail(dto.getNewEmail());
            return null;
        }).when(userDtoMapper).userEmailUpdateDTOtoUser(updateEmailDTO, user);
        // 模拟转换为响应 DTO
        UserResponseDTO responseDTO = new UserResponseDTO();
        responseDTO.setUserId(60);
        responseDTO.setEmail("new@test.com");
        responseDTO.setUserStatus(user.getUserStatus());
        when(userDtoMapper.toUserResponseDTO(user)).thenReturn(responseDTO);

        UserResponseDTO result = userService.updateUserEmail(60, updateEmailDTO);
        assertNotNull(result);
        assertEquals("new@test.com", result.getEmail());
        verify(userMapper).updateById(user);
    }

    @Test
    public void testUpdateUserEmail_oldEmailMismatch() {
        User user = new User();
        user.setUserId(70);
        user.setEmail("correct@test.com");
        when(userMapper.selectById(70)).thenReturn(user);

        UserEmailUpdateDTO updateEmailDTO = new UserEmailUpdateDTO();
        updateEmailDTO.setOldEmail("wrong@test.com");
        updateEmailDTO.setPassword("whatever");
        updateEmailDTO.setNewEmail("new@test.com");
        updateEmailDTO.setVerifiticationCode("000000");

        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> {
            userService.updateUserEmail(70, updateEmailDTO);
        });
        assertTrue(exception.getMessage().contains("Old email does not match current email"));
    }

    @Test
    public void testUpdateUserEmail_invalidPassword() {
        // 注入 mock 密码编码器
        BCryptPasswordEncoder mockedPasswordEncoder = injectMockPasswordEncoder();

        User user = new User();
        user.setUserId(80);
        user.setEmail("old@test.com");
        user.setPassword("encodedPassword");
        when(userMapper.selectById(80)).thenReturn(user);

        UserEmailUpdateDTO updateEmailDTO = new UserEmailUpdateDTO();
        updateEmailDTO.setOldEmail("old@test.com");
        updateEmailDTO.setPassword("wrongPassword");
        updateEmailDTO.setNewEmail("new@test.com");
        updateEmailDTO.setVerifiticationCode("000000");

        // 模拟密码校验失败
        when(mockedPasswordEncoder.matches("wrongPassword", "encodedPassword")).thenReturn(false);

        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            userService.updateUserEmail(80, updateEmailDTO);
        });
        assertTrue(exception.getMessage().contains("Password is incorrect"));
    }

    @Test
    public void testUpdateUserEmail_newEmailExists() {
        // 注入 mock 密码编码器
        BCryptPasswordEncoder mockedPasswordEncoder = injectMockPasswordEncoder();

        User user = new User();
        user.setUserId(90);
        user.setEmail("old@test.com");
        user.setPassword("encodedPassword");
        when(userMapper.selectById(90)).thenReturn(user);

        UserEmailUpdateDTO updateEmailDTO = new UserEmailUpdateDTO();
        updateEmailDTO.setOldEmail("old@test.com");
        updateEmailDTO.setPassword("plainPassword");
        updateEmailDTO.setNewEmail("existing@test.com");
        updateEmailDTO.setVerifiticationCode("123123");

        // 模拟密码校验成功
        when(mockedPasswordEncoder.matches("plainPassword", "encodedPassword")).thenReturn(true);
        // 模拟查询发现已有用户占用新邮箱（返回非当前用户的记录）
        User existingUser = new User();
        existingUser.setUserId(999);
        existingUser.setEmail("existing@test.com");
        when(userMapper.selectOne(any(QueryWrapper.class))).thenReturn(existingUser);

        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            userService.updateUserEmail(90, updateEmailDTO);
        });
        assertTrue(exception.getMessage().contains("New email is already registered"));
    }

    @Test
    public void testUpdateUserEmail_invalidVerificationCode() {
        User user = new User();
        user.setUserId(100);
        user.setEmail("old@test.com");
        user.setPassword("encodedPassword");
        when(userMapper.selectById(100)).thenReturn(user);

        UserEmailUpdateDTO updateEmailDTO = new UserEmailUpdateDTO();
        updateEmailDTO.setOldEmail("old@test.com");
        updateEmailDTO.setPassword("plainPassword");
        updateEmailDTO.setNewEmail("new@test.com");
        updateEmailDTO.setVerifiticationCode("badCode");

        // 注入 mock 密码编码器
        BCryptPasswordEncoder mockedPasswordEncoder = injectMockPasswordEncoder();
        // 模拟密码校验成功
        when(mockedPasswordEncoder.matches("plainPassword", "encodedPassword")).thenReturn(true);
        // 模拟新邮箱未被占用
        when(userMapper.selectOne(any(QueryWrapper.class))).thenReturn(null);
        // 模拟验证码验证失败
        when(verificationCodeService.validateVerificationCode("new@test.com", "badCode")).thenReturn(false);

        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> {
            userService.updateUserEmail(100, updateEmailDTO);
        });
        assertTrue(exception.getMessage().contains("Invalid verification code for new email"));
    }

    @Test
    public void testCancelAccount_success() {
        User user = new User();
        user.setUserId(110);
        user.setUserStatus(UserStatus.ACTIVE);
        when(userMapper.selectById(110)).thenReturn(user);

        // 调用注销账户方法
        userService.cancelAccount(110);
        // 注销后状态应更新为 INACTIVE
        assertEquals(UserStatus.INACTIVE, user.getUserStatus());
        verify(userMapper).updateById(user);
    }

    @Test
    public void testCancelAccount_userNotFound() {
        when(userMapper.selectById(120)).thenReturn(null);
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            userService.cancelAccount(120);
        });
        assertTrue(exception.getMessage().contains("User not found"));
    }
}
