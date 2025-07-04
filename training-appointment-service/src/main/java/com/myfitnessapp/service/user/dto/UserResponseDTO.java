package com.myfitnessapp.service.user.dto;

import com.myfitnessapp.service.user.domain.Gender;
import com.myfitnessapp.service.user.domain.Role;
import com.myfitnessapp.service.user.domain.UserStatus;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class UserResponseDTO {
    private Integer userId;
    private String name;
    private String email;
    private Gender gender;
    private Role role;
    private String phoneNumber;
    private String address;
    private Integer age;
    private UserStatus userStatus;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

}
