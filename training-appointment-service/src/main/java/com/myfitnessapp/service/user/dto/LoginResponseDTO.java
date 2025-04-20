package com.myfitnessapp.service.user.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class LoginResponseDTO {
    /**
     * 用户基本信息
     */
    private UserResponseDTO user;

    /**
     * 根据用户角色决定的目标页面路径
     */
    private String targetPage;

}
