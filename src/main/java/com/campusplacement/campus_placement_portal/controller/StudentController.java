package com.campusplacement.campus_placement_portal.controller;

import com.campusplacement.campus_placement_portal.model.Student;
import com.campusplacement.campus_placement_portal.repository.StudentRepository;
import com.campusplacement.campus_placement_portal.exception.ResourceNotFoundException;

import jakarta.validation.Valid;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/students")
public class StudentController {

    private final StudentRepository studentRepository;

    public StudentController(StudentRepository studentRepository) {
        this.studentRepository = studentRepository;
    }


    // ================= GET ALL STUDENTS =================

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public List<Student> getAllStudents() {

        return studentRepository.findAll();
    }


    // ================= ADD STUDENT =================

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public Student addStudent(
            @Valid @RequestBody Student student) {

        return studentRepository.save(student);
    }


    // ================= GET STUDENT BY ID =================

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public Student getStudentById(
            @PathVariable Long id) {

        return studentRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Student not found with id: " + id));
    }


    // ================= UPDATE STUDENT =================

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public Student updateStudent(
            @PathVariable Long id,
            @Valid @RequestBody Student updatedStudent) {

        Student student = studentRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Student not found with id: " + id));


        // ================= BASIC DETAILS =================

        student.setName(updatedStudent.getName());

        student.setEmail(updatedStudent.getEmail());

        student.setBranch(updatedStudent.getBranch());


        // ================= ADDITIONAL DETAILS =================

        student.setPhone(updatedStudent.getPhone());

        student.setRollNumber(updatedStudent.getRollNumber());

        student.setCgpa(updatedStudent.getCgpa());

        student.setGraduationYear(
                updatedStudent.getGraduationYear());

        student.setSkills(updatedStudent.getSkills());

        student.setProfilePhoto(
                updatedStudent.getProfilePhoto());


        return studentRepository.save(student);
    }


    // ================= DELETE STUDENT =================

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public String deleteStudent(
            @PathVariable Long id) {

        Student student = studentRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Student not found with id: " + id));

        studentRepository.delete(student);

        return "Student deleted successfully";
    }
}