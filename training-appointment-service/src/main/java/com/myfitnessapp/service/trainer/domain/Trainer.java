package com.myfitnessapp.service.trainer.domain;

import com.baomidou.mybatisplus.annotation.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@TableName("trainer")
public class Trainer {
    @TableId(value = "trainer_id", type = IdType.AUTO)
    private Integer trainerId;

    /**
     * 对应 t_user 表中的用户 ID，用户角色应为 TRAINER
     */
    private Integer userId;

    /**
     * 私教专长，如减脂、增肌等，默认为 General
     */
    private String specialty;

    /**
     * 工作经验年限
     */
    private Integer experience;

    /**
     * 认证或资质信息
     */
    private String certification;

    /**
     * 个人简介
     */
    private String bio;

    /**
     * 教练照片的 URL 或文件路径
     */
    private String photo;

    /**
     * 教练状态，可能值包括 ACTIVE 或 INACTIVE
     */
    private Status status;

    /**
     * 记录创建时间
     */
    private LocalDateTime createdAt;

    /**
     * 记录更新时间
     */
    private LocalDateTime updatedAt;
}
