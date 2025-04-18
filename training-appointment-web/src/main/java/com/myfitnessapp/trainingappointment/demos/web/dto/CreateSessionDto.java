package com.myfitnessapp.trainingappointment.demos.web.dto;

import lombok.Data;
import javax.validation.constraints.Future;
import javax.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.time.LocalDateTime;
@Data
public class CreateSessionDto {
    @NotNull private Integer trainerId;
    @NotNull private Integer centerId;
    @NotNull @Future private LocalDateTime sessionDatetime;
    @NotNull private Integer duration;
    private BigDecimal price;
}
