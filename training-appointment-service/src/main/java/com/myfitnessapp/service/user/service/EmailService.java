package com.myfitnessapp.service.user.service;

public interface EmailService {
    void sendEmail(String toEmail, String subject, String code);
}
