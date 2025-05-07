package com.myfitnessapp.service.user.dto;

import lombok.Getter;
import lombok.Setter;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Pattern;

@Getter
@Setter
public class UserPasswordUpdateDTO {

    @NotBlank(message = "The password cannot be empty")
    private String oldPassword;

    @NotBlank(message = "The password cannot be empty")
    @Pattern(
            regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).{8,}$",
            message = "密码必须至少8个字符，包含至少一个大写字母、一个小写字母和一个数字"
    )
    private String newPassword;

    @NotBlank(message = "The confirmation password cannot be empty")
    private String confirmPassword;

    @NotBlank(message = "The verification code cannot be empty")
    private String verificationCode;
}
