package com.myfitnessapp.trainingappointment.demos.web.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;
import com.myfitnessapp.service.admin.service.AdminService;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import com.myfitnessapp.service.membership.service.MembershipService;
import com.myfitnessapp.service.membership.domain.Membership;
import com.myfitnessapp.service.user.service.UserService;
import com.myfitnessapp.service.user.dto.UserResponseDTO;
import java.util.HashMap;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final AdminService adminService;

    @Autowired
    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @Autowired
    private MembershipService membershipService;

    @Autowired
    private UserService userService;

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

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/member/{memberId}/activate")
    public ResponseEntity<Void> activateMember(@PathVariable int memberId) {
        adminService.activeMember(memberId);
        return ResponseEntity.noContent().build();
    }

    /**
     * List all pending (inactive) memberships.
     * Only ADMIN role may perform this.
     */
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/memberships/pending")
    public ResponseEntity<List<Map<String, Object>>> getPendingMemberships() {
        List<Membership> pending = membershipService.getPendingMemberships();
        List<Map<String, Object>> result = pending.stream().map(m -> {
          UserResponseDTO u = userService.getUserById(m.getUserId());
          Map<String, Object> map = new HashMap<>();
          map.put("membershipId", m.getMemberId());
          map.put("name", u.getName());
          map.put("email", u.getEmail());
          map.put("phone", u.getPhoneNumber());
          map.put("gender", u.getGender());
          return map;
        }).collect(Collectors.toList());
        return ResponseEntity.ok(result);
    }
}
