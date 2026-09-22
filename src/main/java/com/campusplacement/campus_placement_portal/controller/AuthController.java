package com.campusplacement.campus_placement_portal.controller;

import com.campusplacement.campus_placement_portal.model.Student;
import com.campusplacement.campus_placement_portal.model.User;
import com.campusplacement.campus_placement_portal.repository.StudentRepository;
import com.campusplacement.campus_placement_portal.repository.UserRepository;
import com.campusplacement.campus_placement_portal.service.EmailService;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@RestController
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

    // ============================================================
    // STUDENT REGISTRATION
    // ============================================================

    @PostMapping("/auth/student/register")
    public ResponseEntity<?> registerStudent(
            @RequestBody StudentRegistrationRequest request) {

        try {

            // ----------------------------------------------------
            // Validate input
            // ----------------------------------------------------

            if (request.getName() == null ||
                    request.getName().trim().isEmpty()) {

                return ResponseEntity.badRequest()
                        .body("Name is required.");
            }

            if (request.getUsername() == null ||
                    request.getUsername().trim().isEmpty()) {

                return ResponseEntity.badRequest()
                        .body("Username is required.");
            }

            if (request.getEmail() == null ||
                    request.getEmail().trim().isEmpty()) {

                return ResponseEntity.badRequest()
                        .body("Email is required.");
            }

            if (request.getPassword() == null ||
                    request.getPassword().length() < 6) {

                return ResponseEntity.badRequest()
                        .body("Password must contain at least 6 characters.");
            }

            if (request.getBranch() == null ||
                    request.getBranch().trim().isEmpty()) {

                return ResponseEntity.badRequest()
                        .body("Branch is required.");
            }


            // ----------------------------------------------------
            // Check username
            // ----------------------------------------------------

            if (userRepository.findByUsername(
                    request.getUsername().trim()).isPresent()) {

                return ResponseEntity.status(409)
                        .body("Username already exists.");
            }


            // ----------------------------------------------------
            // Check email
            // ----------------------------------------------------

            if (userRepository.findByEmail(
                    request.getEmail().trim()).isPresent()) {

                return ResponseEntity.status(409)
                        .body("Email already exists.");
            }


            // ----------------------------------------------------
            // Check student email
            // ----------------------------------------------------

            if (studentRepository.findByEmail(
                    request.getEmail().trim()).isPresent()) {

                return ResponseEntity.status(409)
                        .body("A student with this email already exists.");
            }


            // ----------------------------------------------------
            // Create User
            // ----------------------------------------------------

            User user = new User();

            user.setUsername(request.getUsername().trim());

            user.setEmail(request.getEmail().trim());

            user.setPassword(
                    passwordEncoder.encode(request.getPassword())
            );

            user.setRole("STUDENT");


            // ----------------------------------------------------
            // Email verification
            // ----------------------------------------------------

            String verificationToken =
                    UUID.randomUUID().toString();

            user.setVerificationToken(verificationToken);

            user.setVerificationTokenExpiry(
                    LocalDateTime.now().plusHours(24)
            );

            user.setEmailVerified(false);


            // ----------------------------------------------------
            // Save User
            // ----------------------------------------------------

            userRepository.save(user);


            // ----------------------------------------------------
            // Create Student
            // ----------------------------------------------------

            Student student = new Student();

            student.setName(request.getName().trim());

            student.setEmail(request.getEmail().trim());

            student.setBranch(request.getBranch().trim());

            studentRepository.save(student);


            // ----------------------------------------------------
            // Send verification email
            // ----------------------------------------------------

            String verificationLink =
                    baseUrl +
                            "/verify-email?token=" +
                            verificationToken;

            try {

                emailService.sendEmail(
                        request.getEmail().trim(),

                        "Campus Placement Portal - Verify Your Email",

                        "Hello " +
                                request.getName().trim() +
                                ",\n\n" +

                                "Please verify your email by clicking " +
                                "the link below:\n\n" +

                                verificationLink +

                                "\n\nThis link is valid for 24 hours.\n\n" +

                                "Thank you,\n" +
                                "Campus Placement Portal"
                );

            } catch (Exception emailException) {

                emailException.printStackTrace();

                // Registration has already been saved.
                // Do not create another account if the user
                // clicks the button again.

                return ResponseEntity.ok(
                        "Registration successful, but the verification email could not be sent. "
                                + "Please contact the administrator."
                );
            }


            // ----------------------------------------------------
            // Successful registration
            // ----------------------------------------------------

            return ResponseEntity.ok(
                    "Registration successful. "
                            + "Please check your email and verify your account."
            );

        } catch (Exception e) {

            e.printStackTrace();

            return ResponseEntity.internalServerError()
                    .body("Registration failed. Please try again.");
        }
    }


    // ============================================================
    // EMAIL VERIFICATION
    // ============================================================

    @GetMapping("/verify-email")
    public ResponseEntity<?> verifyEmail(
            @RequestParam String token) {

        Optional<User> optionalUser =
                userRepository.findByVerificationToken(token);

        if (optionalUser.isEmpty()) {

            return ResponseEntity.badRequest()
                    .body("Invalid verification link.");
        }

        User user = optionalUser.get();

        if (user.getVerificationTokenExpiry() == null ||
                user.getVerificationTokenExpiry()
                        .isBefore(LocalDateTime.now())) {

            return ResponseEntity.badRequest()
                    .body("Verification link has expired.");
        }

        user.setEmailVerified(true);

        user.setVerificationToken(null);

        user.setVerificationTokenExpiry(null);

        userRepository.save(user);

        return ResponseEntity.ok(
                "Email verified successfully. You can now login."
        );
    }


    // ============================================================
    // REGISTRATION REQUEST CLASS
    // ============================================================

    public static class StudentRegistrationRequest {

        private String name;
        private String email;
        private String username;
        private String password;
        private String branch;


        public StudentRegistrationRequest() {
        }


        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }


        public String getEmail() {
            return email;
        }

        public void setEmail(String email) {
            this.email = email;
        }


        public String getUsername() {
            return username;
        }

        public void setUsername(String username) {
            this.username = username;
        }


        public String getPassword() {
            return password;
        }

        public void setPassword(String password) {
            this.password = password;
        }


        public String getBranch() {
            return branch;
        }

        public void setBranch(String branch) {
            this.branch = branch;
        }
    }
}