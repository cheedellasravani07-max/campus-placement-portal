
package com.campusplacement.campus_placement_portal.controller;

import com.campusplacement.campus_placement_portal.exception.ResourceNotFoundException;
import com.campusplacement.campus_placement_portal.model.Resume;
import com.campusplacement.campus_placement_portal.model.Student;
import com.campusplacement.campus_placement_portal.model.User;
import com.campusplacement.campus_placement_portal.repository.ResumeRepository;
import com.campusplacement.campus_placement_portal.repository.StudentRepository;
import com.campusplacement.campus_placement_portal.repository.UserRepository;

import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;

@RestController
@RequestMapping("/student/resume")
@PreAuthorize("hasRole('STUDENT')")
public class ResumeController {

    private final ResumeRepository resumeRepository;
    private final StudentRepository studentRepository;
    private final UserRepository userRepository;

    private final Path uploadDirectory =
            Paths.get("uploads/resumes");


    public ResumeController(
            ResumeRepository resumeRepository,
            StudentRepository studentRepository,
            UserRepository userRepository) {

        this.resumeRepository = resumeRepository;
        this.studentRepository = studentRepository;
        this.userRepository = userRepository;
    }


    // ================= UPLOAD RESUME =================

    @PostMapping
    public Resume uploadResume(
            @RequestParam("file") MultipartFile file,
            Authentication authentication)
            throws IOException {

        if (file == null || file.isEmpty()) {

            throw new IllegalArgumentException(
                    "Please select a resume file");
        }


        String fileName =
                file.getOriginalFilename();


        if (fileName == null ||
                fileName.isBlank()) {

            throw new IllegalArgumentException(
                    "Invalid file name");
        }


        String lowerCaseFileName =
                fileName.toLowerCase();


        if (!lowerCaseFileName.endsWith(".pdf") &&
                !lowerCaseFileName.endsWith(".doc") &&
                !lowerCaseFileName.endsWith(".docx")) {

            throw new IllegalArgumentException(
                    "Only PDF, DOC and DOCX files are allowed");
        }


        // ================= FIND USER =================

        User user =
                userRepository
                        .findByUsername(authentication.getName())
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "User account not found"));


        // ================= FIND STUDENT =================

        Student student =
                studentRepository
                        .findByEmail(user.getEmail())
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Student profile not found"));


        // ================= CREATE DIRECTORY =================

        Files.createDirectories(uploadDirectory);


        // ================= DELETE OLD RESUME =================

        Resume existingResume =
                resumeRepository
                        .findByStudentId(student.getId())
                        .orElse(null);


        if (existingResume != null &&
                existingResume.getFilePath() != null) {

            Path oldFile =
                    Paths.get(
                            existingResume.getFilePath());

            Files.deleteIfExists(oldFile);
        }


        // ================= SAVE FILE =================

        String safeFileName =
                System.currentTimeMillis()
                        + "_"
                        + fileName.replaceAll(
                        "[^a-zA-Z0-9._-]",
                        "_");


        Path filePath =
                uploadDirectory.resolve(
                        safeFileName);


        Files.copy(
                file.getInputStream(),
                filePath,
                StandardCopyOption.REPLACE_EXISTING);


        // ================= SAVE DATABASE =================

        Resume resume;

        if (existingResume != null) {

            resume = existingResume;

        } else {

            resume = new Resume();
        }


        resume.setStudent(student);

        resume.setFileName(fileName);

        resume.setFileType(
                file.getContentType());

        resume.setFilePath(
                filePath.toString());


        return resumeRepository.save(resume);
    }


    // ================= GET MY RESUME =================

    @GetMapping
    public Resume getMyResume(
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


        return resumeRepository
                .findByStudentId(student.getId())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Resume not uploaded yet"));
    }


    // ================= DOWNLOAD RESUME =================

    @GetMapping("/download")
    public ResponseEntity<byte[]> downloadResume(
            Authentication authentication)
            throws IOException {

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


        Resume resume =
                resumeRepository
                        .findByStudentId(student.getId())
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Resume not uploaded yet"));


        Path filePath =
                Paths.get(resume.getFilePath());


        if (!Files.exists(filePath)) {

            throw new ResourceNotFoundException(
                    "Resume file not found");
        }


        byte[] fileBytes =
                Files.readAllBytes(filePath);


        MediaType mediaType =
                MediaType.APPLICATION_OCTET_STREAM;


        if (resume.getFileType() != null) {

            try {

                mediaType =
                        MediaType.parseMediaType(
                                resume.getFileType());

            } catch (Exception ignored) {

                // Use default binary type
            }
        }


        return ResponseEntity.ok()
                .contentType(mediaType)
                .header(
                        HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=\"" +
                                resume.getFileName() +
                                "\"")
                .body(fileBytes);
    }


    // ================= DELETE RESUME =================

    @DeleteMapping
    public String deleteResume(
            Authentication authentication)
            throws IOException {

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


        Resume resume =
                resumeRepository
                        .findByStudentId(student.getId())
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Resume not uploaded yet"));


        if (resume.getFilePath() != null) {

            Files.deleteIfExists(
                    Paths.get(
                            resume.getFilePath()));
        }


        resumeRepository.delete(resume);


        return "Resume deleted successfully";
    }
}