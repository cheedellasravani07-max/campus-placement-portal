package com.campusplacement.campus_placement_portal.controller;

import com.campusplacement.campus_placement_portal.exception.ResourceNotFoundException;
import com.campusplacement.campus_placement_portal.model.Application;
import com.campusplacement.campus_placement_portal.model.Job;
import com.campusplacement.campus_placement_portal.repository.ApplicationRepository;
import com.campusplacement.campus_placement_portal.repository.JobRepository;

import jakarta.validation.Valid;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/jobs")
public class JobController {

    private final JobRepository jobRepository;
    private final ApplicationRepository applicationRepository;

    public JobController(
            JobRepository jobRepository,
            ApplicationRepository applicationRepository) {

        this.jobRepository = jobRepository;
        this.applicationRepository = applicationRepository;
    }


    // ================= GET ALL JOBS =================

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public List<Job> getAllJobs() {

        return jobRepository.findAll();
    }


    // ================= ADD JOB =================

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public Job addJob(
            @Valid @RequestBody Job job) {

        return jobRepository.save(job);
    }


    // ================= GET JOB BY ID =================

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public Job getJobById(
            @PathVariable Long id) {

        return jobRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Job not found with id: " + id));
    }


    // ================= UPDATE JOB =================

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public Job updateJob(
            @PathVariable Long id,
            @Valid @RequestBody Job updatedJob) {

        Job job = jobRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Job not found with id: " + id));


        // -------- BASIC JOB DETAILS --------

        job.setTitle(
                updatedJob.getTitle());

        job.setDescription(
                updatedJob.getDescription());

        job.setLocation(
                updatedJob.getLocation());

        job.setEligibleBranch(
                updatedJob.getEligibleBranch());


        // -------- COMPANY --------

        job.setCompany(
                updatedJob.getCompany());


        // -------- MINIMUM CGPA --------

        job.setMinimumCgpa(
                updatedJob.getMinimumCgpa());


        // -------- APPLICATION DEADLINE --------

        job.setApplicationDeadline(
                updatedJob.getApplicationDeadline());


        return jobRepository.save(job);
    }


    // ================= DELETE JOB =================

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public String deleteJob(
            @PathVariable Long id) {

        Job job = jobRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Job not found with id: " + id));


        // -------- DELETE APPLICATIONS FIRST --------

        List<Application> applications =
                applicationRepository.findByJobId(id);

        applicationRepository.deleteAll(
                applications);


        // -------- DELETE JOB --------

        jobRepository.delete(job);


        return "Job deleted successfully";
    }


    // ================= GET JOBS BY COMPANY =================

    @GetMapping("/company/{companyId}")
    @PreAuthorize("hasRole('ADMIN')")
    public List<Job> getJobsByCompanyId(
            @PathVariable Long companyId) {

        return jobRepository
                .findByCompanyId(companyId);
    }
}