package com.myfitnessapp.service.trainer.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

import javax.validation.constraints.NotBlank;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TrainerUpdateDTO {

    @NotBlank
    private String specialty;

    @NotBlank
    private Integer experience;

    @NotBlank
    private String certification;

    @NotBlank
    private String bio;

    @NotBlank
    private MultipartFile photo;
}
