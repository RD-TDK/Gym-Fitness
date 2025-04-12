package com.myfitnessapp.service.user.service;

public interface VerificationCodeService {

    String generateAndSend(String destinationEmail);

    boolean validateVerificationCode(String destinationEmail, String inputVerificationCode);
}
