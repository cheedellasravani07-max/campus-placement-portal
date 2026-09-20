package com.campusplacement.campus_placement_portal.service;

import com.campusplacement.campus_placement_portal.model.Student;
import com.campusplacement.campus_placement_portal.model.User;
import com.campusplacement.campus_placement_portal.repository.StudentRepository;
import com.campusplacement.campus_placement_portal.repository.UserRepository;

import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Component
public class StudentAccountMigration implements CommandLineRunner {

    private final StudentRepository studentRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public StudentAccountMigration(
            StudentRepository studentRepository,
            UserRepository userRepository,
            PasswordEncoder passwordEncoder) {

        this.studentRepository = studentRepository;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {

        List<Student> students = studentRepository.findAll();
        List<User> existingUsers = userRepository.findAll();

        Set<String> existingUsernames = new HashSet<>();
        Set<String> existingEmails = new HashSet<>();

        for (User user : existingUsers) {

            if (user.getUsername() != null) {
                existingUsernames.add(
                        user.getUsername().toLowerCase().trim()
                );
            }

            if (user.getEmail() != null) {
                existingEmails.add(
                        user.getEmail().toLowerCase().trim()
                );
            }
        }

        int created = 0;
        int skipped = 0;

        for (Student student : students) {

            if (student.getEmail() == null
                    || student.getEmail().isBlank()) {

                System.out.println(
                        "Skipping student without email: "
                                + student.getName());

                skipped++;
                continue;
            }

            String email =
                    student.getEmail().trim();

            String emailKey =
                    email.toLowerCase();

            // -----------------------------------------
            // If account already exists, skip it
            // -----------------------------------------

            if (existingEmails.contains(emailKey)) {

                System.out.println(
                        "Account already exists for: "
                                + email);

                skipped++;
                continue;
            }

            // -----------------------------------------
            // Create username from email
            // -----------------------------------------

            String username;

            if (email.contains("@")) {

                username =
                        email.substring(
                                0,
                                email.indexOf("@")
                        );

            } else {

                username =
                        student.getName()
                                .trim()
                                .toLowerCase()
                                .replaceAll("\\s+", "");
            }

            username = username.trim();

            // -----------------------------------------
            // Make username unique
            // -----------------------------------------

            String originalUsername = username;
            int counter = 1;

            while (existingUsernames.contains(
                    username.toLowerCase())) {

                username =
                        originalUsername
                                + counter;

                counter++;
            }

            // -----------------------------------------
            // Create user
            // -----------------------------------------

            User user = new User();

            user.setUsername(username);
            user.setEmail(email);

            // Temporary password
            user.setPassword(
                    passwordEncoder.encode(
                            "Student@123"
                    )
            );

            user.setRole("STUDENT");

            // Important because UserService disables
            // unverified accounts
            user.setEmailVerified(true);

            userRepository.save(user);

            existingUsernames.add(
                    username.toLowerCase()
            );

            existingEmails.add(emailKey);

            created++;

            System.out.println(
                    "Created student account: "
                            + username
                            + " -> "
                            + email
            );
        }

        System.out.println("------------------------------------");
        System.out.println(
                "Student account migration completed."
        );
        System.out.println(
                "Accounts created: " + created
        );
        System.out.println(
                "Accounts skipped: " + skipped
        );
        System.out.println("------------------------------------");
    }
}