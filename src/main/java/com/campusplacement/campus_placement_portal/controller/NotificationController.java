package com.campusplacement.campus_placement_portal.controller;

import com.campusplacement.campus_placement_portal.model.Application;
import com.campusplacement.campus_placement_portal.model.User;
import com.campusplacement.campus_placement_portal.repository.ApplicationRepository;
import com.campusplacement.campus_placement_portal.repository.UserRepository;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/student/notifications")
@PreAuthorize("hasRole('STUDENT')")
public class NotificationController {

    private final ApplicationRepository applicationRepository;
    private final UserRepository userRepository;

    public NotificationController(
            ApplicationRepository applicationRepository,
            UserRepository userRepository) {

        this.applicationRepository = applicationRepository;
        this.userRepository = userRepository;
    }


    // ================= GET NOTIFICATIONS =================

    @GetMapping
    public List<Map<String, String>> getNotifications(
            org.springframework.security.core.Authentication authentication) {

        User user = userRepository
                .findByUsername(authentication.getName())
                .orElseThrow(() ->
                        new RuntimeException(
                                "User account not found"));

        String email = user.getEmail();

        List<Application> applications =
                applicationRepository.findAll();

        List<Map<String, String>> notifications =
                new ArrayList<>();


        for (Application application : applications) {

            if (application.getStudent() == null ||
                    !email.equals(
                            application.getStudent().getEmail())) {

                continue;
            }


            String status =
                    application.getStatus().name();

            String jobTitle =
                    application.getJob() != null
                            ? application.getJob().getTitle()
                            : "Job";


            String message;


            if (status.equals("INTERVIEW")) {

                message =
                        "Your application for "
                                + jobTitle
                                + " has been selected for an interview.";

            } else if (status.equals("ACCEPTED")) {

                message =
                        "Congratulations! Your application for "
                                + jobTitle
                                + " has been accepted.";

            } else if (status.equals("REJECTED")) {

                message =
                        "Your application for "
                                + jobTitle
                                + " has been rejected.";

            } else {

                message =
                        "Your application for "
                                + jobTitle
                                + " has been submitted successfully.";
            }


            Map<String, String> notification =
                    new HashMap<>();

            notification.put("jobTitle", jobTitle);
            notification.put("status", status);
            notification.put("message", message);

            notifications.add(notification);
        }


        return notifications;
    }
}