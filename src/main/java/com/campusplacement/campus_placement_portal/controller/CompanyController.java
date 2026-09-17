package com.campusplacement.campus_placement_portal;

import com.campusplacement.campus_placement_portal.model.Company;
import com.campusplacement.campus_placement_portal.repository.CompanyRepository;
import com.campusplacement.campus_placement_portal.exception.ResourceNotFoundException;

import jakarta.validation.Valid;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/companies")
public class CompanyController {

    private final CompanyRepository companyRepository;

    public CompanyController(CompanyRepository companyRepository) {
        this.companyRepository = companyRepository;
    }


    // ================= GET ALL COMPANIES =================

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public List<Company> getAllCompanies() {
        return companyRepository.findAll();
    }


    // ================= ADD COMPANY =================

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public Company addCompany(
            @Valid @RequestBody Company company) {

        return companyRepository.save(company);
    }


    // ================= GET COMPANY BY ID =================

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public Company getCompanyById(
            @PathVariable Long id) {

        return companyRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Company not found with id: " + id));
    }


    // ================= UPDATE COMPANY =================

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public Company updateCompany(
            @PathVariable Long id,
            @Valid @RequestBody Company updatedCompany) {

        Company company = companyRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Company not found with id: " + id));

        company.setName(updatedCompany.getName());
        company.setLocation(updatedCompany.getLocation());
        company.setRole(updatedCompany.getRole());

        return companyRepository.save(company);
    }


    // ================= DELETE COMPANY =================

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public String deleteCompany(
            @PathVariable Long id) {

        Company company = companyRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Company not found with id: " + id));

        companyRepository.delete(company);

        return "Company deleted successfully";
    }
}