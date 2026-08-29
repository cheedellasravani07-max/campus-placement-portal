package com.campusplacement.campus_placement_portal.controller;

import com.campusplacement.campus_placement_portal.model.Student;
import com.campusplacement.campus_placement_portal.repository.StudentRepository;
import com.campusplacement.campus_placement_portal.exception.ResourceNotFoundException;

import jakarta.validation.Valid;

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
    public List<Student> getAllStudents() {
        return studentRepository.findAll();
    }


    // ================= ADD STUDENT =================

    @PostMapping
    public Student addStudent(@Valid @RequestBody Student student) {
        return studentRepository.save(student);
    }


    // ================= GET STUDENT BY ID =================

    @GetMapping("/{id}")
    public Student getStudentById(@PathVariable Long id) {

        return studentRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Student not found with id: " + id));
    }


    // ================= UPDATE STUDENT =================

    @PutMapping("/{id}")
    public Student updateStudent(
            @PathVariable Long id,
            @Valid @RequestBody Student updatedStudent) {

        return studentRepository.findById(id)
                .map(student -> {

                    student.setName(updatedStudent.getName());
                    student.setEmail(updatedStudent.getEmail());
                    student.setBranch(updatedStudent.getBranch());

                    return studentRepository.save(student);
                })
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Student not found with id: " + id));
    }


    // ================= DELETE STUDENT =================

    @DeleteMapping("/{id}")
    public String deleteStudent(@PathVariable Long id) {

        Student student = studentRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Student not found with id: " + id));

        studentRepository.delete(student);

        return "Student deleted successfully";
    }
}