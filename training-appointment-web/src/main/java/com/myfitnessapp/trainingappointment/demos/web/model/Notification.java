package com.myfitnessapp.trainingappointment.demos.web.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "notification")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Notification {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer notificationId;

    private Integer userId;
    private String message;
    private String type;
    private String link;
    private Boolean isRead = false;
    private LocalDateTime createdAt = LocalDateTime.now();
}
