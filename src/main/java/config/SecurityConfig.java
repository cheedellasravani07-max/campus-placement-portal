package com.campusplacement.campus_placement_portal.config;

import com.campusplacement.campus_placement_portal.service.UserService;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;

import org.springframework.security.core.Authentication;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;

import java.io.IOException;

@Configuration
@EnableMethodSecurity
public class SecurityConfig {

    private final UserService userService;

    public SecurityConfig(UserService userService) {
        this.userService = userService;
    }


    // ================= PASSWORD ENCODER =================

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }


    // ================= LOGIN SUCCESS HANDLER =================

    @Bean
    public AuthenticationSuccessHandler authenticationSuccessHandler() {

        return new AuthenticationSuccessHandler() {

            @Override
            public void onAuthenticationSuccess(
                    HttpServletRequest request,
                    HttpServletResponse response,
                    Authentication authentication)
                    throws IOException, ServletException {

                if (authentication.getAuthorities().stream()
                        .anyMatch(authority ->
                                authority.getAuthority()
                                        .equals("ROLE_ADMIN"))) {

                    response.sendRedirect(
                            "/admin-dashboard.html"
                    );

                } else if (authentication.getAuthorities().stream()
                        .anyMatch(authority ->
                                authority.getAuthority()
                                        .equals("ROLE_STUDENT"))) {

                    response.sendRedirect(
                            "/student-dashboard.html"
                    );

                } else {

                    response.sendRedirect(
                            "/login.html?error=true"
                    );
                }
            }
        };
    }


    // ================= SECURITY CONFIGURATION =================

    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http,
            AuthenticationSuccessHandler authenticationSuccessHandler)
            throws Exception {

        http

                // ================= CSRF =================

                .csrf(csrf -> csrf.disable())


                // ================= AUTHORIZATION =================

                .authorizeHttpRequests(auth -> auth


                        // -------- PUBLIC LOGIN FILES --------

                        .requestMatchers(
                                "/login.html",
                                "/login.css",
                                "/login.js",
                                "/signup",
                                "/auth/verify-email"
                        ).permitAll()


                        // -------- PUBLIC STUDENT REGISTRATION --------

                        .requestMatchers(
                                "/student-signup.html",
                                "/student-signup.css",
                                "/student-signup.js",
                                "/auth/student/register"
                        ).permitAll()


                        // -------- FORGOT PASSWORD --------

                        .requestMatchers(
                                "/forgot-password.html",
                                "/forgot-password.css",
                                "/forgot-password.js",
                                "/forgot-password/**",

                                "/reset-password.html",
                                "/reset-password.css",
                                "/reset-password.js",

                                "/forgot-password/reset",
                                "/verify-email"
                        ).permitAll()


                        // -------- CHANGE PASSWORD --------

                        .requestMatchers(
                                "/change-password.html",
                                "/change-password.css",
                                "/change-password.js"
                        ).hasAnyRole("ADMIN", "STUDENT")


                        // -------- ADMIN PAGES --------

                        .requestMatchers(
                                "/admin-dashboard.html",
                                "/admin-dashboard.css",
                                "/admin-dashboard.js",

                                "/admin-applications.html",
                                "/admin-applications.css",
                                "/admin-applications.js",

                                "/schedule-interview.html",
                                "/schedule-interview.css",
                                "/schedule-interview.js",

                                "/admin-portal.html",
                                "/admin-portal.css",
                                "/admin-portal.js"
                        ).hasRole("ADMIN")


                        // -------- STUDENT PAGES --------

                        .requestMatchers(
                                "/student-dashboard.html",
                                "/student-dashboard.css",
                                "/student-dashboard.js",

                                "/student-jobs.html",
                                "/student-jobs.css",
                                "/student-jobs.js",

                                "/student-applications.html",
                                "/student-applications.css",
                                "/student-applications.js",

                                "/student-profile.html",
                                "/student-profile.css",
                                "/student-profile.js",

                                "/student-interview.html",
                                "/student-interview.css",
                                "/student-interview.js"
                        ).hasRole("STUDENT")


                        // -------- ADMIN APIs --------

                        .requestMatchers("/admin/**")
                        .hasRole("ADMIN")


                        // -------- STUDENT APIs --------

                        .requestMatchers("/student/**")
                        .hasRole("STUDENT")


                        // -------- EVERYTHING ELSE --------

                        .anyRequest()
                        .authenticated()
                )


                // ================= USER SERVICE =================

                .userDetailsService(userService)


                // ================= LOGIN =================

                .formLogin(form -> form

                        .loginPage("/login.html")

                        .loginProcessingUrl("/login")

                        .successHandler(
                                authenticationSuccessHandler
                        )

                        .failureUrl(
                                "/login.html?error=true"
                        )

                        .permitAll()
                )


                // ================= LOGOUT =================

                .logout(logout -> logout

                        .logoutUrl("/logout")

                        .logoutSuccessUrl(
                                "/login.html?logout=true"
                        )

                        .permitAll()
                );


        return http.build();
    }
}