package com.campusplacement.campus_placement_portal.controller;

import com.campusplacement.campus_placement_portal.exception.ResourceNotFoundException;
import com.campusplacement.campus_placement_portal.model.Application;
import com.campusplacement.campus_placement_portal.model.Job;
import com.campusplacement.campus_placement_portal.model.Student;
import com.campusplacement.campus_placement_portal.repository.ApplicationRepository;
import com.campusplacement.campus_placement_portal.repository.JobRepository;
import com.campusplacement.campus_placement_portal.repository.StudentRepository;
import com.campusplacement.campus_placement_portal.model.ApplicationRequest;

import jakarta.validation.Valid;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/applications")
public class ApplicationController {

    private final ApplicationRepository applicationRepository;
    private final StudentRepository studentRepository;
    private final JobRepository jobRepository;


    public ApplicationController(
            ApplicationRepository applicationRepository,
            StudentRepository studentRepository,
            JobRepository jobRepository) {

        this.applicationRepository = applicationRepository;
        this.studentRepository = studentRepository;
        this.jobRepository = jobRepository;
    }


    // Get all applications
    @GetMapping
    public List<Application> getAllApplications() {
        return applicationRepository.findAll();
    }


    // Add a new application
    @PostMapping
    public Application addApplication(
            @RequestBody ApplicationRequest request) {

        if (request.getStatus() == null) {
            throw new RuntimeException("Status is required");
        }

        if (request.getStudentId() == null) {
            throw new RuntimeException("Student ID is required");
        }

        if (request.getJobId() == null) {
            throw new RuntimeException("Job ID is required");
        }

        Student student = studentRepository
                .findById(request.getStudentId())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Student not found with ID: "
                                        + request.getStudentId()));

        Job job = jobRepository
                .findById(request.getJobId())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Job not found with ID: "
                                        + request.getJobId()));

        Application application = new Application();

        application.setStatus(request.getStatus());
        application.setStudent(student);
        application.setJob(job);

        return applicationRepository.save(application);
    }

    // Get application by ID
    @GetMapping("/{id}")
    public Application getApplicationById(@PathVariable Long id) {

        return applicationRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Application not found with id: " + id));
    }


    // Update application
    @PutMapping("/{id}")
    public Application updateApplication(
            @PathVariable Long id,
            @RequestBody ApplicationRequest request) {

        Application application = applicationRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Application not found with id: " + id));

        if (request.getStatus() == null) {
            throw new RuntimeException("Status is required");
        }

        if (request.getStudentId() == null) {
            throw new RuntimeException("Student ID is required");
        }

        if (request.getJobId() == null) {
            throw new RuntimeException("Job ID is required");
        }

        Student student = studentRepository
                .findById(request.getStudentId())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Student not found with ID: "
                                        + request.getStudentId()));

        Job job = jobRepository
                .findById(request.getJobId())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Job not found with ID: "
                                        + request.getJobId()));

        application.setStatus(request.getStatus());
        application.setStudent(student);
        application.setJob(job);

        return applicationRepository.save(application);
    }


    // Delete application
    @DeleteMapping("/{id}")
    public String deleteApplication(@PathVariable Long id) {

        Application application = applicationRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Application not found with id: " + id));

        applicationRepository.delete(application);

        return "Application deleted successfully";
    }


    // Get applications by Student ID
    @GetMapping("/student/{studentId}")
    public List<Application> getApplicationsByStudentId(
            @PathVariable Long studentId) {

        return applicationRepository.findByStudentId(studentId);
    }


    // Get applications by Job ID
    @GetMapping("/job/{jobId}")
    public List<Application> getApplicationsByJobId(
            @PathVariable Long jobId) {

        return applicationRepository.findByJobId(jobId);
    }
}