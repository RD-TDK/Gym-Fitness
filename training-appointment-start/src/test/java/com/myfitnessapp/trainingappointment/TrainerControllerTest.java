package com.myfitnessapp.trainingappointment;

import com.myfitnessapp.service.trainer.dto.TrainerRegistrationDTO;
import com.myfitnessapp.service.trainer.dto.TrainerResponseDTO;
import com.myfitnessapp.service.trainer.dto.TrainerUpdateDTO;
import com.myfitnessapp.service.user.domain.Gender;
import com.myfitnessapp.service.user.dto.UserRegistrationDTO;
import com.myfitnessapp.service.user.dto.UserResponseDTO;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.http.*;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;

import java.time.LocalDate;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
public class TrainerControllerTest {

    @Autowired
    private TestRestTemplate restTemplate;

    @Autowired
    private StringRedisTemplate stringRedisTemplate;

    @Test
    public void testRegisterTrainerFlow() throws InterruptedException {
        // 1. 发送验证码
        String email = "testTRN" + System.currentTimeMillis() + "@test.com";
        ResponseEntity<String> sendResp = restTemplate
                .postForEntity("/api/users/sendVerificationCode?email=" + email, null, String.class);
        assertEquals(HttpStatus.OK, sendResp.getStatusCode());

        // 等待验证码写入 Redis
        Thread.sleep(500);
        String code = stringRedisTemplate.opsForValue().get("verification_code:" + email);
        assertNotNull(code, "Redis 中的验证码不应为 null");

        // 2. 注册普通用户
        UserRegistrationDTO regDto = new UserRegistrationDTO();
        regDto.setName("TrainerUser");
        regDto.setEmail(email);
        regDto.setPassword("Password123");
        regDto.setConfirmPassword("Password123");
        regDto.setVerificationCode(code);
        regDto.setGender(Gender.MALE);
        regDto.setPhoneNumber("13700000000");
        regDto.setAddress("Trainer Address");
        regDto.setBirthday(LocalDate.of(1985, 1, 1));
        HttpHeaders jsonHeaders = new HttpHeaders();
        jsonHeaders.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<UserRegistrationDTO> regReq = new HttpEntity<>(regDto, jsonHeaders);
        ResponseEntity<UserResponseDTO> regResp = restTemplate
                .postForEntity("/api/users/register", regReq, UserResponseDTO.class);
        assertEquals(HttpStatus.OK, regResp.getStatusCode());
        assertNotNull(regResp.getBody(), "注册用户响应体不应为 null");

        // 3. 登录获取 session
        HttpHeaders loginHeaders = new HttpHeaders();
        loginHeaders.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
        MultiValueMap<String, String> loginParams = new LinkedMultiValueMap<>();
        loginParams.add("email", email);
        loginParams.add("password", "Password123");
        HttpEntity<MultiValueMap<String, String>> loginReq = new HttpEntity<>(loginParams, loginHeaders);
        ResponseEntity<String> loginResp = restTemplate
                .postForEntity("/api/users/login", loginReq, String.class);
        assertEquals(HttpStatus.OK, loginResp.getStatusCode());
        List<String> cookies = loginResp.getHeaders().get(HttpHeaders.SET_COOKIE);
        String sessionCookie = cookies.stream()
            .filter(c -> c.startsWith("JSESSIONID"))
            .findFirst()
            .orElseThrow(() -> new IllegalStateException("未收到 JSESSIONID Cookie"));

        // 4. 在已登录 session 下，注册教练
        MultiValueMap<String, String> trnParams = new LinkedMultiValueMap<>();
        trnParams.add("specialty", "Yoga");
        trnParams.add("experience", "5");
        trnParams.add("certification", "Certified Master");
        trnParams.add("bio", "Experienced yoga instructor");
        trnParams.add("photo", "http://example.com/photo.jpg");

        HttpHeaders trnHeaders = new HttpHeaders();
        trnHeaders.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
        trnHeaders.add(HttpHeaders.COOKIE, sessionCookie);
        HttpEntity<MultiValueMap<String, String>> trnReq = new HttpEntity<>(trnParams, trnHeaders);

        ResponseEntity<TrainerResponseDTO> trnResp = restTemplate.postForEntity(
                "/api/trainers/register", trnReq, TrainerResponseDTO.class);

        // 5. 断言注册教练成功
        assertEquals(HttpStatus.OK, trnResp.getStatusCode());
        TrainerResponseDTO body = trnResp.getBody();
        assertNotNull(body, "教练注册响应体不应为 null");
        assertNotNull(body.getTrainerId(), "生成的 trainerId 不应为 null");
        assertEquals("Yoga", body.getSpecialty());
        assertEquals(5, body.getExperience());
        assertEquals("Certified Master", body.getCertification());
        assertEquals("Experienced yoga instructor", body.getBio());
        assertEquals("http://example.com/photo.jpg", body.getPhoto());
    }

    @Test
    public void testFullRegisterLoginRegisterAndUpdateTrainerFlow() throws InterruptedException {
        // 0. 随机邮箱
        String email = "updateTRN" + System.currentTimeMillis() + "@test.com";

        // 1. 请求并校验验证码写入 Redis
        ResponseEntity<String> sendResp = restTemplate
                .postForEntity("/api/users/sendVerificationCode?email=" + email, null, String.class);
        assertEquals(HttpStatus.OK, sendResp.getStatusCode());

        Thread.sleep(500);
        String code = stringRedisTemplate.opsForValue().get("verification_code:" + email);
        assertNotNull(code, "验证码应已写入 Redis");

        // 2. 注册用户
        UserRegistrationDTO userDto = new UserRegistrationDTO();
        userDto.setName("TrainerUser");
        userDto.setEmail(email);
        userDto.setPassword("Password123");
        userDto.setConfirmPassword("Password123");
        userDto.setVerificationCode(code);
        userDto.setGender(Gender.MALE);
        userDto.setPhoneNumber("13700000000");
        userDto.setAddress("Some Address");
        userDto.setBirthday(LocalDate.of(1985, 1, 1));

        HttpHeaders jsonHeaders = new HttpHeaders();
        jsonHeaders.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<UserRegistrationDTO> regReq = new HttpEntity<>(userDto, jsonHeaders);

        ResponseEntity<UserResponseDTO> regResp =
                restTemplate.postForEntity("/api/users/register", regReq, UserResponseDTO.class);
        assertEquals(HttpStatus.OK, regResp.getStatusCode());
        assertNotNull(regResp.getBody(), "注册响应体不应为 null");

        // 3. 登录并抓取 JSESSIONID
        HttpHeaders loginHeaders = new HttpHeaders();
        loginHeaders.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
        MultiValueMap<String, String> loginParams = new LinkedMultiValueMap<>();
        loginParams.add("email", email);
        loginParams.add("password", "Password123");

        HttpEntity<MultiValueMap<String, String>> loginReq =
                new HttpEntity<>(loginParams, loginHeaders);
        ResponseEntity<String> loginResp =
                restTemplate.postForEntity("/api/users/login", loginReq, String.class);
        assertEquals(HttpStatus.OK, loginResp.getStatusCode());

        String sessionCookie = loginResp.getHeaders()
                .get(HttpHeaders.SET_COOKIE)
                .stream()
                .filter(c -> c.startsWith("JSESSIONID"))
                .findFirst()
                .orElseThrow(() -> new IllegalStateException("未收到 JSESSIONID Cookie"));

        // 4. 注册教练（FORM 表单方式）
        MultiValueMap<String, String> trnParams = new LinkedMultiValueMap<>();
        trnParams.add("specialty", "Yoga");
        trnParams.add("experience", "5");
        trnParams.add("certification", "Certified Master");
        trnParams.add("bio", "Experienced yoga instructor");
        trnParams.add("photo", "http://example.com/photo.jpg");

        HttpHeaders trnFormHeaders = new HttpHeaders();
        trnFormHeaders.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
        trnFormHeaders.add(HttpHeaders.COOKIE, sessionCookie);

        HttpEntity<MultiValueMap<String, String>> trnReq =
                new HttpEntity<>(trnParams, trnFormHeaders);
        ResponseEntity<TrainerResponseDTO> trnResp =
                restTemplate.postForEntity("/api/trainers/register", trnReq, TrainerResponseDTO.class);

        assertEquals(HttpStatus.OK, trnResp.getStatusCode());
        TrainerResponseDTO registered = trnResp.getBody();
        assertNotNull(registered, "教练注册响应体不应为 null");
        assertEquals("Yoga", registered.getSpecialty());
        assertEquals(5, registered.getExperience());
        assertEquals("Certified Master", registered.getCertification());
        assertEquals("Experienced yoga instructor", registered.getBio());
        assertEquals("http://example.com/photo.jpg", registered.getPhoto());

        // 5. 更新教练信息（JSON 方式）
        TrainerUpdateDTO updateDto = new TrainerUpdateDTO();
        updateDto.setSpecialty("Pilates");
        updateDto.setExperience(10);
        updateDto.setCertification("Advanced Cert");
        updateDto.setBio("Master Pilates instructor");
        updateDto.setPhoto("http://example.com/pilates.jpg");

        HttpHeaders updJsonHeaders = new HttpHeaders();
        updJsonHeaders.setContentType(MediaType.APPLICATION_JSON);
        updJsonHeaders.add(HttpHeaders.COOKIE, sessionCookie);

        HttpEntity<TrainerUpdateDTO> updReq =
                new HttpEntity<>(updateDto, updJsonHeaders);
        ResponseEntity<TrainerResponseDTO> updResp =
                restTemplate.postForEntity("/api/trainers/update", updReq, TrainerResponseDTO.class);

        assertEquals(HttpStatus.OK, updResp.getStatusCode());
        TrainerResponseDTO updated = updResp.getBody();
        assertNotNull(updated, "更新响应体不应为 null");
        assertEquals("Pilates", updated.getSpecialty());
        assertEquals(10, updated.getExperience());
        assertEquals("Advanced Cert", updated.getCertification());
        assertEquals("Master Pilates instructor", updated.getBio());
        assertEquals("http://example.com/pilates.jpg", updated.getPhoto());
    }
}
