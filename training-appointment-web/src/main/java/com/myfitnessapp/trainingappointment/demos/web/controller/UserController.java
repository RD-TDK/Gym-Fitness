package com.myfitnessapp.trainingappointment.demos.web.controller;

import com.myfitnessapp.service.user.dto.UserRegistrationDTO;
import com.myfitnessapp.service.user.dto.UserResponseDTO;
import com.myfitnessapp.service.user.service.UserService;
import com.myfitnessapp.service.user.service.VerificationCodeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class UserController {
    private final UserService userService;
    private final VerificationCodeService verificationCodeService;

    @Autowired
    public UserController(UserService userService, VerificationCodeService verificationCodeService) {
        this.userService = userService;
        this.verificationCodeService = verificationCodeService;
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
        return ResponseEntity.ok("验证码已发送至邮箱：" + email);
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
}
