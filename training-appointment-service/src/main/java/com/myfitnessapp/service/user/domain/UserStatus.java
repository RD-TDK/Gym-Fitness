package com.myfitnessapp.service.user.domain;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum UserStatus {
    INACTIVE,
    ACTIVE,
    SUSPENDED;

    @JsonValue
    public String toValue() {
        return name();
    }

    @JsonCreator
    public static UserStatus forValue(String value) {
        return UserStatus.valueOf(value.toUpperCase());
    }
}
