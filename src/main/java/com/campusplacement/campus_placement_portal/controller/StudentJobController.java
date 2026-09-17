package com.campusplacement.campus_placement_portal.controller;

import com.campusplacement.campus_placement_portal.model.Job;
import com.campusplacement.campus_placement_portal.repository.JobRepository;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/student/jobs")
@PreAuthorize("hasRole('STUDENT')")
public class StudentJobController {

    private final JobRepository jobRepository;

    public StudentJobController(JobRepository jobRepository) {
        this.jobRepository = jobRepository;
    }

    // ================= VIEW AVAILABLE JOBS =================

    @GetMapping
    public List<Job> getAvailableJobs() {
        return jobRepository.findAll();
    }
}
