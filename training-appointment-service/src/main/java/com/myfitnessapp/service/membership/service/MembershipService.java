package com.myfitnessapp.service.membership.service;

import com.myfitnessapp.service.membership.dto.MembershipRegistrationDTO;
import com.myfitnessapp.service.membership.dto.MembershipResponseDTO;
import com.myfitnessapp.service.membership.dto.MembershipUpdateDTO;
import com.myfitnessapp.service.user.domain.User;

public interface MembershipService {
    /**
     * 根据传入的 MembershipRegistrationDTO 和当前用户信息，
     * 完成会员注册，并返回对应的 MembershipResponseDTO。
     *
     * @param dto         会员注册 DTO，包含用户选择的套餐类型等信息
     * @param currentUser 当前已登录用户（默认角色 VISITOR）
     * @return 会员注册完成后生成的响应 DTO
     */
    MembershipResponseDTO registerMembership(MembershipRegistrationDTO dto, User currentUser);

    MembershipResponseDTO updateMembership(MembershipUpdateDTO dto, User currentUser);

    MembershipResponseDTO getMembershipByUser(User user);
}
