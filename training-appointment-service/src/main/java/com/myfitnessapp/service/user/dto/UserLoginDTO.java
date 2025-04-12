package com.myfitnessapp.service.user.dto;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;

public class UserLoginDTO {

    @NotBlank(message = "The email cannot be empty")
    @Email(message = "The email format is incorrect")
    private String email;

    @NotBlank(message = "The password cannot be empty")
    private String password;
}
