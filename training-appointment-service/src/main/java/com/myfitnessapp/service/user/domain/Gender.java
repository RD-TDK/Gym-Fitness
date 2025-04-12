package com.myfitnessapp.service.user.domain;

import lombok.Getter;

@Getter
public enum Gender {
    MALE("Male"),
    FEMALE("Female"),
    PREFER_NOT_TO_SAY("Prefer not to say");

    private final String value;

    Gender(String value) {
        this.value = value;
    }

}
