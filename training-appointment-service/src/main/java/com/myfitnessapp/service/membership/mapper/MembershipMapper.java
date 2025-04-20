package com.myfitnessapp.service.membership.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.myfitnessapp.service.membership.domain.Membership;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Update;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;

@Mapper
@Repository
public interface MembershipMapper extends BaseMapper<Membership> {
    /**
     * 将 endDate 早于当前时间且仍标记为激活的记录，批量改为 isActive = false
     * @param now 当前时间
     * @return 受影响行数
     */
    @Update("UPDATE membership SET is_active = 0 WHERE end_date < #{now} AND is_active = 1")
    int expireOldMemberships(LocalDateTime now);
}
