package com.campusplacement.campus_placement_portal.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.validation.constraints.NotBlank;

@Entity
public class Student {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    private String name;

    @NotBlank
    private String email;

    @NotBlank
    private String branch;

    private String phone;

    private String rollNumber;

    private Double cgpa;

    private Integer graduationYear;

    private String skills;

    private String profilePhoto;


    // ================= CONSTRUCTOR =================

    public Student() {
    }


    public Student(
            Long id,
            String name,
            String email,
            String branch) {

        this.id = id;
        this.name = name;
        this.email = email;
        this.branch = branch;
    }


    // ================= GETTERS =================

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getEmail() {
        return email;
    }

    public String getBranch() {
        return branch;
    }

    public String getPhone() {
        return phone;
    }

    public String getRollNumber() {
        return rollNumber;
    }

    public Double getCgpa() {
        return cgpa;
    }

    public Integer getGraduationYear() {
        return graduationYear;
    }

    public String getSkills() {
        return skills;
    }

    public String getProfilePhoto() {
        return profilePhoto;
    }


    // ================= SETTERS =================

    public void setId(Long id) {
        this.id = id;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setBranch(String branch) {
        this.branch = branch;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public void setRollNumber(String rollNumber) {
        this.rollNumber = rollNumber;
    }

    public void setCgpa(Double cgpa) {
        this.cgpa = cgpa;
    }

    public void setGraduationYear(Integer graduationYear) {
        this.graduationYear = graduationYear;
    }

    public void setSkills(String skills) {
        this.skills = skills;
    }

    public void setProfilePhoto(String profilePhoto) {
        this.profilePhoto = profilePhoto;
    }
}