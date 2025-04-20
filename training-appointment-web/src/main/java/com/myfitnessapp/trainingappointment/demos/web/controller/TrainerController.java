package com.myfitnessapp.trainingappointment.demos.web.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.myfitnessapp.service.trainer.dto.TrainerRegistrationDTO;
import com.myfitnessapp.service.trainer.dto.TrainerResponseDTO;
import com.myfitnessapp.service.trainer.dto.TrainerUpdateDTO;
import com.myfitnessapp.service.trainer.service.TrainerService;
import com.myfitnessapp.service.user.service.impl.CustomUserDetails;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.io.IOException;

@RestController
@RequestMapping("/api/trainers")
@Slf4j
public class TrainerController {
    private final TrainerService trainerService;

    public TrainerController(TrainerService trainerService) {
        this.trainerService = trainerService;
        System.out.println(">>> 注入的 TrainerService = " + trainerService.getClass());
    }

    @PostMapping(value = "/register",
                 consumes = { MediaType.APPLICATION_FORM_URLENCODED_VALUE, MediaType.APPLICATION_JSON_VALUE })
    public ResponseEntity<TrainerResponseDTO> registerTrainer(
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
        TrainerRegistrationDTO dto;
        if (contentType != null && contentType.contains(MediaType.APPLICATION_JSON_VALUE)) {
            dto = new ObjectMapper().readValue(request.getInputStream(), TrainerRegistrationDTO.class);
        } else {
            dto = new TrainerRegistrationDTO();
            dto.setSpecialty(request.getParameter("specialty"));
            String exp = request.getParameter("experience");
            if (exp != null) {
                dto.setExperience(Integer.parseInt(exp));
            }
            dto.setCertification(request.getParameter("certification"));
            dto.setBio(request.getParameter("bio"));
            dto.setPhoto(request.getParameter("photo"));
        }

        // 调业务
        TrainerResponseDTO result = trainerService.registerTrainer(dto, userDetails.getUser());
        return ResponseEntity.ok(result);
    }

    /**
     * 更新教练信息
     */
    @PostMapping(value = "/update",
                 consumes = { MediaType.APPLICATION_FORM_URLENCODED_VALUE, MediaType.APPLICATION_JSON_VALUE },
                 produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<TrainerResponseDTO> updateTrainer(
            HttpServletRequest request,
            Authentication authentication) throws IOException {

        CustomUserDetails userDetails = null;
        if (authentication != null && authentication.getPrincipal() instanceof CustomUserDetails) {
            userDetails = (CustomUserDetails) authentication.getPrincipal();
        }
        if (userDetails == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        // 根据请求类型构造更新 DTO
        String contentType = request.getContentType();
        TrainerUpdateDTO dto;
        if (contentType != null && contentType.contains(MediaType.APPLICATION_JSON_VALUE)) {
            dto = new ObjectMapper().readValue(request.getInputStream(), TrainerUpdateDTO.class);
        } else {
            dto = new TrainerUpdateDTO();
            dto.setSpecialty(request.getParameter("specialty"));
            String exp = request.getParameter("experience");
            if (exp != null) {
                dto.setExperience(Integer.parseInt(exp));
            }
            dto.setCertification(request.getParameter("certification"));
            dto.setBio(request.getParameter("bio"));
            dto.setPhoto(request.getParameter("photo"));
        }

        TrainerResponseDTO result = trainerService.updateTrainer(dto, userDetails.getUser());
        return ResponseEntity.ok(result);
    }
}
