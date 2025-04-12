package com.myfitnessapp.service.user.service.impl;

import com.myfitnessapp.service.user.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import javax.mail.internet.MimeMessage;
import javax.mail.MessagingException;

@Service
public class EmailServiceImpl implements EmailService {
    private final JavaMailSender mailSender; // Spring Boot 提供的邮件发送器

    @Autowired
    public EmailServiceImpl(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    @Override
    public void sendEmail(String toEmail, String subject, String content) {
        try {
            // 1. 创建 MimeMessage 对象
            MimeMessage mimeMessage = mailSender.createMimeMessage();

            // 使用 MimeMessageHelper 辅助类设置邮件属性：
            // 第一个参数是 MimeMessage 对象；
            // 第二个参数 true 表示 multipart 模式，通常用于附件等情况（即允许支持富文本）；
            // 第三个参数指定编码（例如 "UTF-8"）保证邮件内容不出现乱码。
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");

            // 设置收件人邮箱地址
            helper.setTo(toEmail);
            // 设置邮件主题
            helper.setSubject(subject);
            // 设置邮件正文，第二个参数为 true 表示正文支持 HTML 格式
            helper.setText(content, true);

            // 调用 mailSender 发送邮件
            mailSender.send(mimeMessage);

            // 控制台输出发送成功信息
            System.out.println("Email sent successfully to: " + toEmail);


        } catch (MessagingException e) {
            System.err.println("Failed to send email: " + e.getMessage());
        }
    }
}
