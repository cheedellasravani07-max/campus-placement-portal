package com.campusplacement.campus_placement_portal.controller;

import com.campusplacement.campus_placement_portal.model.Student;
import com.campusplacement.campus_placement_portal.model.User;
import com.campusplacement.campus_placement_portal.repository.StudentRepository;
import com.campusplacement.campus_placement_portal.repository.UserRepository;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import com.campusplacement.campus_placement_portal.service.EmailService;

import java.time.LocalDateTime;
import java.util.UUID;
import java.util.Optional;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Value;
@Controller
public class AuthController {

    private final UserRepository userRepository;
    private final StudentRepository studentRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;

    @Value("${app.base-url}")
    private String baseUrl;

    public AuthController(
            UserRepository userRepository,
            StudentRepository studentRepository,
            PasswordEncoder passwordEncoder,
            EmailService emailService) {
        this.userRepository = userRepository;
        this.studentRepository = studentRepository;
        this.passwordEncoder = passwordEncoder;
        this.emailService = emailService;
    }

    // ================= STUDENT SIGN UP =================

    @PostMapping("/signup")
    public String signup(
            @RequestParam String name,
            @RequestParam String username,
            @RequestParam String email,
            @RequestParam String password,
            @RequestParam String branch,
            HttpServletRequest request) {


        // Check username already exists
        if (userRepository.findByUsername(username).isPresent()) {
            return "redirect:/login.html?signupError=username";
        }

        // Check email already exists
        if (userRepository.findByEmail(email).isPresent()) {
            return "redirect:/login.html?signupError=email";
        }

        // Create User account
        User user = new User();

        user.setUsername(username);
        user.setEmail(email);

        // Encrypt password before saving
        user.setPassword(passwordEncoder.encode(password));

        // Student role
        user.setRole("STUDENT");

// Generate email verification token
        String verificationToken = UUID.randomUUID().toString();

        user.setVerificationToken(verificationToken);
        user.setVerificationTokenExpiry(
                LocalDateTime.now().plusHours(24)
        );

        user.setEmailVerified(false);

        userRepository.save(user);

// Send verification email
        String verificationLink =
                baseUrl + "/verify-email?token=" + verificationToken;

        emailService.sendEmail(
                email,
                "Campus Placement Portal - Verify Your Email",
                "Hello " + name + ",\n\n" +
                        "Please verify your email by clicking the link below:\n\n" +
                        verificationLink + "\n\n" +
                        "This link is valid for 24 hours.\n\n" +
                        "Thank you,\n" +
                        "Campus Placement Portal"
        );

        userRepository.save(user);

// Create Student record
        Student student = new Student();

        student.setName(name);
        student.setEmail(email);
        student.setBranch(branch);

        studentRepository.save(student);

        return "redirect:/login.html?signupSuccess=true";
    }
    // ================= EMAIL VERIFICATION =================

    @GetMapping("/verify-email")
    public String verifyEmail(@RequestParam String token) {

        // Find user using verification token
        Optional<User> optionalUser =
                userRepository.findByVerificationToken(token);

        // Token not found
        if (optionalUser.isEmpty()) {
            return "redirect:/login.html?verificationError=invalid";
        }

        User user = optionalUser.get();

        // Check token expiry
        if (user.getVerificationTokenExpiry() == null ||
                user.getVerificationTokenExpiry().isBefore(LocalDateTime.now())) {

            return "redirect:/login.html?verificationError=expired";
        }

        // Verify email
        user.setEmailVerified(true);

        // Clear verification token
        user.setVerificationToken(null);
        user.setVerificationTokenExpiry(null);

        userRepository.save(user);

        return "redirect:/login.html?verificationSuccess=true";
    }
}