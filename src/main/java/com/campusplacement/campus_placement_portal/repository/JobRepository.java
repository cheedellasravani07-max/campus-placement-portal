package com.campusplacement.campus_placement_portal.repository;

import com.campusplacement.campus_placement_portal.model.Job;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface JobRepository extends JpaRepository<Job, Long> {

    List<Job> findByCompanyId(Long companyId);

}