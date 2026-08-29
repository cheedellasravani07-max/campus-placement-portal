package com.campusplacement.campus_placement_portal.repository;

import com.campusplacement.campus_placement_portal.model.Company;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CompanyRepository extends JpaRepository<Company, Long> {

}