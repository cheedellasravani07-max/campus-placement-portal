package com.campusplacement.campus_placement_portal.controller;

import com.campusplacement.campus_placement_portal.exception.ResourceNotFoundException;
import com.campusplacement.campus_placement_portal.model.Application;
import com.campusplacement.campus_placement_portal.model.ApplicationStatus;
import com.campusplacement.campus_placement_portal.model.Job;
import com.campusplacement.campus_placement_portal.model.Student;
import com.campusplacement.campus_placement_portal.model.User;
import com.campusplacement.campus_placement_portal.repository.ApplicationRepository;
import com.campusplacement.campus_placement_portal.repository.JobRepository;
import com.campusplacement.campus_placement_portal.repository.StudentRepository;
import com.campusplacement.campus_placement_portal.repository.UserRepository;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.util.List;
@RestController
@RequestMapping("/applications")
public class ApplicationController {

    private final ApplicationRepository applicationRepository;
    private final StudentRepository studentRepository;
    private final JobRepository jobRepository;
    private final UserRepository userRepository;

    public ApplicationController(
            ApplicationRepository applicationRepository,
            StudentRepository studentRepository,
            JobRepository jobRepository,
            UserRepository userRepository) {

        this.applicationRepository = applicationRepository;
        this.studentRepository = studentRepository;
        this.jobRepository = jobRepository;
        this.userRepository = userRepository;
    }


    // ======================================================
    // GET ALL APPLICATIONS - ADMIN
    // ======================================================

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public List<Application> getAllApplications() {

        return applicationRepository.findAll();
    }


    // ======================================================
    // GET APPLICATION BY ID - ADMIN
    // ======================================================

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public Application getApplicationById(
            @PathVariable Long id) {

        return applicationRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Application not found with id: "
                                        + id));
    }


    // ======================================================
    // ADD APPLICATION - ADMIN
    // ======================================================

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public Application addApplication(
            @RequestBody ApplicationRequest request) {

        Student student =
                studentRepository.findById(request.getStudentId())
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Student not found with id: "
                                                + request.getStudentId()));

        Job job =
                jobRepository.findById(request.getJobId())
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Job not found with id: "
                                                + request.getJobId()));

        Application application =
                new Application();

        application.setStudent(student);
        application.setJob(job);

        application.setStatus(
                ApplicationStatus.valueOf(
                        request.getStatus().toUpperCase()
                )
        );

        return applicationRepository.save(application);
    }


    // ======================================================
    // UPDATE APPLICATION - ADMIN
    // ======================================================

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public Application updateApplication(
            @PathVariable Long id,
            @RequestBody ApplicationRequest request) {

        Application application =
                applicationRepository.findById(id)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Application not found with id: "
                                                + id));

        Student student =
                studentRepository.findById(request.getStudentId())
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Student not found with id: "
                                                + request.getStudentId()));

        Job job =
                jobRepository.findById(request.getJobId())
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Job not found with id: "
                                                + request.getJobId()));

        application.setStudent(student);
        application.setJob(job);

        application.setStatus(
                ApplicationStatus.valueOf(
                        request.getStatus().toUpperCase()
                )
        );

        return applicationRepository.save(application);
    }


    // ======================================================
    // UPDATE APPLICATION STATUS - ADMIN
    // ======================================================

    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public Application updateApplicationStatus(
            @PathVariable Long id,
            @RequestParam String status) {

        Application application =
                applicationRepository.findById(id)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Application not found with id: "
                                                + id));

        ApplicationStatus newStatus;

        try {

            newStatus =
                    ApplicationStatus.valueOf(
                            status.toUpperCase()
                    );

        } catch (IllegalArgumentException e) {

            throw new IllegalArgumentException(
                    "Invalid application status: " + status
            );
        }

        application.setStatus(newStatus);

        return applicationRepository.save(application);
    }


    // ======================================================
    // DELETE APPLICATION - ADMIN
    // ======================================================

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public String deleteApplication(
            @PathVariable Long id) {

        Application application =
                applicationRepository.findById(id)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Application not found with id: "
                                                + id));

        applicationRepository.delete(application);

        return "Application deleted successfully";
    }


    // ======================================================
    // STUDENT - VIEW MY APPLICATIONS
    // ======================================================

    @GetMapping("/my")
    @PreAuthorize("hasRole('STUDENT')")
    public List<Application> getMyApplications(
            Authentication authentication) {

        User user =
                userRepository
                        .findByUsername(authentication.getName())
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "User account not found"));

        Student student =
                studentRepository
                        .findByEmail(user.getEmail())
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Student profile not found"));

        return applicationRepository
                .findByStudentId(student.getId());
    }

// ======================================================
// STUDENT - APPLY FOR JOB
// ======================================================

    @PostMapping("/student/apply/{jobId}")
    @PreAuthorize("hasRole('STUDENT')")
    public Application applyForJob(
            @PathVariable Long jobId,
            Authentication authentication) {

        // Find logged-in user
        User user =
                userRepository
                        .findByUsername(authentication.getName())
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "User account not found"));

        // Find student profile
        Student student =
                studentRepository
                        .findByEmail(user.getEmail())
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Student profile not found"));

        // Find job
        Job job =
                jobRepository
                        .findById(jobId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Job not found with id: " + jobId));

        // ==================================================
        // CHECK APPLICATION DEADLINE
        // ==================================================

        if (job.getApplicationDeadline() != null &&
                job.getApplicationDeadline()
                        .isBefore(LocalDate.now())) {

            throw new RuntimeException(
                    "Application deadline has passed");
        }

        // ==================================================
        // CREATE APPLICATION
        // ==================================================

        Application application =
                new Application();

        application.setStudent(student);
        application.setJob(job);

        // Initial application status
        application.setStatus(
                ApplicationStatus.APPLIED
        );

        return applicationRepository.save(application);
    }
    // ======================================================
    // REQUEST DTO
    // ======================================================

    public static class ApplicationRequest {

        private String status;

        private Long studentId;

        private Long jobId;


        public ApplicationRequest() {
        }


        public String getStatus() {
            return status;
        }

        public Long getStudentId() {
            return studentId;
        }

        public Long getJobId() {
            return jobId;
        }


        public void setStatus(String status) {
            this.status = status;
        }

        public void setStudentId(Long studentId) {
            this.studentId = studentId;
        }

        public void setJobId(Long jobId) {
            this.jobId = jobId;
        }
    }
}