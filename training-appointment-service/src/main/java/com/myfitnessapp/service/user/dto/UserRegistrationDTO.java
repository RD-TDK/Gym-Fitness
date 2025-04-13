package com.myfitnessapp.service.user.dto;

import com.myfitnessapp.service.user.domain.Gender;
import lombok.Getter;
import lombok.Setter;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;

@Getter
@Setter
public class UserRegistrationDTO {
    @NotBlank(message = "The name cannot be empty")
    private String name;

    @NotNull(message = "The gender cannot be empty")
    private Gender gender;

    @NotBlank(message = "The email cannot be empty")
    @Email(message = "The email format is incorrect")
    private String email;

    @NotBlank(message = "The password cannot be empty")
    @Pattern(
            regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).{8,}$",
            message = "密码必须至少8个字符，包含至少一个大写字母、一个小写字母和一个数字"
    )
    private String password;

    @NotBlank(message = "The confirmation password cannot be empty")
    private String confirmPassword;

    @NotBlank(message = "The verification code cannot be empty")
    private String verifiticationCode;

}
