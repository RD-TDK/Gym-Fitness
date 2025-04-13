package com.myfitnessapp.service.user.service;

public interface VerificationCodeService {

    void generateAndSend(String destinationEmail);

    boolean validateVerificationCode(String destinationEmail, String inputVerificationCode);
}
