package com.myfitnessapp.trainingappointment.demos.web.controller;

import com.myfitnessapp.service.membership.dto.MembershipRegistrationDTO;
import com.myfitnessapp.service.membership.dto.MembershipResponseDTO;
import com.myfitnessapp.service.membership.dto.MembershipUpdateDTO;
import com.myfitnessapp.service.membership.service.MembershipService;
import com.myfitnessapp.service.user.domain.User;
import com.myfitnessapp.service.user.service.impl.CustomUserDetails;
import lombok.extern.slf4j.Slf4j;
import javax.servlet.http.HttpServletRequest;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;


@RestController
@RequestMapping("/api/memberships")
@Slf4j
public class MembershipController {
    private final MembershipService membershipService;

    public MembershipController(MembershipService membershipService) {
        this.membershipService = membershipService;
        System.out.println(">>> 注入的 MembershipService = " + membershipService.getClass());
    }

    /**
     * 只有已登录用户（session 里有 CustomUserDetails）才能注册会员
     */
    @PostMapping(value = "/register",
                 consumes = { MediaType.APPLICATION_FORM_URLENCODED_VALUE, MediaType.APPLICATION_JSON_VALUE })
    public ResponseEntity<MembershipResponseDTO> registerMembership(
            HttpServletRequest request,
            Authentication authentication) throws IOException {

        CustomUserDetails userDetails = null;
        if (authentication != null && authentication.getPrincipal() instanceof CustomUserDetails) {
            userDetails = (CustomUserDetails) authentication.getPrincipal();
        }
        if (userDetails == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        // 根据请求类型构造 DTO
        String contentType = request.getContentType();
        MembershipRegistrationDTO dto;
        if (contentType != null && contentType.contains(MediaType.APPLICATION_JSON_VALUE)) {
            dto = new ObjectMapper().readValue(request.getInputStream(), MembershipRegistrationDTO.class);
        } else {
            dto = new MembershipRegistrationDTO();
            dto.setPlanType(request.getParameter("planType"));
        }

        // 调业务
        MembershipResponseDTO result = membershipService.registerMembership(dto, userDetails.getUser());
        return ResponseEntity.ok(result);
    }

    @PostMapping(value = "/update",
                 consumes = { MediaType.APPLICATION_FORM_URLENCODED_VALUE, MediaType.APPLICATION_JSON_VALUE })
    public ResponseEntity<MembershipResponseDTO> updateMembership(
            HttpServletRequest request,
            Authentication authentication) throws IOException {

        CustomUserDetails userDetails = null;
        if (authentication != null && authentication.getPrincipal() instanceof CustomUserDetails) {
            userDetails = (CustomUserDetails) authentication.getPrincipal();
        }
        if (userDetails == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        // 根据请求类型构造 DTO
        String contentType = request.getContentType();
        MembershipUpdateDTO dto;
        if (contentType != null && contentType.contains(MediaType.APPLICATION_JSON_VALUE)) {
            dto = new ObjectMapper().readValue(request.getInputStream(), MembershipUpdateDTO.class);
        } else {
            dto = new MembershipUpdateDTO();
            dto.setPlanType(request.getParameter("planType"));
            // 如果 DTO 有其他字段，也在此通过 request.getParameter(...) 设置
        }

        MembershipResponseDTO result = membershipService.updateMembership(dto, userDetails.getUser());
        return ResponseEntity.ok(result);
    }

}
