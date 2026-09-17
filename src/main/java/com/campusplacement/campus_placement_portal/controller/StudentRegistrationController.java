package com.campusplacement.campus_placement_portal.controller;

import com.campusplacement.campus_placement_portal.model.Student;
import com.campusplacement.campus_placement_portal.model.StudentRegistrationRequest;
import com.campusplacement.campus_placement_portal.model.User;
import com.campusplacement.campus_placement_portal.repository.StudentRepository;
import com.campusplacement.campus_placement_portal.repository.UserRepository;

import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.util.UUID;

import com.campusplacement.campus_placement_portal.service.EmailService;
@RestController
@RequestMapping("/auth")
public class StudentRegistrationController {

    private final UserRepository userRepository;
    private final StudentRepository studentRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;

    public StudentRegistrationController(
            UserRepository userRepository,
            StudentRepository studentRepository,
            PasswordEncoder passwordEncoder,
            EmailService emailService) {

        this.userRepository = userRepository;
        this.studentRepository = studentRepository;
        this.passwordEncoder = passwordEncoder;
        this.emailService = emailService;
    }

    // ================= STUDENT REGISTRATION =================

    @PostMapping("/student/register")
    @ResponseStatus(HttpStatus.CREATED)
    public String registerStudent(
            @RequestBody StudentRegistrationRequest request) {

        // Check username
        if (userRepository.findByUsername(request.getUsername()).isPresent()) {
            throw new RuntimeException(
                    "Username already exists"
            );
        }

        // Check email in User table
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException(
                    "Email already exists"
            );
        }

        // Check email in Student table
        if (studentRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException(
                    "Student with this email already exists"
            );
        }

        // ================= CREATE USER =================

        User user = new User();

        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());

        // Encrypt password before saving
        user.setPassword(
                passwordEncoder.encode(request.getPassword())
        );

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
                "http://localhost:8080/auth/verify-email?token="
                        + verificationToken;

        emailService.sendEmail(
                user.getEmail(),
                "Verify Your Campus Placement Portal Account",
                "Hello " + request.getName() + ",\n\n"
                        + "Thank you for registering with Campus Placement Portal.\n\n"
                        + "Please click the link below to verify your email:\n\n"
                        + verificationLink
                        + "\n\nThis link will expire in 24 hours.\n\n"
                        + "Regards,\n"
                        + "Campus Placement Portal"
        );
        // ================= CREATE STUDENT =================

        Student student = new Student();

        student.setName(request.getName());
        student.setEmail(request.getEmail());
        student.setBranch(request.getBranch());

        studentRepository.save(student);

        return "Student registration successful";
    }
}