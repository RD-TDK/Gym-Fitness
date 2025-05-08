package com.myfitnessapp.service.trainer.mapstruct;

import com.myfitnessapp.service.trainer.domain.Trainer;
import com.myfitnessapp.service.trainer.dto.TrainerRegistrationDTO;
import com.myfitnessapp.service.trainer.dto.TrainerResponseDTO;
import com.myfitnessapp.service.trainer.dto.TrainerUpdateDTO;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface TrainerDtoMapper {

    //DTO -> Entity
    @Mapping(target="trainerId", ignore=true)
    @Mapping(target="userId", ignore=true)            // Service 层填充
    @Mapping(target="photo", ignore=true)             // handle file upload separately
    Trainer toEntity(TrainerRegistrationDTO dto);

    @Mapping(target = "photo", ignore = true)  // handle MultipartFile -> String manually
    void updatetoEntity(TrainerUpdateDTO dto, @MappingTarget Trainer trainer);

    //Entity -> DTO
    TrainerResponseDTO toDto(Trainer trainer);
}
