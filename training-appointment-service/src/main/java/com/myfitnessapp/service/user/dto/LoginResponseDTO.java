package com.myfitnessapp.service.user.dto;

import lombok.*;
import org.springframework.beans.factory.annotation.Autowired;

@Data
@Getter
@Setter
public class LoginResponseDTO {
    private UserResponseDTO user;
    private String targetPage;
    // 新增 getter/setter
    private String token;             // 新增

    // 新增含 token 的构造
    public LoginResponseDTO(UserResponseDTO user, String targetPage, String token) {
        this.user = user;
        this.targetPage = targetPage;
        this.token = token;
    }
    // 保留老构造
    public LoginResponseDTO(UserResponseDTO user, String targetPage) {
        this(user, targetPage, null);
    }

}
