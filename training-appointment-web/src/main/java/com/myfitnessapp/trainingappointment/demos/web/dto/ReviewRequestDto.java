package com.myfitnessapp.trainingappointment.demos.web.dto;

import lombok.Data;

import javax.validation.constraints.NotBlank;

@Data
public class ReviewRequestDto {
    @NotBlank
    private String status;  // APPROVED 或 REJECTED

    private String reason;
}
