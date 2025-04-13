package com.myfitnessapp.trainingappointment;

import com.myfitnessapp.service.user.domain.Gender;
import com.myfitnessapp.service.user.dto.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.http.*;

import java.util.Objects;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest(classes = {TrainingAppointmentApplication.class}, webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
public class UserControllerTest {

    @Autowired
    private TestRestTemplate restTemplate;

    @Autowired
    private StringRedisTemplate stringRedisTemplate;

    @Test
    public void testSendVerificationCode() {
        // Generate a random email
        String randomEmail = "test" + System.currentTimeMillis() + "@test.com";
        String url = "/api/users/sendVerificationCode?email=" + randomEmail;

        // 发送 POST 请求（注意：接口映射是 POST）
        ResponseEntity<String> response = restTemplate.postForEntity(url, null, String.class);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        // 根据 Controller 的返回提示信息进行断言（请确保提示信息与实际一致）
        assertTrue(Objects.requireNonNull(response.getBody()).contains("Verification Code sent"));
    }

    @Test
    public void testRegisterUserFlow() {
        // 1. 使用固定或随机测试邮箱
        String testEmail = "testReg" + System.currentTimeMillis() + "@test.com";

        // 2. 调用发送验证码接口（模拟真实流程）
        String sendCodeUrl = "/api/users/sendVerificationCode?email=" + testEmail;
        ResponseEntity<String> sendResponse = restTemplate.postForEntity(sendCodeUrl, null, String.class);
        assertEquals(HttpStatus.OK, sendResponse.getStatusCode());

        try {
            Thread.sleep(1000);  // 延时1秒
        } catch (InterruptedException e) {
            e.printStackTrace();
        }

        String redisKey = "verification_code:" + testEmail;
        String verificationCode = stringRedisTemplate.opsForValue().get(redisKey);
        assertNotNull(verificationCode, "The verification code read from Redis should not be null");


        // 4. 构造注册请求 DTO
        UserRegistrationDTO regDTO = new UserRegistrationDTO();
        regDTO.setName("TestUser");
        regDTO.setEmail(testEmail);
        regDTO.setPassword("Password123");
        regDTO.setConfirmPassword("Password123");
        regDTO.setVerifiticationCode(verificationCode);
        regDTO.setGender(Gender.MALE);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<UserRegistrationDTO> request = new HttpEntity<>(regDTO, headers);

        // 5. 调用注册接口
        ResponseEntity<UserResponseDTO> registerResponse = restTemplate.postForEntity("/api/users/register", request, UserResponseDTO.class);
        assertEquals(HttpStatus.OK, registerResponse.getStatusCode());
        UserResponseDTO responseDTO = registerResponse.getBody();
        assertNotNull(responseDTO);
        assertEquals("TestUser", responseDTO.getName());
        assertEquals(testEmail, responseDTO.getEmail());
        assertEquals(Gender.MALE, responseDTO.getGender());
    }

    /**
     * 测试登录功能：先发送验证码并注册新用户，然后用正确密码登录。
     */
    @Test
    public void testLoginUser() {
        // 1. 使用固定或随机测试邮箱
        String testEmail = "testLogin" + System.currentTimeMillis() + "@test.com";

        // 2. 调用发送验证码接口（模拟真实流程）
        String sendCodeUrl = "/api/users/sendVerificationCode?email=" + testEmail;
        ResponseEntity<String> sendResponse = restTemplate.postForEntity(sendCodeUrl, null, String.class);
        assertEquals(HttpStatus.OK, sendResponse.getStatusCode());

        try {
            Thread.sleep(1000);  // 延时1秒
        } catch (InterruptedException e) {
            e.printStackTrace();
        }

        String redisKey = "verification_code:" + testEmail;
        String verificationCode = stringRedisTemplate.opsForValue().get(redisKey);
        assertNotNull(verificationCode, "The verification code read from Redis should not be null");

        // 3. 注册用户
        UserRegistrationDTO regDTO = new UserRegistrationDTO();
        regDTO.setName("LoginUser");
        regDTO.setEmail(testEmail);
        regDTO.setPassword("LoginPass123");
        regDTO.setConfirmPassword("LoginPass123");
        regDTO.setVerifiticationCode(verificationCode);
        regDTO.setGender(Gender.MALE);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<UserRegistrationDTO> registerRequest = new HttpEntity<>(regDTO, headers);
        ResponseEntity<UserResponseDTO> registerResponse = restTemplate.postForEntity("/api/users/register", registerRequest, UserResponseDTO.class);
        assertEquals(HttpStatus.OK, registerResponse.getStatusCode());

        // 4. 调用登录接口
        UserLoginDTO loginDTO = new UserLoginDTO();
        loginDTO.setEmail(testEmail);
        loginDTO.setPassword("LoginPass123");

        HttpEntity<UserLoginDTO> loginRequest = new HttpEntity<>(loginDTO, headers);
        ResponseEntity<UserResponseDTO> loginResponse = restTemplate.postForEntity("/api/users/login", loginRequest, UserResponseDTO.class);

        assertEquals(HttpStatus.OK, loginResponse.getStatusCode(), "Login should succeed with correct password");
        assertNotNull(loginResponse.getBody());
        assertEquals(testEmail, loginResponse.getBody().getEmail());
    }

    /**
     * 测试更新用户基本信息：先注册新用户，然后更新名称。
     */
    @Test
    public void testUpdateUser() {
        // 1. 使用固定或随机测试邮箱
        String testEmail = "testUpdate" + System.currentTimeMillis() + "@test.com";

        // 2. 调用发送验证码接口（模拟真实流程）
        String sendCodeUrl = "/api/users/sendVerificationCode?email=" + testEmail;
        ResponseEntity<String> sendResponse = restTemplate.postForEntity(sendCodeUrl, null, String.class);
        assertEquals(HttpStatus.OK, sendResponse.getStatusCode());

        try {
            Thread.sleep(1000);  // 延时1秒
        } catch (InterruptedException e) {
            e.printStackTrace();
        }

        String redisKey = "verification_code:" + testEmail;
        String verificationCode = stringRedisTemplate.opsForValue().get(redisKey);
        assertNotNull(verificationCode, "The verification code read from Redis should not be null");

        UserRegistrationDTO regDTO = new UserRegistrationDTO();
        regDTO.setName("OriginalName");
        regDTO.setEmail(testEmail);
        regDTO.setPassword("UpdatePass123");
        regDTO.setConfirmPassword("UpdatePass123");
        regDTO.setVerifiticationCode(verificationCode);
        regDTO.setGender(Gender.FEMALE);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<UserRegistrationDTO> registerRequest = new HttpEntity<>(regDTO, headers);
        ResponseEntity<UserResponseDTO> registerResp = restTemplate.postForEntity("/api/users/register", registerRequest, UserResponseDTO.class);
        assertEquals(HttpStatus.OK, registerResp.getStatusCode());
        assertNotNull(registerResp.getBody());
        Integer userId = registerResp.getBody().getUserId();
        assertNotNull(userId);

        // 2. 更新用户信息
        UserUpdateDTO updateDTO = new UserUpdateDTO();
        updateDTO.setNewName("UpdatedName");
        HttpEntity<UserUpdateDTO> updateRequest = new HttpEntity<>(updateDTO, headers);

        String url = "/api/users/" + userId;
        ResponseEntity<UserResponseDTO> updateResp = restTemplate.exchange(url, HttpMethod.PUT, updateRequest, UserResponseDTO.class);
        assertEquals(HttpStatus.OK, updateResp.getStatusCode());
        assertNotNull(updateResp.getBody());
        assertEquals("UpdatedName", updateResp.getBody().getName());
    }

    /**
     * 测试更新用户密码：先注册用户，然后用旧密码、验证码更新为新密码，再用新密码登录验证。
     */
    @Test
    public void testUpdateUserPassword() throws InterruptedException {
        // 1. 使用固定或随机测试邮箱
        String testEmail = "testUpPass" + System.currentTimeMillis() + "@test.com";

        // 2. 调用发送验证码接口（模拟真实流程）
        String sendCodeUrl = "/api/users/sendVerificationCode?email=" + testEmail;
        ResponseEntity<String> sendResponse = restTemplate.postForEntity(sendCodeUrl, null, String.class);
        assertEquals(HttpStatus.OK, sendResponse.getStatusCode());

        try {
            Thread.sleep(1000);  // 延时1秒
        } catch (InterruptedException e) {
            e.printStackTrace();
        }

        String redisKey = "verification_code:" + testEmail;
        String verificationCode = stringRedisTemplate.opsForValue().get(redisKey);
        assertNotNull(verificationCode, "The verification code read from Redis should not be null");

        UserRegistrationDTO regDTO = new UserRegistrationDTO();
        regDTO.setName("PwdUser");
        regDTO.setEmail(testEmail);
        regDTO.setPassword("OldPassword123");
        regDTO.setConfirmPassword("OldPassword123");
        regDTO.setVerifiticationCode(verificationCode);
        regDTO.setGender(Gender.MALE);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<UserRegistrationDTO> registerRequest = new HttpEntity<>(regDTO, headers);
        ResponseEntity<UserResponseDTO> registerResp = restTemplate.postForEntity("/api/users/register", registerRequest, UserResponseDTO.class);
        assertEquals(HttpStatus.OK, registerResp.getStatusCode());
        Integer userId = registerResp.getBody().getUserId();
        assertNotNull(userId);

        // 模拟做其他验证，或者等待一小段时间以确保验证码已写入 Redis
        // 在不等待 60 秒的情况下，主动清除限流 key，允许再次请求
        String rateLimitKey = "verification_code:limit:" + testEmail;
        stringRedisTemplate.delete(rateLimitKey);


        // 2. 重新发送验证码以更新密码（部分业务需要再次验证码）
        restTemplate.postForEntity("/api/users/sendVerificationCode?email=" + testEmail, null, String.class);
        Thread.sleep(1000);
        String verifyCodeForPwd = stringRedisTemplate.opsForValue().get("verification_code:" + testEmail);
        assertNotNull(verifyCodeForPwd);

        // 3. 构造更新密码 DTO
        UserPasswordUpdateDTO pwdDTO = new UserPasswordUpdateDTO();
        pwdDTO.setOldPassword("OldPassword123");
        pwdDTO.setNewPassword("NewPassword456");
        pwdDTO.setConfirmPassword("NewPassword456");
        pwdDTO.setVerfiticationCode(verifyCodeForPwd);

        HttpEntity<UserPasswordUpdateDTO> updatePwdRequest = new HttpEntity<>(pwdDTO, headers);
        String updateUrl = "/api/users/" + userId + "/password";
        ResponseEntity<UserResponseDTO> updateResp = restTemplate.exchange(updateUrl, HttpMethod.PUT, updatePwdRequest, UserResponseDTO.class);
        assertEquals(HttpStatus.OK, updateResp.getStatusCode());

        // 4. 用新密码登录
        UserLoginDTO loginDTO = new UserLoginDTO();
        loginDTO.setEmail(testEmail);
        loginDTO.setPassword("NewPassword456");
        ResponseEntity<UserResponseDTO> loginResp = restTemplate.postForEntity("/api/users/login", new HttpEntity<>(loginDTO, headers), UserResponseDTO.class);
        assertEquals(HttpStatus.OK, loginResp.getStatusCode());
        assertNotNull(loginResp.getBody());
    }

    /**
     * 测试更新用户邮箱：先注册 + 旧邮箱登录成功，然后用新邮箱 + 验证码更新。
     */
    @Test
    public void testUpdateUserEmail() throws InterruptedException {
        // 1. 使用固定或随机测试邮箱
        String oldEmail = "old" + System.currentTimeMillis() + "@test.com";

        // 2. 调用发送验证码接口（模拟真实流程）
        String sendCodeUrl = "/api/users/sendVerificationCode?email=" + oldEmail;
        ResponseEntity<String> sendResponse = restTemplate.postForEntity(sendCodeUrl, null, String.class);
        assertEquals(HttpStatus.OK, sendResponse.getStatusCode());

        try {
            Thread.sleep(1000);  // 延时1秒
        } catch (InterruptedException e) {
            e.printStackTrace();
        }

        String redisKey = "verification_code:" + oldEmail;
        String oldCode = stringRedisTemplate.opsForValue().get(redisKey);
        assertNotNull(oldCode, "The verification code read from Redis should not be null");


        UserRegistrationDTO regDTO = new UserRegistrationDTO();
        regDTO.setName("EmailUser");
        regDTO.setEmail(oldEmail);
        regDTO.setPassword("EmailPass123");
        regDTO.setConfirmPassword("EmailPass123");
        regDTO.setVerifiticationCode(oldCode);
        regDTO.setGender(Gender.FEMALE);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<UserRegistrationDTO> registerReq = new HttpEntity<>(regDTO, headers);
        ResponseEntity<UserResponseDTO> regResp = restTemplate.postForEntity("/api/users/register", registerReq, UserResponseDTO.class);
        assertEquals(HttpStatus.OK, regResp.getStatusCode());
        Integer userId = regResp.getBody().getUserId();
        assertNotNull(userId);

        // 2. 给新邮箱发送验证码
        String newEmail = "new" + System.currentTimeMillis() + "@test.com";
        restTemplate.postForEntity("/api/users/sendVerificationCode?email=" + newEmail, null, String.class);
        Thread.sleep(1000);
        String newCode = stringRedisTemplate.opsForValue().get("verification_code:" + newEmail);
        assertNotNull(newCode);

        // 3. 构造更新邮箱 DTO
        UserEmailUpdateDTO emailDTO = new UserEmailUpdateDTO();
        emailDTO.setOldEmail(oldEmail);
        emailDTO.setPassword("EmailPass123");
        emailDTO.setNewEmail(newEmail);
        emailDTO.setVerifiticationCode(newCode);

        HttpEntity<UserEmailUpdateDTO> updateReq = new HttpEntity<>(emailDTO, headers);
        String updateUrl = "/api/users/" + userId + "/email";
        ResponseEntity<UserResponseDTO> updateResp = restTemplate.exchange(updateUrl, HttpMethod.PUT, updateReq, UserResponseDTO.class);
        assertEquals(HttpStatus.OK, updateResp.getStatusCode());
        assertNotNull(updateResp.getBody());
        assertEquals(newEmail, updateResp.getBody().getEmail());

        // 4. 尝试用新邮箱登录
        UserLoginDTO loginDTO = new UserLoginDTO();
        loginDTO.setEmail(newEmail);
        loginDTO.setPassword("EmailPass123");
        ResponseEntity<UserResponseDTO> loginResp = restTemplate.postForEntity("/api/users/login", new HttpEntity<>(loginDTO, headers), UserResponseDTO.class);
        assertEquals(HttpStatus.OK, loginResp.getStatusCode());
        assertNotNull(loginResp.getBody());
        assertEquals(newEmail, loginResp.getBody().getEmail());
    }

    /**
     * 测试注销账号：先注册，再注销，然后尝试登录应失败。
     */
    @Test
    public void testCancelAccount() throws InterruptedException {
        // 1. 注册用户
        String email = "cancel" + System.currentTimeMillis() + "@test.com";
        restTemplate.postForEntity("/api/users/sendVerificationCode?email=" + email, null, String.class);
        Thread.sleep(1000);
        String code = stringRedisTemplate.opsForValue().get("verification_code:" + email);
        assertNotNull(code);

        UserRegistrationDTO regDTO = new UserRegistrationDTO();
        regDTO.setName("CancelUser");
        regDTO.setEmail(email);
        regDTO.setPassword("CancelPass123");
        regDTO.setConfirmPassword("CancelPass123");
        regDTO.setVerifiticationCode(code);
        regDTO.setGender(Gender.MALE);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<UserRegistrationDTO> registerRequest = new HttpEntity<>(regDTO, headers);
        ResponseEntity<UserResponseDTO> registerResp = restTemplate.postForEntity("/api/users/register", registerRequest, UserResponseDTO.class);
        assertEquals(HttpStatus.OK, registerResp.getStatusCode());
        Integer userId = registerResp.getBody().getUserId();
        assertNotNull(userId);

        // 2. 注销
        String cancelUrl = "/api/users/" + userId;
        ResponseEntity<String> cancelResp = restTemplate.exchange(cancelUrl, HttpMethod.DELETE, null, String.class);
        assertEquals(HttpStatus.OK, cancelResp.getStatusCode());
        assertTrue(cancelResp.getBody().contains("cancelled"), "Should contain 'cancelled' in response");

        // 3. 注销后尝试登录
        UserLoginDTO loginDTO = new UserLoginDTO();
        loginDTO.setEmail(email);
        loginDTO.setPassword("CancelPass123");
        HttpEntity<UserLoginDTO> loginRequest = new HttpEntity<>(loginDTO, headers);

        ResponseEntity<String> loginResp = restTemplate.postForEntity("/api/users/login", loginRequest, String.class);
        // 账号已注销，期望登录失败 (看你的全局异常处理，可能是 400、401、403、500 等)
        assertTrue(loginResp.getStatusCode().isError(), "Cancelled account should fail login");
    }
}
