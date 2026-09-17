package com.campusplacement.campus_placement_portal.controller;

import com.campusplacement.campus_placement_portal.exception.ResourceNotFoundException;
import com.campusplacement.campus_placement_portal.model.Student;
import com.campusplacement.campus_placement_portal.model.User;
import com.campusplacement.campus_placement_portal.repository.StudentRepository;
import com.campusplacement.campus_placement_portal.repository.UserRepository;

import org.springframework.core.io.Resource;
import org.springframework.core.io.FileSystemResource;
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
@RequestMapping("/student/profile/photo")
@PreAuthorize("hasRole('STUDENT')")
public class StudentProfilePhotoController {

    private final StudentRepository studentRepository;
    private final UserRepository userRepository;

    private final Path uploadDirectory =
            Paths.get("uploads/profile-photos");


    // ================= CONSTRUCTOR =================

    public StudentProfilePhotoController(
            StudentRepository studentRepository,
            UserRepository userRepository) {

        this.studentRepository = studentRepository;
        this.userRepository = userRepository;
    }


    // ================= UPLOAD PROFILE PHOTO =================

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public Student uploadProfilePhoto(
            @RequestParam("file") MultipartFile file,
            Authentication authentication)
            throws IOException {

        if (file == null || file.isEmpty()) {

            throw new IllegalArgumentException(
                    "Please select a profile photo");
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


        if (!lowerCaseFileName.endsWith(".jpg") &&
                !lowerCaseFileName.endsWith(".jpeg") &&
                !lowerCaseFileName.endsWith(".png")) {

            throw new IllegalArgumentException(
                    "Only JPG, JPEG and PNG files are allowed");
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


        // ================= DELETE OLD PHOTO =================

        if (student.getProfilePhoto() != null &&
                !student.getProfilePhoto().isBlank()) {

            Path oldPhoto =
                    Paths.get(student.getProfilePhoto());

            Files.deleteIfExists(oldPhoto);
        }


        // ================= CREATE SAFE FILE NAME =================

        String safeFileName =
                System.currentTimeMillis()
                        + "_"
                        + fileName.replaceAll(
                        "[^a-zA-Z0-9._-]",
                        "_");


        // ================= FILE PATH =================

        Path filePath =
                uploadDirectory.resolve(safeFileName);


        // ================= SAVE FILE =================

        Files.copy(
                file.getInputStream(),
                filePath,
                StandardCopyOption.REPLACE_EXISTING);


        // ================= SAVE PATH IN DATABASE =================

        student.setProfilePhoto(
                filePath.toString());


        return studentRepository.save(student);
    }


    // ================= VIEW PROFILE PHOTO =================

    @GetMapping("/view")
    public ResponseEntity<Resource> viewProfilePhoto(
            Authentication authentication)
            throws IOException {

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


        // ================= CHECK PHOTO =================

        if (student.getProfilePhoto() == null ||
                student.getProfilePhoto().isBlank()) {

            throw new ResourceNotFoundException(
                    "Profile photo not found");
        }


        // ================= GET FILE =================

        Path photoPath =
                Paths.get(student.getProfilePhoto());


        if (!Files.exists(photoPath)) {

            throw new ResourceNotFoundException(
                    "Profile photo file not found");
        }


        Resource resource =
                new FileSystemResource(photoPath);


        // ================= DETERMINE IMAGE TYPE =================

        String contentType =
                Files.probeContentType(photoPath);


        if (contentType == null) {

            contentType =
                    MediaType.APPLICATION_OCTET_STREAM_VALUE;
        }


        // ================= RETURN IMAGE =================

        return ResponseEntity.ok()
                .header(
                        HttpHeaders.CONTENT_DISPOSITION,
                        "inline; filename=\"" +
                                photoPath.getFileName() +
                                "\""
                )
                .contentType(
                        MediaType.parseMediaType(
                                contentType))
                .body(resource);
    }
}