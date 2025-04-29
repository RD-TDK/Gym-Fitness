package com.myfitnessapp.service.trainer.dto;

import com.myfitnessapp.service.trainer.domain.CertificationStatus;
import com.myfitnessapp.service.trainer.domain.Status;
import com.myfitnessapp.service.user.domain.Gender;
import lombok.Data;

import java.util.List;

@Data
public class TrainerSearchDTO {

    private Integer trainerId;

    /**
     * 用于模糊搜索教练简介（bio）中的关键词
     */
    private String keyword;

    private Integer page = 1;
    private Integer size = 10;

    /**
     * 经验范围过滤 [最小经验年数, 最大经验年数]
     */
    private List<Integer> experienceRange;
    private CertificationStatus certificationStatus;
    private Status status;
    private Gender gender;

    private String sortBy;    // 要排序的列名
    private String sortOrder; // "asc" 或 "desc"

}
