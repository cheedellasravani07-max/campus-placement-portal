package com.campusplacement.campus_placement_portal.repository;

import com.campusplacement.campus_placement_portal.model.Resume;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ResumeRepository
        extends JpaRepository<Resume, Long> {

    Optional<Resume> findByStudentId(Long studentId);

}