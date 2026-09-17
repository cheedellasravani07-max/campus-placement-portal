package com.campusplacement.campus_placement_portal.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToOne;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;
import java.time.LocalTime;

@Entity
public class Interview {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @OneToOne
    private Application application;

    @NotNull
    private LocalDate interviewDate;

    @NotNull
    private LocalTime interviewTime;

    @NotBlank
    private String mode;

    private String location;

    private String meetingLink;


    public Interview() {
    }


    public Long getId() {
        return id;
    }

    public Application getApplication() {
        return application;
    }

    public LocalDate getInterviewDate() {
        return interviewDate;
    }

    public LocalTime getInterviewTime() {
        return interviewTime;
    }

    public String getMode() {
        return mode;
    }

    public String getLocation() {
        return location;
    }

    public String getMeetingLink() {
        return meetingLink;
    }


    public void setId(Long id) {
        this.id = id;
    }

    public void setApplication(Application application) {
        this.application = application;
    }

    public void setInterviewDate(LocalDate interviewDate) {
        this.interviewDate = interviewDate;
    }

    public void setInterviewTime(LocalTime interviewTime) {
        this.interviewTime = interviewTime;
    }

    public void setMode(String mode) {
        this.mode = mode;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public void setMeetingLink(String meetingLink) {
        this.meetingLink = meetingLink;
    }
}