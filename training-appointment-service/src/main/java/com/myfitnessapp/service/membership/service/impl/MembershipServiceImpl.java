package com.myfitnessapp.service.membership.service.impl;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.myfitnessapp.service.membership.domain.Membership;
import com.myfitnessapp.service.membership.dto.MembershipRegistrationDTO;
import com.myfitnessapp.service.membership.dto.MembershipResponseDTO;
import com.myfitnessapp.service.membership.dto.MembershipUpdateDTO;
import com.myfitnessapp.service.membership.mapper.MembershipMapper;
import com.myfitnessapp.service.membership.mapstruct.MembershipDtoMapper;
import com.myfitnessapp.service.membership.service.MembershipService;
import com.myfitnessapp.service.user.domain.Role;
import com.myfitnessapp.service.user.domain.User;
import com.myfitnessapp.service.user.mapper.UserMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Primary
@Slf4j
public class MembershipServiceImpl implements MembershipService {
    private final MembershipMapper membershipMapper;
    private final MembershipDtoMapper membershipDtoMapper;
    private final UserMapper userMapper;

    @Autowired
    public MembershipServiceImpl(MembershipMapper membershipMapper,
                                 MembershipDtoMapper membershipDtoMapper, @Qualifier("userMapper") UserMapper userMapper) {
        this.membershipMapper = membershipMapper;
        this.membershipDtoMapper = membershipDtoMapper;
        this.userMapper = userMapper;
    }

    /**
     * 业务步骤：
     * 1. 使用 MembershipDtoMapper 将 MembershipRegistrationDTO 转换为 Membership 实体。
     * 2. 设置当前用户的 userId（当前登录用户通常为 VISITOR）。
     * 3. 根据套餐级别计算 startDate 和 endDate（由 mapper 中的表达式实现）。
     * 4. 调用工具生成格式化的 memberId，并赋值给会员记录。
     * 5. 将记录插入数据库。
     * 6. 更新当前用户角色为 MEMBER（更新逻辑可放在 UserService 或通过 Mapper 完成）。
     * 7. 构造并返回 MembershipResponseDTO。
     */
    @Override
    @Transactional
    public MembershipResponseDTO registerMembership(MembershipRegistrationDTO dto, User currentUser) {
        // 1. 通过 MapStruct 将 DTO 转换为 Membership 实体
        Membership membership = membershipDtoMapper.toMembership(dto);

        // 2. 设置当前用户的 userId
        membership.setUserId(currentUser.getUserId());


        // 4. 将记录插入数据库
        membershipMapper.insert(membership);
        log.info("新会员自增 ID={}", membership.getMemberId());
        // 5. 更新当前用户角色为 MEMBER
        currentUser.setRole(Role.MEMBER);
        userMapper.updateById(currentUser);

        // 6. 使用 MapStruct 直接转换 Entity -> DTO
        MembershipResponseDTO response = membershipDtoMapper.toMembershipResponseDTO(membership);
        return response;
    }

    @Override
    @Transactional
    public MembershipResponseDTO updateMembership(MembershipUpdateDTO dto, User currentUser) {
    // Query the latest Membership record for currentUser
    QueryWrapper<Membership> queryWrapper = new QueryWrapper<>();
    queryWrapper.eq("user_id", currentUser.getUserId())
                .orderByDesc("start_date")
                .last("LIMIT 1");
    Membership membership = membershipMapper.selectOne(queryWrapper);
    if (membership == null) {
        throw new RuntimeException("No membership found for user");
    }

    LocalDateTime now = LocalDateTime.now();
    // Treat any endDate at or before now as expired
    boolean isExpired = !membership.getEndDate().isAfter(now);

    int newPriority = planPriority(dto.getPlanType());
    int currentPriority = planPriority(membership.getPlanType());
    int monthsToAdd;
    switch (dto.getPlanType().toUpperCase()) {
        case "PREMIUM":
        case "ANNUAL":
            monthsToAdd = 12;
            break;
        case "GOLD":
            monthsToAdd = 6;
            break;
        case "MONTHLY":
        case "BASIC":
        default:
            monthsToAdd = 1;
            break;
    }

    LocalDateTime newStartDate;
    LocalDateTime newEndDate;
    if (!isExpired) {
        if (newPriority < currentPriority) {
            throw new RuntimeException("Cannot downgrade membership");
        } else if (newPriority == currentPriority) {
            // Renew same plan: extend endDate
            newStartDate = membership.getStartDate();
            newEndDate = membership.getEndDate().plusMonths(monthsToAdd);
        } else {
            // Upgrade: reset startDate and endDate
            newStartDate = now;
            newEndDate = now.plusMonths(monthsToAdd);
        }
    } else {
        // Expired: start fresh
        newStartDate = now;
        newEndDate = now.plusMonths(monthsToAdd);
    }

    // Update original membership
    membership.setPlanType(dto.getPlanType());
    membership.setStartDate(newStartDate);
    membership.setEndDate(newEndDate);
    membership.setUpdatedAt(now);
    membershipMapper.updateById(membership);
    return membershipDtoMapper.toMembershipResponseDTO(membership);
    }

    @Override
    public MembershipResponseDTO getMembershipByUser(User user) {
        // Query the most recent membership record for this user
        QueryWrapper<Membership> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("user_id", user.getUserId())
                    .orderByDesc("start_date")
                    .last("LIMIT 1");
        Membership membership = membershipMapper.selectOne(queryWrapper);
        if (membership == null) {
            throw new RuntimeException("No membership found for user id: " + user.getUserId());
        }
        // Convert entity to DTO
        return membershipDtoMapper.toMembershipResponseDTO(membership);
    }

    private int planPriority(String planType) {
        if (planType == null) {
            return 1;
        }
        switch(planType.toUpperCase()) {
            case "PREMIUM":
            case "ANNUAL":
                return 12;
            case "GOLD":
                return 6;
            case "MONTHLY":
            case "BASIC":
            default:
                return 1;
        }
    }
    @Override
    public Membership getByUserId(Integer userId) {
        QueryWrapper<Membership> wrapper = new QueryWrapper<>();
        wrapper.eq("user_id", userId)
               .orderByDesc("start_date")
               .last("LIMIT 1");
        return membershipMapper.selectOne(wrapper);
    }

    @Override
    public List<Membership> getPendingMemberships() {
        QueryWrapper<Membership> wrapper = new QueryWrapper<>();
        wrapper.eq("is_active", 0);
        return membershipMapper.selectList(wrapper);
    }
}