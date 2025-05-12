package com.myfitnessapp.trainingappointment.demos.web.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.security.access.prepost.PreAuthorize;
import com.myfitnessapp.service.admin.service.AdminService;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final AdminService adminService;

    @Autowired
    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    /**
     * Ban a member by userId.
     * Only ADMIN role may perform this.
     */
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/users/{userId}/ban")
    public ResponseEntity<Void> banUser(@PathVariable int userId) {
        adminService.banUser(userId);
        return ResponseEntity.noContent().build();
    }

    /**
     * Verify a trainer by trainerId.
     * Only ADMIN role may perform this.
     */
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/trainers/{trainerId}/verify")
    public ResponseEntity<Void> verifyTrainer(@PathVariable int trainerId) {
        adminService.verifyTrainer(trainerId);
        return ResponseEntity.noContent().build();
    }
}
