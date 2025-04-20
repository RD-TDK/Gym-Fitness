package com.myfitnessapp.service.membership.domain;

import com.baomidou.mybatisplus.annotation.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@TableName("membership")
public class Membership {

    @TableId(value = "membership_id", type = IdType.AUTO)
    private Integer memberId;

    private Integer userId;
    private String planType;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    @TableField(fill = FieldFill.INSERT_UPDATE)
    private Boolean isActive;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
