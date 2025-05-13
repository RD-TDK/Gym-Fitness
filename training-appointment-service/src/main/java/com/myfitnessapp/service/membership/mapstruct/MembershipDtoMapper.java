package com.myfitnessapp.service.membership.mapstruct;

import com.myfitnessapp.service.membership.domain.Membership;
import com.myfitnessapp.service.membership.dto.MembershipRegistrationDTO;
import com.myfitnessapp.service.membership.dto.MembershipResponseDTO;
import com.myfitnessapp.service.membership.dto.MembershipUpdateDTO;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import java.time.LocalDateTime;

@Mapper(componentModel = "spring")
public interface MembershipDtoMapper {

    // DTO -> Entity

    @Mapping(target = "memberId", ignore = true)
    @Mapping(target = "userId", ignore = true) // 由业务逻辑在 Service 层设置
    @Mapping(target = "planType", source = "planType")
    // 自动设置 startDate 为当前日期
    @Mapping(target = "startDate", expression = "java(java.time.LocalDateTime.now())")
    // 根据套餐类型计算 endDate
    @Mapping(target = "endDate", expression = "java(calculateEndDate(dto.getPlanType()))")
    // 默认激活状态设为 true
//    @Mapping(target = "isActive", constant = "false")
    // 记录创建和更新时间设为当前时间（也可以在数据库设置默认值）
    @Mapping(target = "createdAt", expression = "java(java.time.LocalDateTime.now())")
    @Mapping(target = "updatedAt", expression = "java(java.time.LocalDateTime.now())")
    Membership toMembership(MembershipRegistrationDTO dto);

    /**
     * 将前端要更新的套餐信息打到已有的 Membership 实体上
     */
    @Mapping(target = "planType", source = "planType")
    void updateFromDto(MembershipUpdateDTO dto, @MappingTarget Membership membership);


    // Entity -> DTO
    @Mapping(target = "membershipId", source = "memberId")   // 字段名不一致时显式指定
    @Mapping(target = "isActive", expression = "java(membership.getEndDate().isAfter(java.time.LocalDateTime.now()))")
    MembershipResponseDTO toMembershipResponseDTO(Membership membership);

    default LocalDateTime calculateEndDate(String planType) {
        LocalDateTime start = LocalDateTime.now();
        if (planType == null) {
            planType = "BASIC";
        }
        switch (planType.toUpperCase()) {
            case "PREMIUM":
                // 例如 PREMIUM 套餐有效期为 1 年
                return start.plusYears(1);
            case "GOLD":
                // GOLD 套餐有效期为 6 个月
                return start.plusMonths(6);
            case "ANNUAL":
                // ANNUAL 套餐为 1 年
                return start.plusYears(1);
            case "MONTHLY":
                // MONTHLY 套餐为 1 个月
                return start.plusMonths(1);
            case "BASIC":
            default:
                // 默认 BASIC 套餐为 1 个月
                return start.plusMonths(1);
        }
    }
}
