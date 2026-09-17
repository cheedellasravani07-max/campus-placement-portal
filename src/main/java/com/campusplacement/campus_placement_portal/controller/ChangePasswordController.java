package com.campusplacement.campus_placement_portal.controller;

import com.campusplacement.campus_placement_portal.model.ChangePasswordRequest;
import com.campusplacement.campus_placement_portal.model.User;
import com.campusplacement.campus_placement_portal.repository.UserRepository;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/account")
public class ChangePasswordController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public ChangePasswordController(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder) {

        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }


    // ================= CHANGE PASSWORD =================

    @PutMapping("/change-password")
    public ResponseEntity<String> changePassword(
            @RequestBody ChangePasswordRequest request,
            org.springframework.security.core.Authentication authentication) {

        User user = userRepository
                .findByUsername(authentication.getName())
                .orElse(null);

        if (user == null) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body("User account not found");
        }


        // Check current password

        if (!passwordEncoder.matches(
                request.getCurrentPassword(),
                user.getPassword())) {

            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body("Current password is incorrect");
        }


        // Check new password

        if (request.getNewPassword() == null ||
                request.getNewPassword().isBlank()) {

            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body("New password is required");
        }


        // Check password confirmation

        if (!request.getNewPassword()
                .equals(request.getConfirmPassword())) {

            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body("New passwords do not match");
        }


        // Prevent using the same password

        if (passwordEncoder.matches(
                request.getNewPassword(),
                user.getPassword())) {

            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body("New password must be different from current password");
        }


        // Save encrypted password

        user.setPassword(
                passwordEncoder.encode(
                        request.getNewPassword()));

        userRepository.save(user);

        return ResponseEntity.ok(
                "Password changed successfully");
    }
}