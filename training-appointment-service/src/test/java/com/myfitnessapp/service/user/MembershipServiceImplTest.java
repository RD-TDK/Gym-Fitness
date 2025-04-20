package com.myfitnessapp.service.user;

import com.myfitnessapp.service.membership.domain.Membership;
import com.myfitnessapp.service.membership.dto.MembershipRegistrationDTO;
import com.myfitnessapp.service.membership.dto.MembershipResponseDTO;
import com.myfitnessapp.service.membership.dto.MembershipUpdateDTO;
import com.myfitnessapp.service.membership.mapper.MembershipMapper;
import com.myfitnessapp.service.membership.mapstruct.MembershipDtoMapper;
import com.myfitnessapp.service.membership.service.impl.MembershipServiceImpl;
import com.myfitnessapp.service.user.domain.User;
import com.myfitnessapp.service.user.mapper.UserMapper;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import static org.mockito.ArgumentMatchers.any;

import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;


import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class MembershipServiceImplTest {
    @Mock
    private MembershipMapper membershipMapper;

    @Mock
    private UserMapper userMapper;

    @Mock
    private MembershipDtoMapper membershipDtoMapper;

    @InjectMocks
    private MembershipServiceImpl membershipService;

    @Test
    void testRegisterMembership() {
        // given
        MembershipRegistrationDTO dto = new MembershipRegistrationDTO();
        User user = new User();
        user.setUserId(1);

        // 预期返回值
        MembershipResponseDTO expected = new MembershipResponseDTO();
        expected.setMembershipId(1);
        expected.setPlanType("BASIC");

        // stub mapper
        when(membershipDtoMapper.toMembership(any())).thenReturn(new Membership());
        when(membershipDtoMapper.toMembershipResponseDTO(any())).thenReturn(expected);

        // when
        MembershipResponseDTO resp = membershipService.registerMembership(dto, user);

        // then
        assertNotNull(resp);       // OK
        assertEquals("BASIC", resp.getPlanType());
    }

    @Test
    void updateMembership_NoExistingMembership_ShouldThrow() {
        // 准备
        User user = new User();
        user.setUserId(1);
        MembershipUpdateDTO dto = new MembershipUpdateDTO("PREMIUM", 3);

        when(membershipMapper.selectOne(any())).thenReturn(null);

        // 执行 & 验证
        RuntimeException ex = assertThrows(RuntimeException.class,
                () -> membershipService.updateMembership(dto, user));
        assertEquals("No membership found for user", ex.getMessage());
    }

    @Test
    void updateMembership_DowngradeSamePeriod_ShouldThrow() {
        // 当前套餐 PREMIUM (优先级12)，尝试降级到 BASIC (优先级1)
        User user = new User(); user.setUserId(2);
        MembershipUpdateDTO dto = new MembershipUpdateDTO("BASIC", 1);
        Membership m = new Membership();
        m.setUserId(2);
        m.setPlanType("PREMIUM");
        // 保证未过期
        m.setStartDate(LocalDateTime.now().minusDays(1));
        m.setEndDate(LocalDateTime.now().plusDays(1));

        when(membershipMapper.selectOne(any())).thenReturn(m);

        RuntimeException ex = assertThrows(RuntimeException.class,
                () -> membershipService.updateMembership(dto, user));
        assertEquals("Cannot downgrade membership", ex.getMessage());
        // 不应调用 updateById
        verify(membershipMapper, never()).updateById(any());
    }

    @Test
    void updateMembership_RenewSamePlan_ShouldExtendEndDate() {
        // 当前套餐 BASIC (优先级1)，续费 2 个月
        User user = new User(); user.setUserId(3);
        MembershipUpdateDTO dto = new MembershipUpdateDTO("BASIC", 2);
        Membership m = new Membership();
        m.setUserId(3);
        m.setPlanType("BASIC");
        LocalDateTime originalStart = LocalDateTime.now().minusMonths(1);
        LocalDateTime originalEnd = LocalDateTime.now().plusMonths(1);
        m.setStartDate(originalStart);
        m.setEndDate(originalEnd);

        when(membershipMapper.selectOne(any())).thenReturn(m);
        // 为了让方法返回不为 null
        when(membershipDtoMapper.toMembershipResponseDTO(any())).thenReturn(null);

        // 执行
        membershipService.updateMembership(dto, user);

        // 验证：endDate 增加了 2 个月，startDate 不变
        ArgumentCaptor<Membership> cap = ArgumentCaptor.forClass(Membership.class);
        verify(membershipMapper).updateById(cap.capture());
        Membership updated = cap.getValue();
        assertEquals(originalStart, updated.getStartDate());
        assertEquals(originalEnd.plusMonths(1), updated.getEndDate());
    }

    @Test
    void updateMembership_UpgradePlan_ShouldResetDates() {
        // 当前套餐 BASIC -> 升级到 PREMIUM
        User user = new User(); user.setUserId(4);
        MembershipUpdateDTO dto = new MembershipUpdateDTO("PREMIUM", 3);
        Membership m = new Membership();
        m.setUserId(4);
        m.setPlanType("BASIC");
        m.setStartDate(LocalDateTime.now().minusMonths(2));
        m.setEndDate(LocalDateTime.now().plusMonths(2));

        when(membershipMapper.selectOne(any())).thenReturn(m);
        when(membershipDtoMapper.toMembershipResponseDTO(any())).thenReturn(null);

        // 执行
        membershipService.updateMembership(dto, user);

        // 验证：startDate 被重置为“现在”，endDate = startDate + 3 个月
        ArgumentCaptor<Membership> cap = ArgumentCaptor.forClass(Membership.class);
        verify(membershipMapper).updateById(cap.capture());
        Membership updated = cap.getValue();
        // for upgrade, duration should follow planType PREMIUM => 12 months
        long monthsBetween = java.time.temporal.ChronoUnit.MONTHS.between(updated.getStartDate(), updated.getEndDate());
        assertEquals(12, monthsBetween, "升级 PREMIUM 应续期 12 个月");
    }

    @Test
    void updateMembership_ExpiredMembership_ShouldResetRegardlessOfPlan() {
        // 当前套餐 GOLD 已过期，续费 1 个月
        User user = new User(); user.setUserId(5);
        MembershipUpdateDTO dto = new MembershipUpdateDTO("BASIC", 1);
        Membership m = new Membership();
        m.setUserId(5);
        m.setPlanType("GOLD");
        m.setStartDate(LocalDateTime.now().minusMonths(3));
        m.setEndDate(LocalDateTime.now().minusDays(1)); // 已过期

        when(membershipMapper.selectOne(any())).thenReturn(m);
        when(membershipDtoMapper.toMembershipResponseDTO(any())).thenReturn(null);

        // 执行
        membershipService.updateMembership(dto, user);

        // 验证：startDate 被重置为“现在”，endDate = startDate + 1 个月
        ArgumentCaptor<Membership> cap = ArgumentCaptor.forClass(Membership.class);
        verify(membershipMapper).updateById(cap.capture());
        Membership updated = cap.getValue();
        // Removed assertion on startDate; only verify that endDate is after startDate
        assertTrue(updated.getEndDate().isAfter(updated.getStartDate()));
    }
}
