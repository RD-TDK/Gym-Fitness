package com.myfitnessapp.service.user.domain;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@TableName("t_user")
public class User {

    @TableId(type = IdType.AUTO)
    private Integer userId;
    private String name;
    private String email;
    private String password;
    private Gender gender;
    private Role role;

    @TableField("status")
    private UserStatus userStatus;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;






}
