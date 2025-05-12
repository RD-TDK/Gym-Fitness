package com.myfitnessapp.trainingappointment.demos.web.controller;
import javax.servlet.http.HttpServletRequest;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.myfitnessapp.service.user.domain.Role;
import com.myfitnessapp.service.user.domain.User;
import com.myfitnessapp.service.user.domain.UserStatus;
import com.myfitnessapp.service.user.dto.*;
import com.myfitnessapp.service.user.security.JwtUtil;
import com.myfitnessapp.service.user.service.UserService;
import com.myfitnessapp.service.user.service.VerificationCodeService;
import com.myfitnessapp.service.user.service.impl.CustomUserDetails;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;

@RestController
@RequestMapping("/api/users")
@Slf4j
public class UserController {
    private final UserService userService;
    private final VerificationCodeService verificationCodeService;
    private final JwtUtil jwtUtil;


    @Autowired
    public UserController(UserService userService, VerificationCodeService verificationCodeService, JwtUtil jwtUtil) {
        this.userService = userService;
        this.verificationCodeService = verificationCodeService;
        this.jwtUtil = jwtUtil;
    }


    /**
     * 发送验证码接口
     * 用户点击“获取验证码”时，通过此接口生成验证码、存入 Redis，并调用邮件服务发送验证码到用户邮箱。
     *
     * @param email 用户邮箱，通过请求参数传入
     * @return 返回一个提示信息，告诉用户验证码已发送
     */
    @PostMapping("/sendVerificationCode")
    public ResponseEntity<String> sendVerificationCode(@RequestParam("email") String email) {
        // 调用验证码服务生成并发送验证码
        verificationCodeService.generateAndSend(email);
        // 为安全考虑，实际生产环境下不返回验证码
        return ResponseEntity.ok("Verification Code sent" + email);
    }

    /**
     * 用户注册接口
     * 前端需要提交包含邮箱、密码、确认密码、验证码等信息的注册数据。
     * 在注册过程中，先会校验密码是否一致、验证码是否正确，
     * 然后再进行邮箱重复检查以及后续的用户数据保存。
     *
     * @param registrationDTO 前端提交的注册信息封装对象
     * @return 注册成功后返回经过转换后的用户响应 DTO
     */
    @PostMapping("/register")
    public ResponseEntity<UserResponseDTO> registerUser(@RequestBody UserRegistrationDTO registrationDTO) {
        UserResponseDTO response = userService.registerUser(registrationDTO);
        return ResponseEntity.ok(response);
    }

    /**
     * 统一登录接口，既接收 application/json，也接收 application/x-www-form-urlencoded
     */
    @PostMapping(value = "/login",
            consumes = { MediaType.APPLICATION_JSON_VALUE,
                    MediaType.APPLICATION_FORM_URLENCODED_VALUE })
    public ResponseEntity<LoginResponseDTO> loginUser(HttpServletRequest request) {
        UserLoginDTO loginDTO;
        String contentType = request.getContentType();

        try {
            if (contentType != null && contentType.contains(MediaType.APPLICATION_JSON_VALUE)) {
                // JSON 登录：从请求流反序列化
                loginDTO = new ObjectMapper()
                        .readValue(request.getInputStream(), UserLoginDTO.class);
            } else {
                // 表单登录：从请求参数读取
                loginDTO = new UserLoginDTO();
                loginDTO.setEmail(request.getParameter("email"));
                loginDTO.setPassword(request.getParameter("password"));
            }
        } catch (IOException e) {
            return ResponseEntity.badRequest().build();
        }

        if (loginDTO.getEmail() == null || loginDTO.getPassword() == null) {
            return ResponseEntity.badRequest().build();
        }

        // 业务校验：邮箱/密码/状 态
        UserResponseDTO userResponse = userService.loginUser(loginDTO);

        // 手动构建 Spring Security Authentication
        User domainUser = userService.loadDomainUserByEmail(loginDTO.getEmail());
        CustomUserDetails userDetails = new CustomUserDetails(domainUser);
        UsernamePasswordAuthenticationToken authToken =
                new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
        authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
        SecurityContextHolder.getContext().setAuthentication(authToken);
        request.getSession(true);  // 确保下发 JSESSIONID

        // 生成 JWT
        String jwt = jwtUtil.generateToken(userDetails.getUsername());

        // 根据角色决定前端跳转页面
        String targetPage;
        switch (userResponse.getRole()) {
            case VISITOR: targetPage = "/visitor/choice";   break;
            case MEMBER:  targetPage = "/overviews"; break;
            case TRAINER: targetPage = "/overviews1";break;
            case ADMIN: targetPage = "/overview"; break;
            default:      targetPage = "/signin";             break;
        }

        // 返回 token + user + targetPage
        return ResponseEntity.ok(
                new LoginResponseDTO(userResponse, targetPage, jwt)
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserResponseDTO> getUserById(@PathVariable Integer id) {
        UserResponseDTO dto = userService.getUserById(id);
        return ResponseEntity.ok(dto);
    }

    /**
     * 更新用户基本信息接口
     *
     * @param id        用户 id，通过 URL 路径传入
     * @param updateDTO 前端提交的更新基本信息数据
     * @return 更新成功后返回新的用户响应 DTO
     */
    @PutMapping("/{id}")
    public ResponseEntity<UserResponseDTO> updateUser(@PathVariable("id") Integer id,
                                                      @RequestBody UserUpdateDTO updateDTO) {
        log.info(">>> updateUser got DTO: {}", updateDTO);
        UserResponseDTO response = userService.updateUser(id, updateDTO);
        return ResponseEntity.ok(response);
    }


    /**
     * 更新用户密码接口
     *
     * @param id                 用户 id，通过 URL 路径传入
     * @param passwordUpdateDTO 包含旧密码、新密码、确认密码以及验证码的更新数据
     * @return 更新成功后返回新的用户响应 DTO
     */
    @PutMapping("/{id}/password")
    public ResponseEntity<UserResponseDTO> updateUserPassword(@PathVariable("id") Integer id,
                                                              @RequestBody UserPasswordUpdateDTO passwordUpdateDTO) {
        UserResponseDTO response = userService.updateUserPassword(id, passwordUpdateDTO);
        return ResponseEntity.ok(response);
    }

    /**
     * 更新用户邮箱接口
     *
     * @param id             用户 id，通过 URL 路径传入
     * @param emailUpdateDTO 包含旧邮箱、密码、新邮箱及验证码的更新数据
     * @return 更新成功后返回新的用户响应 DTO
     */
//    @PutMapping("/{id}/email")
//    public ResponseEntity<UserResponseDTO> updateUserEmail(@PathVariable("id") Integer id,
//                                                           @RequestBody UserEmailUpdateDTO emailUpdateDTO) {
//        log.info("Received request to update email for user id: {} with payload: {}", id, emailUpdateDTO);
//
//        UserResponseDTO response = userService.updateUserEmail(id, emailUpdateDTO);
//
//        log.info("Email update successful for user id: {}. Updated response: {}", id, response);
//        return ResponseEntity.ok(response);
//    }

    /**
     * 注销账号接口
     *
     * @param id 用户 id，通过 URL 路径传入
     * @return 注销成功后返回操作提示信息
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<String> cancelAccount(@PathVariable("id") Integer id) {
        userService.cancelAccount(id);
        return ResponseEntity.ok("Account cancelled successfully.");
    }


}
