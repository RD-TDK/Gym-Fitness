package com.myfitnessapp.service.user.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.myfitnessapp.service.user.domain.Gender;
import lombok.Getter;
import lombok.Setter;
import org.springframework.format.annotation.DateTimeFormat;

import javax.validation.constraints.*;
import java.time.LocalDate;

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

    @NotBlank(message = "The phoneNumber cannot be empty")
    private String phoneNumber;

    @NotBlank(message = "The address cannot be empty")
    private String address;


    @NotNull(message = "The birthday cannot be empty")
    @DateTimeFormat(pattern = "yyyy-MM-dd")
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate birthday;

    @NotBlank(message = "The password cannot be empty")
    @Pattern(
            regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).{8,}$",
            message = "密码必须至少8个字符，包含至少一个大写字母、一个小写字母和一个数字"
    )
    private String password;

    @NotBlank(message = "The confirmation password cannot be empty")
    private String confirmPassword;

    @NotBlank(message = "The verification code cannot be empty")
    private String verificationCode;

}
