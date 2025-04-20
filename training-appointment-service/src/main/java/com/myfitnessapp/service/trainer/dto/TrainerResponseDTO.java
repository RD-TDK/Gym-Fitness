package com.myfitnessapp.service.trainer.dto;

import lombok.*;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TrainerResponseDTO {
    private Integer trainerId;
    private String name;
    private String email;
    private String specialty;
    private Integer experience;
    private String certification;
    private String bio;
    private String photo;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
