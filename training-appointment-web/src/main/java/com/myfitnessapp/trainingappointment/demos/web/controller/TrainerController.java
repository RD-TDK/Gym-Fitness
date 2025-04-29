package com.myfitnessapp.trainingappointment.demos.web.controller;

import com.myfitnessapp.service.user.domain.Gender;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.myfitnessapp.service.trainer.domain.CertificationStatus;
import com.myfitnessapp.service.trainer.domain.Status;
import com.myfitnessapp.service.trainer.domain.Trainer;
import com.myfitnessapp.service.trainer.dto.TrainerRegistrationDTO;
import com.myfitnessapp.service.trainer.dto.TrainerResponseDTO;
import com.myfitnessapp.service.trainer.dto.TrainerSearchDTO;
import com.myfitnessapp.service.trainer.dto.TrainerUpdateDTO;
import com.myfitnessapp.service.trainer.service.TrainerService;
import com.myfitnessapp.service.user.domain.User;
import com.myfitnessapp.service.user.service.impl.CustomUserDetails;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.util.List;

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

    @GetMapping(value = "/search", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Page<TrainerResponseDTO>> searchTrainers(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) List<Integer> experienceRange,
            @RequestParam(required = false) CertificationStatus certificationStatus,
            @RequestParam(required = false) Gender gender,
            @RequestParam(required = false) Status status,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String sortBy,
            @RequestParam(required = false) String sortOrder,
            Authentication authentication) {

        // 1. 校验登录
        if (!(authentication != null && authentication.getPrincipal() instanceof CustomUserDetails)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        User currentUser = ((CustomUserDetails) authentication.getPrincipal()).getUser();

        // 2. 构造 DTO
        TrainerSearchDTO dto = new TrainerSearchDTO();
        dto.setKeyword(keyword);
        dto.setExperienceRange(experienceRange);
        dto.setCertificationStatus(certificationStatus);
        dto.setGender(gender);
        dto.setStatus(status);
        dto.setSortBy(sortBy);
        dto.setSortOrder(sortOrder);

        // 3. 分页参数（注意泛型是实体类型）
        Page<Trainer> pageReq =
                new Page<>(page, size);

        // 4. 调用 Service，返回 IPage<TrainerResponseDTO>，转换为 Page<TrainerResponseDTO>
        Page<TrainerResponseDTO> pageResult =
                (Page<TrainerResponseDTO>) trainerService.searchTrainers(pageReq, dto, currentUser);

        return ResponseEntity.ok(pageResult);
    }
}
