package com.campusplacement.campus_placement_portal.controller;

import com.campusplacement.campus_placement_portal.exception.ResourceNotFoundException;
import com.campusplacement.campus_placement_portal.model.Interview;
import com.campusplacement.campus_placement_portal.model.Student;
import com.campusplacement.campus_placement_portal.model.User;
import com.campusplacement.campus_placement_portal.repository.InterviewRepository;
import com.campusplacement.campus_placement_portal.repository.StudentRepository;
import com.campusplacement.campus_placement_portal.repository.UserRepository;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/student/interviews")
@PreAuthorize("hasRole('STUDENT')")
public class StudentInterviewController {

    private final InterviewRepository interviewRepository;
    private final StudentRepository studentRepository;
    private final UserRepository userRepository;

    public StudentInterviewController(
            InterviewRepository interviewRepository,
            StudentRepository studentRepository,
            UserRepository userRepository) {

        this.interviewRepository = interviewRepository;
        this.studentRepository = studentRepository;
        this.userRepository = userRepository;
    }


    // ==================================================
    // GET MY INTERVIEWS
    // ==================================================

    @GetMapping
    public List<Interview> getMyInterviews(
            Authentication authentication) {

        // Get currently logged-in user

        User user = userRepository
                .findByUsername(authentication.getName())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "User account not found"));


        // Find student using user's email

        Student student = studentRepository
                .findByEmail(user.getEmail())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Student profile not found"));


        // Return all interviews belonging
        // to this student

        return interviewRepository
                .findByApplicationStudentId(
                        student.getId()
                );
    }
}