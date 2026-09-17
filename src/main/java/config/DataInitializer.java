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

            // Student ID 2 login account
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
        };
    }
}