package com.campusplacement.campus_placement_portal.repository;

import com.campusplacement.campus_placement_portal.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    // Find user during login using username
    Optional<User> findByUsername(String username);

    // Find user using email
    Optional<User> findByEmail(String email);

    // Check whether username already exists during registration
    boolean existsByUsername(String username);

    // Check whether email already exists during registration
    boolean existsByEmail(String email);

    // Used for email verification
    Optional<User> findByVerificationToken(String verificationToken);

    // Used for password reset
    Optional<User> findByResetToken(String resetToken);
}