package com.myfitnessapp.service.appointment.model;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@TableName("session_info")
public class SessionInfo {
    @TableId(value = "session_id", type = IdType.AUTO)
    private Integer sessionId;             // Session ID (primary key)

    private Integer memberId;              // Member ID (foreign key: t_user.user_id)
    private Integer trainerId;             // Trainer ID (foreign key: t_user.user_id, role=TRAINER)
    private Integer centerId;              // Fitness Center ID (foreign key: center.center_id)

    private LocalDateTime sessionDatetime; // Appointment/Training session time
    private String status;                 // Status:PENDING, APPROVED, REJECTED, CANCELED, COMPLETED
    private String goalDescription;        // Member's fitness goal or requirement
    private Integer duration;              // Training duration (minutes)
    private BigDecimal price;              // Training session price

    private LocalDateTime nextSessionDatetime; // Next appointment time

    private LocalDateTime createdAt;       // Creation timestamp
    private LocalDateTime updatedAt;       // Last update timestamp
}
