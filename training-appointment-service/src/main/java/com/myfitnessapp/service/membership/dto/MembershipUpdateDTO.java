package com.myfitnessapp.service.membership.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotNull;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class MembershipUpdateDTO {
    /**
     * 要升级或续费到的套餐类型，比如 PREMIUM、GOLD、MONTHLY……
     */
    @NotBlank
    private String planType;

    @NotNull
    @Min(1)
    private int months;
}
