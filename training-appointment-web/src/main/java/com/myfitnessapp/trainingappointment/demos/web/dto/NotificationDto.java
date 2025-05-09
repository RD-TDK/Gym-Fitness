package com.myfitnessapp.trainingappointment.demos.web.dto;

import com.myfitnessapp.trainingappointment.demos.web.model.Notification;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class NotificationDto {
    /** 通知主键 */
    private Integer notificationId;
    /** 接收通知的用户 ID */
    private Integer userId;
    /** 通知内容 */
    private String message;
    /** 通知类型，比如 "SESSION_UPDATED" */
    private String type;
    /** 前端可跳转的链接，比如 "/sessions/123" */
    private String link;
    /** 是否已读 */
    private Boolean isRead;
    /** 创建时间 */
    private LocalDateTime createdAt;

    /**
     * 将 Notification 实体转换为 DTO
     */
    public static NotificationDto fromEntity(Notification entity) {
        NotificationDto dto = new NotificationDto();
        dto.setNotificationId(entity.getNotificationId());
        dto.setUserId(entity.getUserId());
        dto.setMessage(entity.getMessage());
        dto.setType(entity.getType());
        dto.setLink(entity.getLink());
        dto.setIsRead(entity.getIsRead());
        dto.setCreatedAt(entity.getCreatedAt());
        return dto;
    }
}
