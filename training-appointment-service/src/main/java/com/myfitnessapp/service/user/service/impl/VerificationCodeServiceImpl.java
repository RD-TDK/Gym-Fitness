package com.myfitnessapp.service.user.service.impl;

import com.myfitnessapp.service.user.service.EmailService;
import com.myfitnessapp.service.user.service.VerificationCodeService;
import org.apache.commons.io.IOUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.util.Random;
import java.util.concurrent.TimeUnit;

@Service
public class VerificationCodeServiceImpl implements VerificationCodeService {
    private final StringRedisTemplate stringRedisTemplate;
    private final Random random = new Random();
    private final RedisTemplate redisTemplate;
    private final EmailService emailService;

    private static final String VERIFICATION_CODE_KEY_PREFIX = "verification_code:";

    @Autowired
    public VerificationCodeServiceImpl(StringRedisTemplate stringRedisTemplate, StringRedisTemplate stringRedisTemplate1,
                                       @Qualifier("redisTemplate") RedisTemplate redisTemplate,
                                       EmailService emailService) {
        this.stringRedisTemplate = stringRedisTemplate1;
        this.redisTemplate = redisTemplate;
        this.emailService = emailService;
    }

    @Override
    public void generateAndSend(String destinationEmail) {

        // Frequency of call restriction section
        String rateLimitKey = "verification_code:limit:" + destinationEmail;
        Boolean isRateLimited = stringRedisTemplate.hasKey(rateLimitKey);
        if (Boolean.TRUE.equals(isRateLimited)) {
            throw new IllegalStateException("You are requesting the verification code too frequently. Please try again later.");
        }
        // Set the frequency limit key and do not allow further requests within 60 seconds
        stringRedisTemplate.opsForValue().set(rateLimitKey, "1", 60, TimeUnit.SECONDS);

        // Generate a 6-digit random verification code
        String verificationCode = String.format("%06d", random.nextInt(1000000));

        // Construct the Redis key and store the code with a 5-minute expiration
        String redisKey = VERIFICATION_CODE_KEY_PREFIX + destinationEmail;
        stringRedisTemplate.opsForValue().set(redisKey, verificationCode, 300, TimeUnit.SECONDS);

        // Load the HTML email template
        String mailContent;
        try {
            Resource resource = new ClassPathResource("templates/VerificationCodeEmail.html");
            mailContent = IOUtils.toString(resource.getInputStream(), StandardCharsets.UTF_8);
        } catch (Exception e) {
            // If template loading fails, use a simple fallback template
            mailContent = "<p>Your verification code is: <b>" + verificationCode + "</b></p>" +
                    "<p>This code will expire in 5 minutes.</p>";
        }
        // Replace the placeholder with the actual code
        mailContent = mailContent.replace("${verificationCode}", verificationCode);

        // Use EmailService to send the email
        String subject = "Your Verification Code";
        emailService.sendEmail(destinationEmail, subject, mailContent);

    }

    @Override
    public boolean validateVerificationCode(String destinationEmail, String inputVerificationCode) {
        String redisKey = VERIFICATION_CODE_KEY_PREFIX + destinationEmail;
        String verificationCode = stringRedisTemplate.opsForValue().get(redisKey);
        if (verificationCode != null && verificationCode.equals(inputVerificationCode)) {
            stringRedisTemplate.delete(redisKey);
            return true;
        }
        return false;
    }


    private String getRedisKey(String destination) {
        // Compose a unique Redis Key based on the user's phone number or email address.
        return "verification_code:" + destination;
    }
}
