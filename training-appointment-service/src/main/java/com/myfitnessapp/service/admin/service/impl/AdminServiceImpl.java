package com.myfitnessapp.service.admin.service.impl;

import com.myfitnessapp.service.membership.domain.Membership;
import com.myfitnessapp.service.trainer.domain.CertificationStatus;
import com.myfitnessapp.service.user.domain.UserStatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.myfitnessapp.service.admin.service.AdminService;
import com.myfitnessapp.service.user.domain.User;
import com.myfitnessapp.service.user.mapper.UserMapper;
import com.myfitnessapp.service.trainer.domain.Trainer;
import com.myfitnessapp.service.trainer.mapper.TrainerMapper;
import com.myfitnessapp.service.membership.mapper.MembershipMapper;

@Service
@Transactional
public class AdminServiceImpl implements AdminService {
    private final UserMapper userMapper;
    private final TrainerMapper trainerMapper;
    private final MembershipMapper membershipMapper;

    @Autowired
    public AdminServiceImpl(UserMapper userMapper,
                            TrainerMapper trainerMapper, MembershipMapper membershipMapper) {
        this.userMapper = userMapper;
        this.trainerMapper = trainerMapper;
        this.membershipMapper = membershipMapper;
    }

    @Override
    public void banUser(int userId) {
        // Fetch user, set status, save
        User user = userMapper.selectById(userId);
        if (user != null) {
            user.setUserStatus(UserStatus.SUSPENDED);
            userMapper.updateById(user);
        }
    }

    @Override
    public void verifyTrainer(int trainerId) {
        // Fetch trainer, set certified flag, save
        Trainer trainer = trainerMapper.selectById(trainerId);
        if (trainer != null) {
            trainer.setIsCertified(CertificationStatus.VERIFIED);
            trainerMapper.updateById(trainer);
        }
    }

    @Override
    public void activeMember(int memberId) {
        Membership member = membershipMapper.selectById(memberId);
        if (member != null) {
            member.setIsActive(true);
            membershipMapper.updateById(member);
        }
    }
}
