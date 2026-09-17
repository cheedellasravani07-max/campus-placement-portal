package com.campusplacement.campus_placement_portal.repository;

import com.campusplacement.campus_placement_portal.model.Interview;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface InterviewRepository
        extends JpaRepository<Interview, Long> {

    // Find interview for a particular application
    Optional<Interview> findByApplicationId(Long applicationId);

    // Find all interviews belonging to a particular student
    List<Interview> findByApplicationStudentId(Long studentId);
}