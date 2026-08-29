package com.campusplacement.campus_placement_portal.controller;

import com.campusplacement.campus_placement_portal.model.Job;
import com.campusplacement.campus_placement_portal.repository.JobRepository;
import com.campusplacement.campus_placement_portal.repository.ApplicationRepository;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import java.util.List;
import com.campusplacement.campus_placement_portal.exception.ResourceNotFoundException;

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

    // Get all jobs
    @GetMapping
    public List<Job> getAllJobs() {
        return jobRepository.findAll();
    }

    // Add a job
    @PostMapping
    public Job addJob(@Valid @RequestBody Job job) {
        return jobRepository.save(job);
    }

    // Get job by ID
    @GetMapping("/{id}")
    public Job getJobById(@PathVariable Long id) {

        return jobRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Job not found with id: " + id));
    }

    // Update job
    @PutMapping("/{id}")
    public Job updateJob(
            @PathVariable Long id,
            @Valid @RequestBody Job updatedJob) {

        return jobRepository.findById(id)
                .map(job -> {

                    job.setTitle(updatedJob.getTitle());
                    job.setDescription(updatedJob.getDescription());
                    job.setLocation(updatedJob.getLocation());
                    job.setCompany(updatedJob.getCompany());

                    return jobRepository.save(job);
                })
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Job not found with id: " + id));
    }

    // Delete job
    @DeleteMapping("/{id}")
    public String deleteJob(@PathVariable Long id) {

        Job job = jobRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Job not found with id: " + id));

        // Delete applications connected to this job first
        List<com.campusplacement.campus_placement_portal.model.Application> applications =
                applicationRepository.findByJobId(id);

        applicationRepository.deleteAll(applications);

        // Now delete the job
        jobRepository.delete(job);

        return "Job deleted successfully";
    }

    // Get jobs by company ID
    @GetMapping("/company/{companyId}")
    public List<Job> getJobsByCompanyId(
            @PathVariable Long companyId) {

        return jobRepository.findByCompanyId(companyId);
    }
}