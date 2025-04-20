package com.myfitnessapp.service.membership.scheduler;

import com.myfitnessapp.service.membership.mapper.MembershipMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
@Slf4j
public class MembershipExpiryScheduler {
    @Autowired
    private MembershipMapper membershipMapper;

    /**
     * 每天凌晨1点执行一次，自动把到期的会员标记为不激活
     */
    @Scheduled(cron = "0 0 1 * * ?")
    public void expireMemberships() {
        int count = membershipMapper.expireOldMemberships(LocalDateTime.now());
        log.info("定时任务：已将 {} 条过期会员设为非激活", count);
    }
}
