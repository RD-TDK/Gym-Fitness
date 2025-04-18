package com.myfitnessapp.service.request.model;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@TableName("training_request")
public class TrainingRequest {
    @TableId(value = "request_id", type = IdType.AUTO)
    private Integer requestId;

    private Integer sessionId;
    private Integer memberId;
    private String status;       // PENDING, APPROVED, REJECTED
    private String reason;       // 拒绝原因
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
