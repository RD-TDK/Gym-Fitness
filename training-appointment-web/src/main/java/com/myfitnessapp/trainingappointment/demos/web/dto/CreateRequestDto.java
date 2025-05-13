package com.myfitnessapp.trainingappointment.demos.web.dto;

import lombok.Data;

import javax.validation.constraints.NotNull;

@Data
public class CreateRequestDto {
    @NotNull
    private Integer memberId;

    private String reason;
}
