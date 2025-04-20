package com.myfitnessapp.service.user;

import com.myfitnessapp.service.membership.domain.Membership;
import com.myfitnessapp.service.trainer.domain.Trainer;
import com.myfitnessapp.service.trainer.dto.TrainerRegistrationDTO;
import com.myfitnessapp.service.trainer.dto.TrainerResponseDTO;
import com.myfitnessapp.service.trainer.dto.TrainerUpdateDTO;
import com.myfitnessapp.service.trainer.mapper.TrainerMapper;
import com.myfitnessapp.service.trainer.mapstruct.TrainerDtoMapper;
import com.myfitnessapp.service.trainer.service.impl.TrainerServiceImpl;
import com.myfitnessapp.service.user.domain.User;
import com.myfitnessapp.service.user.mapper.UserMapper;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class TrainerServiceImplTest {
    @Mock
    private TrainerMapper trainerMapper;

    @Mock
    private UserMapper userMapper;

    @Mock
    private TrainerDtoMapper trainerDtoMapper;

    @InjectMocks
    private TrainerServiceImpl trainerService;

    @Test
    void testRegisterTrainer(){
        TrainerRegistrationDTO dto = new TrainerRegistrationDTO();
        User user = new User();
        user.setUserId(1);

        TrainerResponseDTO responseDTO = new TrainerResponseDTO();
        responseDTO.setTrainerId(1);
        responseDTO.setSpecialty("General");
        responseDTO.setCertification("test certificate");
        responseDTO.setBio("test bio");
        responseDTO.setExperience(5);
        responseDTO.setPhoto("test photo");

        when(trainerDtoMapper.toEntity(any())).thenReturn(new Trainer());
        when(trainerDtoMapper.toDto(any())).thenReturn(responseDTO);

        TrainerResponseDTO result = trainerService.registerTrainer(dto, user);

        assertNotNull(result);
        assertEquals("test certificate", result.getCertification());
        assertEquals("test bio", result.getBio());
        assertEquals(5, result.getExperience());
        assertEquals("General", result.getSpecialty());
        assertEquals("test photo", result.getPhoto());
        assertNotNull(result.getTrainerId());
    }

    @Test
    void updateTrainer_NoExistingTrainer_ShouldThrow() {
        // given
        User user = new User();
        user.setUserId(1);
        TrainerUpdateDTO dto = new TrainerUpdateDTO();

        when(trainerMapper.selectOne(any())).thenReturn(null);

        // when & then
        RuntimeException ex = assertThrows(RuntimeException.class,
            () -> trainerService.updateTrainer(dto, user));
        assertEquals("No trainer found for user", ex.getMessage());
        verify(trainerMapper, never()).updateById(any());
    }

    @Test
    void updateTrainer_SuccessfulUpdate_ShouldMapAndReturnDto() {
        // given
        User user = new User();
        user.setUserId(2);
        TrainerUpdateDTO dto = new TrainerUpdateDTO();
        dto.setSpecialty("Yoga");
        dto.setExperience(3);
        dto.setCertification("Cert");
        dto.setBio("Bio");
        dto.setPhoto("PhotoUrl");

        Trainer existing = new Trainer();
        existing.setTrainerId(10);
        existing.setUserId(2);
        existing.setSpecialty("Old");
        existing.setExperience(1);
        existing.setCertification("OldCert");
        existing.setBio("OldBio");
        existing.setPhoto("OldPhoto");

        when(trainerMapper.selectOne(any())).thenReturn(existing);

        TrainerResponseDTO response = new TrainerResponseDTO();
        response.setTrainerId(10);
        response.setSpecialty(dto.getSpecialty());
        response.setExperience(dto.getExperience());
        response.setCertification(dto.getCertification());
        response.setBio(dto.getBio());
        response.setPhoto(dto.getPhoto());
        when(trainerDtoMapper.toDto(existing)).thenReturn(response);

        // when
        TrainerResponseDTO result = trainerService.updateTrainer(dto, user);

        // then
        assertNotNull(result);
        assertEquals(10, result.getTrainerId());
        assertEquals("Yoga", result.getSpecialty());
        assertEquals(3, result.getExperience());
        assertEquals("Cert", result.getCertification());
        assertEquals("Bio", result.getBio());
        assertEquals("PhotoUrl", result.getPhoto());

        verify(trainerDtoMapper).updatetoEntity(dto, existing);
        verify(trainerMapper).updateById(existing);
    }

}
