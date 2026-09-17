package com.campusplacement.campus_placement_portal.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

@Entity
public class Job {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    private String title;

    @NotBlank
    private String description;

    @NotBlank
    private String location;

    @NotBlank
    private String eligibleBranch;

    @ManyToOne
    private Company company;

    // Minimum CGPA required for this job
    private Double minimumCgpa;

    // Last date to apply
    @NotNull(message = "Application deadline is required")
    private LocalDate applicationDeadline;
    // Package / Salary offered
    private Double packageAmount;

    // Skills required for this job
    private String requiredSkills;


    // ================= CONSTRUCTORS =================

    public Job() {
    }


    // Existing constructor
    public Job(
            String title,
            String description,
            String location,
            String eligibleBranch,
            Company company) {

        this.title = title;
        this.description = description;
        this.location = location;
        this.eligibleBranch = eligibleBranch;
        this.company = company;
    }


    // Constructor with CGPA and deadline
    public Job(
            String title,
            String description,
            String location,
            String eligibleBranch,
            Company company,
            Double minimumCgpa,
            LocalDate applicationDeadline) {

        this.title = title;
        this.description = description;
        this.location = location;
        this.eligibleBranch = eligibleBranch;
        this.company = company;
        this.minimumCgpa = minimumCgpa;
        this.applicationDeadline = applicationDeadline;
    }


    // Complete constructor
    public Job(
            String title,
            String description,
            String location,
            String eligibleBranch,
            Company company,
            Double minimumCgpa,
            LocalDate applicationDeadline,
            Double packageAmount,
            String requiredSkills) {

        this.title = title;
        this.description = description;
        this.location = location;
        this.eligibleBranch = eligibleBranch;
        this.company = company;
        this.minimumCgpa = minimumCgpa;
        this.applicationDeadline = applicationDeadline;
        this.packageAmount = packageAmount;
        this.requiredSkills = requiredSkills;
    }


    // ================= GETTERS =================

    public Long getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    public String getDescription() {
        return description;
    }

    public String getLocation() {
        return location;
    }

    public String getEligibleBranch() {
        return eligibleBranch;
    }

    public Company getCompany() {
        return company;
    }

    public Double getMinimumCgpa() {
        return minimumCgpa;
    }

    public LocalDate getApplicationDeadline() {
        return applicationDeadline;
    }

    public Double getPackageAmount() {
        return packageAmount;
    }

    public String getRequiredSkills() {
        return requiredSkills;
    }


    // ================= SETTERS =================

    public void setId(Long id) {
        this.id = id;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public void setEligibleBranch(String eligibleBranch) {
        this.eligibleBranch = eligibleBranch;
    }

    public void setCompany(Company company) {
        this.company = company;
    }

    public void setMinimumCgpa(Double minimumCgpa) {
        this.minimumCgpa = minimumCgpa;
    }

    public void setApplicationDeadline(LocalDate applicationDeadline) {
        this.applicationDeadline = applicationDeadline;
    }

    public void setPackageAmount(Double packageAmount) {
        this.packageAmount = packageAmount;
    }

    public void setRequiredSkills(String requiredSkills) {
        this.requiredSkills = requiredSkills;
    }
}