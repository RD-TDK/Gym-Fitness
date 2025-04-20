package com.myfitnessapp.service.trainer.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TrainerRegistrationDTO {
    private String specialty;
    private Integer experience;
    private String certification;

    /**
     *  personal profile
     */
    private String bio;
    private String photo;
}
