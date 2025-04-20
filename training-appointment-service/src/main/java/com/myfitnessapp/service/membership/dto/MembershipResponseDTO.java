package com.myfitnessapp.service.membership.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class MembershipResponseDTO {
    /**
     * 会员编号，由数据库自动生成
     */
    private Integer membershipId;

    /**
     * 会员套餐类型，例如 BASIC、PREMIUM、GOLD 等
     */
    private String planType;

    /**
     * 会员服务生效开始日期（由后端计算确定）
     */
    private LocalDateTime startDate;

    /**
     * 会员服务失效日期（由后端根据套餐类型计算确定）
     */
    private LocalDateTime endDate;

    /**
     * 会员状态，true 表示有效，false 表示无效或取消
     */
    private Boolean isActive;

    /**
     * 记录创建时间
     */
    private LocalDateTime createdAt;

    /**
     * 记录更新时间
     */
    private LocalDateTime updatedAt;
}
