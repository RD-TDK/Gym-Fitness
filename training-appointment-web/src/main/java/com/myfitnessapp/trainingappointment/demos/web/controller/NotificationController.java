package com.myfitnessapp.trainingappointment.demos.web.controller;

import com.myfitnessapp.service.exception.ResourceNotFoundException;
import com.myfitnessapp.service.user.service.impl.CustomUserDetails;
import com.myfitnessapp.trainingappointment.demos.web.dto.NotificationDto;
import com.myfitnessapp.trainingappointment.demos.web.model.Notification;
import com.myfitnessapp.trainingappointment.demos.web.repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {
    @Autowired
    private NotificationRepository repository;

    @GetMapping("/unread")
    public ResponseEntity<List<NotificationDto>> getUnreadNotifications(Authentication auth) {
        Integer userId = ((CustomUserDetails) auth.getPrincipal()).getUserId();
        List<NotificationDto> dtos = repository
                .findByUserIdAndIsReadFalseOrderByCreatedAtDesc(userId)
                .stream()
                .map(NotificationDto::fromEntity)
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @PostMapping("/{id}/read")
    public ResponseEntity<NotificationDto> markAsRead(
            @PathVariable Integer id,
            Authentication auth) {
        Integer userId = ((CustomUserDetails) auth.getPrincipal()).getUserId();
        Notification notification = repository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Notification not found: " + id));
        // 确保只能标记属于自己的通知
        if (!notification.getUserId().equals(userId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Access denied");
        }
        notification.setIsRead(true);
        Notification updated = repository.save(notification);
        return ResponseEntity.ok(NotificationDto.fromEntity(updated));
    }

    @GetMapping
    public ResponseEntity<List<NotificationDto>> listNotifications(Authentication auth, @RequestParam(required = false) Boolean isRead) {
        Integer userId = ((CustomUserDetails) auth.getPrincipal()).getUserId();
        List<Notification> entities;
        if (isRead != null) {
            entities = isRead
                    ? repository.findByUserIdAndIsReadTrueOrderByCreatedAtDesc(userId)
                    : repository.findByUserIdAndIsReadFalseOrderByCreatedAtDesc(userId);
        } else {
            entities = repository.findByUserIdOrderByCreatedAtDesc(userId);
        }
        List<NotificationDto> dtos = entities
                .stream()
                .map(NotificationDto::fromEntity)
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }
}
