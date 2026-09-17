package com.campusplacement.campus_placement_portal.controller;

import com.campusplacement.campus_placement_portal.exception.ResourceNotFoundException;
import com.campusplacement.campus_placement_portal.model.Company;
import com.campusplacement.campus_placement_portal.repository.CompanyRepository;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/student/company")
@PreAuthorize("hasRole('STUDENT')")
public class CompanyDetailsController {

    private final CompanyRepository companyRepository;

    public CompanyDetailsController(
            CompanyRepository companyRepository) {

        this.companyRepository = companyRepository;
    }


    // ================= GET COMPANY DETAILS =================

    @GetMapping("/{id}")
    public Company getCompanyDetails(
            @PathVariable Long id) {

        return companyRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Company not found with id: " + id));
    }
}