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

    @Autowired
    public VerificationCodeServiceImpl(StringRedisTemplate stringRedisTemplate, StringRedisTemplate stringRedisTemplate1,
                                       @Qualifier("redisTemplate") RedisTemplate redisTemplate,
                                       EmailService emailService) {
        this.stringRedisTemplate = stringRedisTemplate1;
        this.redisTemplate = redisTemplate;
        this.emailService = emailService;
    }

    @Override
    public String generateAndSend(String destinationEmail) {

        // 调用频率限制部分：
        String rateLimitKey = "verification_code:limit:" + destinationEmail;
        // 使用 stringRedisTemplate 检查频率限制 key 是否存在
        Boolean isRateLimited = stringRedisTemplate.hasKey(rateLimitKey);
        if (Boolean.TRUE.equals(isRateLimited)) {
            throw new IllegalStateException("You are requesting the verification code too frequently. Please try again later.");
        }
        // 设置频率限制 key，60秒内不允许再次请求
        stringRedisTemplate.opsForValue().set(rateLimitKey, "1", 60, TimeUnit.SECONDS);

        // Generate a 6-digit random verification code
        String verificationCode = String.format("%06d", random.nextInt(1000000));

        // Construct the Redis key and store the code with a 5-minute expiration
        String redisKey = getRedisKey(destinationEmail);
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

        return verificationCode;
    }

    @Override
    public boolean validateVerificationCode(String destinationEmail, String inputVerificationCode) {
        String redisKey = getRedisKey(destinationEmail);
        String verificationCode = (String) redisTemplate.opsForValue().get(redisKey);
        if (verificationCode != null && verificationCode.equals(inputVerificationCode)) {
            redisTemplate.delete(redisKey);
            return true;
        }
        return false;
    }


    private String getRedisKey(String destination) {
        // 根据用户的手机号或邮箱拼凑一个唯一的Redis Key
        return "verification_code:" + destination;
    }
}
