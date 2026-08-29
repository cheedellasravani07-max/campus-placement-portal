package com.campusplacement.campus_placement_portal.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.validation.constraints.NotNull;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;

@Entity
public class Application {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Enumerated(EnumType.STRING)
    private ApplicationStatus status;

    @NotNull
    @ManyToOne
    @JsonIgnoreProperties({"applications"})
    private Student student;

    @NotNull
    @ManyToOne
    @JsonIgnoreProperties({"applications"})
    private Job job;

    public Application() {
    }

    public Long getId() {
        return id;
    }

    public ApplicationStatus getStatus() {
        return status;
    }

    public Student getStudent() {
        return student;
    }

    public Job getJob() {
        return job;
    }

    public void setStatus(ApplicationStatus status) {
        this.status = status;
    }

    public void setStudent(Student student) {
        this.student = student;
    }

    public void setJob(Job job) {
        this.job = job;
    }
}