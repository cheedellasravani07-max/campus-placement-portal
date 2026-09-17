package com.campusplacement.campus_placement_portal.controller;

import com.campusplacement.campus_placement_portal.exception.ResourceNotFoundException;
import com.campusplacement.campus_placement_portal.model.Application;
import com.campusplacement.campus_placement_portal.model.ApplicationRequest;
import com.campusplacement.campus_placement_portal.model.ApplicationStatus;
import com.campusplacement.campus_placement_portal.model.Job;
import com.campusplacement.campus_placement_portal.model.Student;
import com.campusplacement.campus_placement_portal.model.User;
import com.campusplacement.campus_placement_portal.repository.ApplicationRepository;
import com.campusplacement.campus_placement_portal.repository.JobRepository;
import com.campusplacement.campus_placement_portal.repository.StudentRepository;
import com.campusplacement.campus_placement_portal.repository.UserRepository;
import com.campusplacement.campus_placement_portal.service.EmailService;

import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/student/applications")
@PreAuthorize("hasRole('STUDENT')")
public class StudentApplicationController {

    private final ApplicationRepository applicationRepository;
    private final StudentRepository studentRepository;
    private final JobRepository jobRepository;
    private final UserRepository userRepository;
    private final EmailService emailService;


    public StudentApplicationController(
            ApplicationRepository applicationRepository,
            StudentRepository studentRepository,
            JobRepository jobRepository,
            UserRepository userRepository,
            EmailService emailService) {

        this.applicationRepository = applicationRepository;
        this.studentRepository = studentRepository;
        this.jobRepository = jobRepository;
        this.userRepository = userRepository;
        this.emailService = emailService;
    }


    // ================= GET MY APPLICATIONS =================

    @GetMapping
    public List<Application> getMyApplications(
            Authentication authentication) {

        User user = userRepository
                .findByUsername(authentication.getName())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "User account not found"));

        Student student = studentRepository
                .findByEmail(user.getEmail())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Student account not found"));

        return applicationRepository
                .findByStudentId(student.getId());
    }


    // ================= APPLY FOR JOB =================

    @PostMapping
    public Application applyForJob(
            @RequestBody ApplicationRequest request,
            Authentication authentication) {

        if (request.getJobId() == null) {

            throw new RuntimeException(
                    "Job ID is required");
        }


        // ================= FIND USER =================

        User user = userRepository
                .findByUsername(authentication.getName())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "User account not found"));


        // ================= FIND STUDENT =================

        Student student = studentRepository
                .findByEmail(user.getEmail())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Student account not found"));


        // ================= FIND JOB =================

        Job job = jobRepository
                .findById(request.getJobId())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Job not found with ID: "
                                        + request.getJobId()));


        // ================= ELIGIBILITY CHECK =================

        if (job.getEligibleBranch() == null ||
                student.getBranch() == null ||
                !job.getEligibleBranch()
                        .trim()
                        .equalsIgnoreCase(
                                student.getBranch().trim())) {

            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "You are not eligible for this job"
            );
        }


        // ================= DUPLICATE APPLICATION CHECK =================

        if (applicationRepository.existsByStudentIdAndJobId(
                student.getId(),
                job.getId())) {

            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "You have already applied for this job"
            );
        }


        // ================= CREATE APPLICATION =================

        Application application = new Application();

        application.setStatus(
                ApplicationStatus.APPLIED);

        application.setStudent(student);

        application.setJob(job);


        // ================= SAVE APPLICATION =================

        Application savedApplication =
                applicationRepository.save(application);


        // ================= SEND EMAIL =================

        String studentEmail =
                student.getEmail();

        String subject =
                "Job Application Submitted Successfully";

        String message =
                "Dear Student,\n\n" +

                        "Your application has been submitted successfully.\n\n" +

                        "Job Title: " +
                        job.getTitle() +
                        "\n" +

                        "Location: " +
                        job.getLocation() +
                        "\n\n" +

                        "Application Status: APPLIED\n\n" +

                        "Thank you for using the Campus Placement Portal.\n\n" +

                        "Regards,\n" +
                        "Campus Placement Portal";


        emailService.sendEmail(
                studentEmail,
                subject,
                message
        );


        return savedApplication;
    }
}