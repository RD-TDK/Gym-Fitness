//package com.myfitnessapp.trainingappointment;
//
//import com.fasterxml.jackson.core.JsonProcessingException;
//import com.myfitnessapp.service.membership.dto.MembershipRegistrationDTO;
//import com.myfitnessapp.service.membership.dto.MembershipResponseDTO;
//import com.myfitnessapp.service.user.domain.Gender;
//import org.junit.jupiter.api.BeforeEach;
//import org.junit.jupiter.api.Test;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.boot.test.context.SpringBootTest;
//import org.springframework.boot.test.web.client.TestRestTemplate;
//import org.springframework.boot.web.server.LocalServerPort;
//import org.springframework.http.*;
//import org.springframework.util.LinkedMultiValueMap;
//import org.springframework.util.MultiValueMap;
//import org.springframework.data.redis.core.StringRedisTemplate;
//import com.myfitnessapp.service.user.dto.UserRegistrationDTO;
//import com.myfitnessapp.service.user.dto.UserResponseDTO;
//
//import java.time.LocalDate;
//import java.time.LocalDateTime;
//import java.util.List;
//
//import static org.junit.jupiter.api.Assertions.*;
//
//@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
//public class MembershipControllerTest {
//
//    @Autowired
//    private TestRestTemplate restTemplate;  // 或者 new RestTemplate()
//
//    @Autowired
//    private StringRedisTemplate stringRedisTemplate;
//
//    /**
//     * 完整的“注册成为会员”集成测试流程
//     */
//    @Test
//    public void testRegisterMembershipFlow() throws InterruptedException, JsonProcessingException {
//        // 1. 发送验证码
//        String email = "testMBR" + System.currentTimeMillis() + "@test.com";
//        ResponseEntity<String> sendResp = restTemplate
//                .postForEntity("/api/users/sendVerificationCode?email=" + email, null, String.class);
//        assertEquals(HttpStatus.OK, sendResp.getStatusCode());
//
//        // 等待验证码写入 Redis
//        Thread.sleep(500);
//        String code = stringRedisTemplate.opsForValue().get("verification_code:" + email);
//        assertNotNull(code, "Redis 中的验证码不应为 null");
//
//        // 2. 注册为 visitor（即普通 User）
//        UserRegistrationDTO regDto = new UserRegistrationDTO();
//        regDto.setName("MemberUser");
//        regDto.setEmail(email);
//        regDto.setPassword("Password123");
//        regDto.setConfirmPassword("Password123");
//        regDto.setVerificationCode(code);
//        regDto.setGender(Gender.FEMALE);
//        regDto.setPhoneNumber("13800000000");
//        regDto.setAddress("Test Address");
//        regDto.setBirthday(LocalDate.of(1995, 5, 20));
//
//        HttpHeaders headers = new HttpHeaders();
//        headers.setContentType(MediaType.APPLICATION_JSON);
//        HttpEntity<UserRegistrationDTO> regReq = new HttpEntity<>(regDto, headers);
//
//        ResponseEntity<UserResponseDTO> regResp = restTemplate
//                .postForEntity("/api/users/register", regReq, UserResponseDTO.class);
//        assertEquals(HttpStatus.OK, regResp.getStatusCode());
//        UserResponseDTO userBody = regResp.getBody();
//        assertNotNull(userBody, "注册响应体不应为 null");
//        assertEquals("MemberUser", userBody.getName(), "用户名应为 MemberUser");
//        assertEquals(email, userBody.getEmail(), "注册邮箱应与请求一致");
//
//        // 3. 表单登录，获取 JSESSIONID Cookie
//        HttpHeaders loginHeaders = new HttpHeaders();
//        loginHeaders.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
//        MultiValueMap<String, String> loginParams = new LinkedMultiValueMap<>();
//        loginParams.add("email", email);
//        loginParams.add("password", "Password123");
//        HttpEntity<MultiValueMap<String, String>> loginReq = new HttpEntity<>(loginParams, loginHeaders);
//        ResponseEntity<String> loginResp = restTemplate.postForEntity("/api/users/login", loginReq, String.class);
//        assertEquals(HttpStatus.OK, loginResp.getStatusCode());
//        List<String> cookies = loginResp.getHeaders().get(HttpHeaders.SET_COOKIE);
//        String sessionCookie = cookies.stream()
//            .filter(c -> c.startsWith("JSESSIONID"))
//            .findFirst()
//            .orElseThrow(() -> new IllegalStateException("未收到 JSESSIONID Cookie"));
//
//        // 4. 在已登录 session 下，注册会员
//        MultiValueMap<String, String> mbrParams = new LinkedMultiValueMap<>();
//        mbrParams.add("planType", "PREMIUM");
//
//        HttpHeaders mbrHeaders = new HttpHeaders();
//        mbrHeaders.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
//        mbrHeaders.add(HttpHeaders.COOKIE, sessionCookie);
//
//        HttpEntity<MultiValueMap<String, String>> mbrReq = new HttpEntity<>(mbrParams, mbrHeaders);
//        ResponseEntity<MembershipResponseDTO> mbrResp = restTemplate.postForEntity(
//                "/api/memberships/register",
//                mbrReq,
//                MembershipResponseDTO.class
//        );
//
//        // 5. 断言注册会员成功
//        assertEquals(HttpStatus.OK, mbrResp.getStatusCode());
//        MembershipResponseDTO mbrBody = mbrResp.getBody();
//        assertNotNull(mbrBody, "会员注册响应体不应为 null");
//        assertNotNull(mbrBody.getMembershipId(), "生成的 membershipId 不应为 null");
//        assertEquals("PREMIUM", mbrBody.getPlanType());
//        assertTrue(mbrBody.getIsActive());
//        // startDate, endDate 等字段根据你的业务逻辑也可以额外断言
//    }
//
//    /**
//     * 完整的“注册、续费”集成测试流程
//     */
//    @Test
//    public void testRegisterAndRenewMembershipFlow() throws InterruptedException {
//        // 1. 发送验证码
//        String email = "RenewMBR" + System.currentTimeMillis() + "@test.com";
//        ResponseEntity<String> sendResp = restTemplate
//                .postForEntity("/api/users/sendVerificationCode?email=" + email, null, String.class);
//        assertEquals(HttpStatus.OK, sendResp.getStatusCode());
//
//        // 等待验证码写入 Redis
//        Thread.sleep(500);
//        String code = stringRedisTemplate.opsForValue().get("verification_code:" + email);
//        assertNotNull(code, "Redis 中的验证码不应为 null");
//
//        // 2. 注册为 visitor
//        UserRegistrationDTO regDto = new UserRegistrationDTO();
//        regDto.setName("FullFlowUser");
//        regDto.setEmail(email);
//        regDto.setPassword("Password123");
//        regDto.setConfirmPassword("Password123");
//        regDto.setVerificationCode(code);
//        regDto.setGender(Gender.MALE);
//        regDto.setPhoneNumber("13900000000");
//        regDto.setAddress("Full Flow Address");
//        regDto.setBirthday(LocalDate.of(1990, 1, 1));
//        HttpHeaders jsonHeaders = new HttpHeaders();
//        jsonHeaders.setContentType(MediaType.APPLICATION_JSON);
//        HttpEntity<UserRegistrationDTO> regReq = new HttpEntity<>(regDto, jsonHeaders);
//        ResponseEntity<UserResponseDTO> regResp = restTemplate
//                .postForEntity("/api/users/register", regReq, UserResponseDTO.class);
//        assertEquals(HttpStatus.OK, regResp.getStatusCode());
//        UserResponseDTO userBody = regResp.getBody();
//        assertNotNull(userBody);
//
//        // 3. 登录获取 session
//        HttpHeaders formHeaders = new HttpHeaders();
//        formHeaders.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
//        MultiValueMap<String, String> loginParams = new LinkedMultiValueMap<>();
//        loginParams.add("email", email);
//        loginParams.add("password", "Password123");
//        HttpEntity<MultiValueMap<String, String>> loginReq = new HttpEntity<>(loginParams, formHeaders);
//        ResponseEntity<String> loginResp = restTemplate.postForEntity("/api/users/login", loginReq, String.class);
//        assertEquals(HttpStatus.OK, loginResp.getStatusCode());
//        String sessionCookie = loginResp.getHeaders().getFirst(HttpHeaders.SET_COOKIE);
//        assertTrue(sessionCookie.startsWith("JSESSIONID"));
//
//        // 4. 注册会员 BASIC -> PREMIUM
//        MultiValueMap<String, String> mbrParams = new LinkedMultiValueMap<>();
//        mbrParams.add("planType", "BASIC");
//        HttpHeaders mbrHeaders = new HttpHeaders();
//        mbrHeaders.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
//        mbrHeaders.add(HttpHeaders.COOKIE, sessionCookie);
//        HttpEntity<MultiValueMap<String, String>> mbrReq = new HttpEntity<>(mbrParams, mbrHeaders);
//        ResponseEntity<MembershipResponseDTO> mbrResp = restTemplate.postForEntity(
//                "/api/memberships/register", mbrReq, MembershipResponseDTO.class);
//        assertEquals(HttpStatus.OK, mbrResp.getStatusCode());
//        MembershipResponseDTO first = mbrResp.getBody();
//        assertNotNull(first);
//        assertEquals("BASIC", first.getPlanType());
//        assertTrue(first.getIsActive());
//        LocalDateTime firstEnd = first.getEndDate();
//
//        // 5. 升级至 GOLD
//        MultiValueMap<String, String> upgradeParams = new LinkedMultiValueMap<>();
//        upgradeParams.add("planType", "GOLD");
//        HttpEntity<MultiValueMap<String, String>> upgradeReq = new HttpEntity<>(upgradeParams, mbrHeaders);
//        ResponseEntity<MembershipResponseDTO> upgradeResp = restTemplate.postForEntity(
//                "/api/memberships/update", upgradeReq, MembershipResponseDTO.class);
//        assertEquals(HttpStatus.OK, upgradeResp.getStatusCode());
//        MembershipResponseDTO upgraded = upgradeResp.getBody();
//        assertNotNull(upgraded);
//        assertEquals("GOLD", upgraded.getPlanType());
//        assertTrue(upgraded.getIsActive());
//        LocalDateTime upgradeEnd = upgraded.getEndDate();
//
//        // 6. 续费 GOLD
//        MultiValueMap<String, String> renewParams = new LinkedMultiValueMap<>();
//        renewParams.add("planType", "GOLD");
//        HttpEntity<MultiValueMap<String, String>> renewReq = new HttpEntity<>(renewParams, mbrHeaders);
//        ResponseEntity<MembershipResponseDTO> renewResp = restTemplate.postForEntity(
//                "/api/memberships/update", renewReq, MembershipResponseDTO.class);
//        assertEquals(HttpStatus.OK, renewResp.getStatusCode());
//        MembershipResponseDTO renewed = renewResp.getBody();
//        assertNotNull(renewed);
//        assertEquals("GOLD", renewed.getPlanType());
//        assertTrue(renewed.getEndDate().isAfter(upgradeEnd), "续费后的结束日期应在之前结束日期之后");
//    }
//}