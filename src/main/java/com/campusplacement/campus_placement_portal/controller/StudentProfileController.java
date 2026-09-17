package com.campusplacement.campus_placement_portal.controller;

import com.campusplacement.campus_placement_portal.exception.ResourceNotFoundException;
import com.campusplacement.campus_placement_portal.model.Student;
import com.campusplacement.campus_placement_portal.model.User;
import com.campusplacement.campus_placement_portal.repository.StudentRepository;
import com.campusplacement.campus_placement_portal.repository.UserRepository;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/student/profile")
@PreAuthorize("hasRole('STUDENT')")
public class StudentProfileController {

    private final StudentRepository studentRepository;
    private final UserRepository userRepository;

    public StudentProfileController(
            StudentRepository studentRepository,
            UserRepository userRepository) {

        this.studentRepository = studentRepository;
        this.userRepository = userRepository;
    }


    // ================= GET MY PROFILE =================

    @GetMapping
    public Student getMyProfile(
            Authentication authentication) {

        User user = userRepository
                .findByUsername(authentication.getName())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "User account not found"));

        return studentRepository
                .findByEmail(user.getEmail())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Student profile not found"));
    }


    // ================= UPDATE MY PROFILE =================

    @PutMapping
    public Student updateMyProfile(
            @RequestBody Student updatedStudent,
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
                                "Student profile not found"));


        // ================= NAME =================

        if (updatedStudent.getName() != null
                && !updatedStudent.getName().isBlank()) {

            student.setName(
                    updatedStudent.getName().trim());
        }


        // ================= BRANCH =================

        if (updatedStudent.getBranch() != null
                && !updatedStudent.getBranch().isBlank()) {

            student.setBranch(
                    updatedStudent.getBranch().trim());
        }


        // ================= EMAIL =================

        if (updatedStudent.getEmail() != null
                && !updatedStudent.getEmail().isBlank()) {

            String newEmail =
                    updatedStudent.getEmail().trim();

            student.setEmail(newEmail);

            user.setEmail(newEmail);

            userRepository.save(user);
        }


        // ================= PHONE =================

        if (updatedStudent.getPhone() != null
                && !updatedStudent.getPhone().isBlank()) {

            student.setPhone(
                    updatedStudent.getPhone().trim());
        }


        // ================= ROLL NUMBER =================

        if (updatedStudent.getRollNumber() != null
                && !updatedStudent.getRollNumber().isBlank()) {

            student.setRollNumber(
                    updatedStudent.getRollNumber().trim());
        }


        // ================= CGPA =================

        if (updatedStudent.getCgpa() != null) {

            student.setCgpa(
                    updatedStudent.getCgpa());
        }


        // ================= GRADUATION YEAR =================

        if (updatedStudent.getGraduationYear() != null) {

            student.setGraduationYear(
                    updatedStudent.getGraduationYear());
        }


        // ================= SKILLS =================

        if (updatedStudent.getSkills() != null
                && !updatedStudent.getSkills().isBlank()) {

            student.setSkills(
                    updatedStudent.getSkills().trim());
        }


        return studentRepository.save(student);
    }
}