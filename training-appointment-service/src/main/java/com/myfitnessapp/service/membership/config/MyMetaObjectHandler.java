package com.myfitnessapp.service.membership.config;

import com.baomidou.mybatisplus.core.handlers.MetaObjectHandler;
import org.apache.ibatis.reflection.MetaObject;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class MyMetaObjectHandler implements MetaObjectHandler {
    @Override
    public void insertFill(MetaObject metaObject) {
        // 1. 先让 MapStruct 或业务层填好 startDate/endDate，再计算 isActive
        LocalDateTime endDate = (LocalDateTime) getFieldValByName("endDate", metaObject);
        boolean active = endDate != null && endDate.isAfter(LocalDateTime.now());
        // 严格插入填充
        strictInsertFill(metaObject, "isActive", Boolean.class, active);
        // 也可以同时填充 createdAt/updatedAt
        strictInsertFill(metaObject, "createdAt", LocalDateTime.class, LocalDateTime.now());
        strictInsertFill(metaObject, "updatedAt", LocalDateTime.class, LocalDateTime.now());
    }

    @Override
    public void updateFill(MetaObject metaObject) {
        // 更新时也重新计算 isActive
        LocalDateTime endDate = (LocalDateTime) getFieldValByName("endDate", metaObject);
        boolean active = endDate != null && endDate.isAfter(LocalDateTime.now());
        strictUpdateFill(metaObject, "isActive", Boolean.class, active);
        // 同时更新 updatedAt
        strictUpdateFill(metaObject, "updatedAt", LocalDateTime.class, LocalDateTime.now());
    }
}
