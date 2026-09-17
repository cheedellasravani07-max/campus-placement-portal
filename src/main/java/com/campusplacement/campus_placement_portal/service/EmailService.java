package com.campusplacement.campus_placement_portal.service;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private final JavaMailSender javaMailSender;

    public EmailService(JavaMailSender javaMailSender) {
        this.javaMailSender = javaMailSender;
    }

    public void sendEmail(String to, String subject, String message) {

        System.out.println("========== EMAIL SENDING ==========");
        System.out.println("TO: " + to);
        System.out.println("SUBJECT: " + subject);
        System.out.println("MESSAGE: " + message);

        SimpleMailMessage mailMessage = new SimpleMailMessage();

        mailMessage.setTo(to);
        mailMessage.setSubject(subject);
        mailMessage.setText(message);

        javaMailSender.send(mailMessage);

        System.out.println("========== EMAIL SENT SUCCESSFULLY ==========");
    }
}