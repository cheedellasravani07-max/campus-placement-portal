package com.campusplacement.campus_placement_portal.config;

import com.campusplacement.campus_placement_portal.model.User;
import com.campusplacement.campus_placement_portal.repository.UserRepository;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner initializeUsers(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder) {

        return args -> {

            // ================= ADMIN =================

            if (userRepository.findByUsername("admin").isEmpty()) {

                User admin = new User();

                admin.setUsername("admin");
                admin.setEmail("admin@gmail.com");
                admin.setPassword(
                        passwordEncoder.encode("admin123")
                );
                admin.setRole("ADMIN");

                userRepository.save(admin);
            }


            // ================= STUDENT 1 =================

            if (userRepository.findByUsername("student").isEmpty()) {

                User student = new User();

                student.setUsername("student");
                student.setEmail("student@gmail.com");
                student.setPassword(
                        passwordEncoder.encode("student123")
                );
                student.setRole("STUDENT");

                userRepository.save(student);
            }


            // ================= STUDENT 2 =================

            if (userRepository.findByUsername("student2").isEmpty()) {

                User student2 = new User();

                student2.setUsername("student2");
                student2.setEmail("student2@gmail.com");
                student2.setPassword(
                        passwordEncoder.encode("student2123")
                );
                student2.setRole("STUDENT");

                userRepository.save(student2);
            }
            // Bhanu login account
            if (userRepository.findByUsername("bhanu").isEmpty()) {

                User bhanu = new User();

                bhanu.setUsername("bhanu");
                bhanu.setEmail("bhanu@gmail.com");
                bhanu.setPassword(
                        passwordEncoder.encode("bhanu123")
                );
                bhanu.setRole("STUDENT");
                bhanu.setEmailVerified(true);

                userRepository.save(bhanu);
            }


// Anjali login account
            if (userRepository.findByUsername("anjali").isEmpty()) {

                User anjali = new User();

                anjali.setUsername("anjali");
                anjali.setEmail("anjali@gmail.com");
                anjali.setPassword(
                        passwordEncoder.encode("anjali123")
                );
                anjali.setRole("STUDENT");
                anjali.setEmailVerified(true);

                userRepository.save(anjali);
            }








        };
    }
}