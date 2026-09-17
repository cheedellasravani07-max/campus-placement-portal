package com.campusplacement.campus_placement_portal.repository;

import com.campusplacement.campus_placement_portal.model.Application;
import com.campusplacement.campus_placement_portal.model.ApplicationStatus;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ApplicationRepository
        extends JpaRepository<Application, Long> {

    List<Application> findByStudentId(Long studentId);

    List<Application> findByJobId(Long jobId);

    boolean existsByStudentIdAndJobId(
            Long studentId,
            Long jobId
    );

    // Count applications by status
    long countByStatus(ApplicationStatus status);
}