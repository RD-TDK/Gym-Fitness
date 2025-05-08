package com.myfitnessapp.service.trainer.dto;

import lombok.Getter;
import lombok.Setter;
import org.springframework.web.multipart.MultipartFile;

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
    private MultipartFile photo;
}
