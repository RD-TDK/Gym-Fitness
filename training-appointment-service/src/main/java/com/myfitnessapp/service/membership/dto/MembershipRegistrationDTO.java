package com.myfitnessapp.service.membership.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class MembershipRegistrationDTO {
    /**
     * 用户选择的会员套餐等级，例如：
     * BASIC、PREMIUM、GOLD 等（可以根据实际需求扩展为枚举）
     */
    private String planType;
}
