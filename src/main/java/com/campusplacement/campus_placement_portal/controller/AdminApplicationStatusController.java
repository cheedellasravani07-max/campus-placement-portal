package com.campusplacement.campus_placement_portal.controller;

import com.campusplacement.campus_placement_portal.exception.ResourceNotFoundException;
import com.campusplacement.campus_placement_portal.model.Application;
import com.campusplacement.campus_placement_portal.model.ApplicationStatus;
import com.campusplacement.campus_placement_portal.repository.ApplicationRepository;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/admin/applications")
@PreAuthorize("hasRole('ADMIN')")
public class AdminApplicationStatusController {

    private final ApplicationRepository applicationRepository;

    public AdminApplicationStatusController(
            ApplicationRepository applicationRepository) {

        this.applicationRepository = applicationRepository;
    }


    // ================= UPDATE APPLICATION STATUS =================

    @PutMapping("/{id}/status")
    public Application updateApplicationStatus(
            @PathVariable Long id,
            @RequestParam ApplicationStatus status) {

        Application application =
                applicationRepository.findById(id)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Application not found with id: " + id));

        application.setStatus(status);

        return applicationRepository.save(application);
    }
}