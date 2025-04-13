package com.myfitnessapp.trainingappointment.demos.web.controller;

import com.myfitnessapp.service.user.dto.*;
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
     * 用户登录接口
     *
     * @param loginDTO 前端提交的登录信息，包含邮箱和密码
     * @return 登录成功后返回用户响应 DTO
     */
    @PostMapping("/login")
    public ResponseEntity<UserResponseDTO> loginUser(@RequestBody UserLoginDTO loginDTO) {
        UserResponseDTO response = userService.loginUser(loginDTO);
        return ResponseEntity.ok(response);
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
    @PutMapping("/{id}/email")
    public ResponseEntity<UserResponseDTO> updateUserEmail(@PathVariable("id") Integer id,
                                                           @RequestBody UserEmailUpdateDTO emailUpdateDTO) {
        UserResponseDTO response = userService.updateUserEmail(id, emailUpdateDTO);
        return ResponseEntity.ok(response);
    }

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
