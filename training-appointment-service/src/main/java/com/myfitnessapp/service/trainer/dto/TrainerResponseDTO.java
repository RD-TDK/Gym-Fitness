package com.myfitnessapp.service.trainer.dto;

import com.myfitnessapp.service.trainer.domain.CertificationStatus;
import com.myfitnessapp.service.user.domain.Gender;
import lombok.*;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TrainerResponseDTO {
    private Integer trainerId;
    /**
     * 关联的用户 ID，用于获取姓名、邮箱、性别等用户信息
     */
    private Integer userId;
    private String name;
    private String email;
    private Gender gender;
    private String specialty;
    private Integer experience;
    private String certification;
    private String bio;
    private String photo;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private CertificationStatus isCertified;
}
