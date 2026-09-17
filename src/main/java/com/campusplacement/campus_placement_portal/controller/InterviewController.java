package com.campusplacement.campus_placement_portal.controller;

import com.campusplacement.campus_placement_portal.exception.ResourceNotFoundException;
import com.campusplacement.campus_placement_portal.model.Application;
import com.campusplacement.campus_placement_portal.model.Interview;
import com.campusplacement.campus_placement_portal.model.Student;
import com.campusplacement.campus_placement_portal.model.User;
import com.campusplacement.campus_placement_portal.repository.ApplicationRepository;
import com.campusplacement.campus_placement_portal.repository.InterviewRepository;
import com.campusplacement.campus_placement_portal.repository.StudentRepository;
import com.campusplacement.campus_placement_portal.repository.UserRepository;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/interviews")
public class InterviewController {

    private final InterviewRepository interviewRepository;
    private final ApplicationRepository applicationRepository;
    private final UserRepository userRepository;
    private final StudentRepository studentRepository;

    public InterviewController(
            InterviewRepository interviewRepository,
            ApplicationRepository applicationRepository,
            UserRepository userRepository,
            StudentRepository studentRepository) {

        this.interviewRepository = interviewRepository;
        this.applicationRepository = applicationRepository;
        this.userRepository = userRepository;
        this.studentRepository = studentRepository;
    }


    // ================= SCHEDULE INTERVIEW =================

    @PostMapping("/application/{applicationId}")
    @PreAuthorize("hasRole('ADMIN')")
    public Interview scheduleInterview(
            @PathVariable Long applicationId,
            @RequestBody Interview interview) {

        Application application =
                applicationRepository.findById(applicationId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Application not found with id: "
                                                + applicationId));

        if (interviewRepository
                .findByApplicationId(applicationId)
                .isPresent()) {

            throw new org.springframework.web.server.ResponseStatusException(
                    org.springframework.http.HttpStatus.CONFLICT,
                    "Interview already scheduled for this application"
            );
        }

        interview.setApplication(application);

        return interviewRepository.save(interview);
    }


    // ================= GET INTERVIEW BY APPLICATION =================

    @GetMapping("/application/{applicationId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'STUDENT')")
    public Interview getInterviewByApplication(
            @PathVariable Long applicationId) {

        return interviewRepository
                .findByApplicationId(applicationId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Interview not scheduled for this application"));
    }
    // ================= GET ALL INTERVIEWS =================

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public List<Interview> getAllInterviews() {

        return interviewRepository.findAll();
    }
// ================= GET INTERVIEW BY ID =================

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public Interview getInterviewById(
            @PathVariable Long id) {

        return interviewRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Interview not found with id: " + id));
    }


    // ================= GET STUDENT INTERVIEWS =================

    @GetMapping("/student")
    @PreAuthorize("hasRole('STUDENT')")
    public List<Interview> getStudentInterviews(
            Authentication authentication) {

        User user =
                userRepository
                        .findByUsername(authentication.getName())
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Student account not found"));

        Student student =
                studentRepository
                        .findByEmail(user.getEmail())
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Student profile not found"));

        return interviewRepository
                .findByApplicationStudentId(student.getId());
    }


    // ================= UPDATE INTERVIEW =================

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public Interview updateInterview(
            @PathVariable Long id,
            @RequestBody Interview updatedInterview) {

        Interview interview =
                interviewRepository.findById(id)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Interview not found with id: " + id));

        interview.setInterviewDate(
                updatedInterview.getInterviewDate());

        interview.setInterviewTime(
                updatedInterview.getInterviewTime());

        interview.setMode(
                updatedInterview.getMode());

        interview.setLocation(
                updatedInterview.getLocation());

        interview.setMeetingLink(
                updatedInterview.getMeetingLink());

        return interviewRepository.save(interview);
    }


    // ================= DELETE INTERVIEW =================

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public String deleteInterview(
            @PathVariable Long id) {

        Interview interview =
                interviewRepository.findById(id)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Interview not found with id: " + id));

        interviewRepository.delete(interview);

        return "Interview deleted successfully";
    }
}