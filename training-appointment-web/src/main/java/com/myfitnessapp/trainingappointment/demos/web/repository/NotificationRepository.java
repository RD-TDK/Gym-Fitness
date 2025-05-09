package com.myfitnessapp.trainingappointment.demos.web.repository;

import com.myfitnessapp.trainingappointment.demos.web.model.Notification;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Integer> {
    List<Notification> findByUserIdAndIsReadFalse(Integer userId);
    List<Notification> findByUserId(Integer userId);
    List<Notification> findByUserIdAndIsReadFalseOrderByCreatedAtDesc(Integer userId);
    List<Notification> findByUserIdAndIsReadTrueOrderByCreatedAtDesc(Integer userId);
    List<Notification> findByUserIdOrderByCreatedAtDesc(Integer userId);
}
