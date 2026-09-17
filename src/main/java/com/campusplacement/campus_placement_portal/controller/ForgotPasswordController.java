package com.campusplacement.campus_placement_portal.controller;

import com.campusplacement.campus_placement_portal.model.User;
import com.campusplacement.campus_placement_portal.repository.UserRepository;
import com.campusplacement.campus_placement_portal.service.EmailService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.UUID;

@RestController
@RequestMapping("/forgot-password")
public class ForgotPasswordController {

    private final UserRepository userRepository;
    private final EmailService emailService;

    public ForgotPasswordController(
            UserRepository userRepository,
            EmailService emailService) {

        this.userRepository = userRepository;
        this.emailService = emailService;
    }


    // ======================================================
    // CHECK EMAIL AND SEND RESET LINK
    // ======================================================

    @PostMapping("/check")
    public ResponseEntity<String> checkEmail(
            @RequestBody ForgotPasswordRequest request) {

        if (request.getEmail() == null ||
                request.getEmail().trim().isEmpty()) {

            return ResponseEntity.badRequest()
                    .body("Email is required");
        }

        String email =
                request.getEmail()
                        .trim();


        User user =
                userRepository.findByEmail(email)
                        .orElse(null);


        if (user == null) {

            return ResponseEntity
                    .status(404)
                    .body("No account found with this email");
        }


        // ================= GENERATE TOKEN =================

        String resetToken =
                UUID.randomUUID().toString();


        // ================= TOKEN EXPIRY =================

        LocalDateTime expiry =
                LocalDateTime.now().plusMinutes(15);


        user.setResetToken(resetToken);

        user.setResetTokenExpiry(expiry);

        userRepository.save(user);


        // ================= RESET LINK =================

        String resetLink =
                "http://localhost:8080/reset-password.html?token="
                        + resetToken;


        // ================= EMAIL =================

        String subject =
                "Campus Placement Portal - Password Reset";


        String message =
                "Hello " + user.getUsername() + ",\n\n"
                        + "We received a request to reset your password.\n\n"
                        + "Click the link below to reset your password:\n\n"
                        + resetLink + "\n\n"
                        + "This link will expire in 15 minutes.\n\n"
                        + "If you did not request a password reset, "
                        + "please ignore this email.\n\n"
                        + "Campus Placement Portal";


        emailService.sendEmail(
                user.getEmail(),
                subject,
                message
        );


        return ResponseEntity.ok(
                "Password reset link has been sent to your email."
        );
    }


    // ======================================================
    // REQUEST DTO
    // ======================================================

    public static class ForgotPasswordRequest {

        private String email;


        public ForgotPasswordRequest() {
        }


        public String getEmail() {
            return email;
        }


        public void setEmail(String email) {
            this.email = email;
        }
    }

    // ======================================================
// RESET PASSWORD
// ======================================================

    @PostMapping("/reset")
    public ResponseEntity<String> resetPassword(
            @RequestBody ResetPasswordRequest request) {

        if (request.getToken() == null ||
                request.getToken().trim().isEmpty()) {

            return ResponseEntity.badRequest()
                    .body("Reset token is required");
        }

        if (request.getNewPassword() == null ||
                request.getNewPassword().trim().isEmpty()) {

            return ResponseEntity.badRequest()
                    .body("New password is required");
        }


        // ================= FIND USER =================

        User user =
                userRepository
                        .findByResetToken(request.getToken().trim())
                        .orElse(null);


        if (user == null) {

            return ResponseEntity
                    .badRequest()
                    .body("Invalid reset token");
        }


        // ================= CHECK EXPIRY =================

        if (user.getResetTokenExpiry() == null ||
                user.getResetTokenExpiry()
                        .isBefore(java.time.LocalDateTime.now())) {

            return ResponseEntity
                    .badRequest()
                    .body("Reset token has expired");
        }


        // ================= ENCODE PASSWORD =================

        org.springframework.security.crypto.password.PasswordEncoder
                passwordEncoder =
                new org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder();

        user.setPassword(
                passwordEncoder.encode(
                        request.getNewPassword()
                )
        );


        // ================= CLEAR TOKEN =================

        user.setResetToken(null);

        user.setResetTokenExpiry(null);


        // ================= SAVE USER =================

        userRepository.save(user);


        return ResponseEntity.ok(
                "Password reset successfully. You can now login."
        );
    }


// ======================================================
// RESET PASSWORD REQUEST DTO
// ======================================================

    public static class ResetPasswordRequest {

        private String token;

        private String newPassword;


        public ResetPasswordRequest() {
        }


        public String getToken() {
            return token;
        }

        public String getNewPassword() {
            return newPassword;
        }


        public void setToken(String token) {
            this.token = token;
        }

        public void setNewPassword(String newPassword) {
            this.newPassword = newPassword;
        }
    }
}