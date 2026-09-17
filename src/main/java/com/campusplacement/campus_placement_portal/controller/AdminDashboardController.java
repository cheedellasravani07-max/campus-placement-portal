package com.campusplacement.campus_placement_portal.controller;

import com.campusplacement.campus_placement_portal.model.ApplicationStatus;
import com.campusplacement.campus_placement_portal.repository.ApplicationRepository;
import com.campusplacement.campus_placement_portal.repository.CompanyRepository;
import com.campusplacement.campus_placement_portal.repository.JobRepository;
import com.campusplacement.campus_placement_portal.repository.StudentRepository;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/admin/dashboard")
@PreAuthorize("hasRole('ADMIN')")
public class AdminDashboardController {

    private final StudentRepository studentRepository;
    private final JobRepository jobRepository;
    private final ApplicationRepository applicationRepository;
    private final CompanyRepository companyRepository;

    public AdminDashboardController(
            StudentRepository studentRepository,
            JobRepository jobRepository,
            ApplicationRepository applicationRepository,
            CompanyRepository companyRepository) {

        this.studentRepository = studentRepository;
        this.jobRepository = jobRepository;
        this.applicationRepository = applicationRepository;
        this.companyRepository = companyRepository;
    }

    // ================= DASHBOARD STATISTICS =================

    @GetMapping("/stats")
    public Map<String, Long> getDashboardStats() {

        Map<String, Long> stats = new HashMap<>();

        // Total Students
        stats.put(
                "students",
                studentRepository.count()
        );

        // Total Companies
        stats.put(
                "companies",
                companyRepository.count()
        );

        // Total Jobs
        stats.put(
                "jobs",
                jobRepository.count()
        );

        // Total Applications
        stats.put(
                "applications",
                applicationRepository.count()
        );

        // Shortlisted Applications
        stats.put(
                "shortlisted",
                applicationRepository
                        .countByStatus(ApplicationStatus.SHORTLISTED)
        );

        // Interview Applications
        stats.put(
                "interviews",
                applicationRepository
                        .countByStatus(ApplicationStatus.INTERVIEW)
        );

        // Accepted Applications
        stats.put(
                "accepted",
                applicationRepository
                        .countByStatus(ApplicationStatus.ACCEPTED)
        );

        // Rejected Applications
        stats.put(
                "rejected",
                applicationRepository
                        .countByStatus(ApplicationStatus.REJECTED)
        );

        return stats;
    }
}