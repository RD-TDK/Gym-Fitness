package com.myfitnessapp.service.user.dto;

import lombok.Getter;
import lombok.Setter;

import javax.validation.constraints.NotBlank;

@Getter
@Setter
public class UserUpdateDTO {
    @NotBlank(message = "The new name cannot be empty")
    private String newName;
    @NotBlank(message = "The new gender cannot be empty")
    private String newGender;
}
