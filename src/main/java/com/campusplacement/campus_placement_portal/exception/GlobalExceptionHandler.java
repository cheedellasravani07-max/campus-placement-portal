package com.campusplacement.campus_placement_portal.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.server.ResponseStatusException;

@RestControllerAdvice
public class GlobalExceptionHandler {

    // ================= RESOURCE NOT FOUND =================

    @ExceptionHandler(ResourceNotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public String handleResourceNotFoundException(
            ResourceNotFoundException exception) {

        return exception.getMessage();
    }


    // ================= DUPLICATE APPLICATION =================

    @ExceptionHandler(ResponseStatusException.class)
    public org.springframework.http.ResponseEntity<String>
    handleResponseStatusException(
            ResponseStatusException exception) {

        return org.springframework.http.ResponseEntity
                .status(exception.getStatusCode())
                .body(exception.getReason());
    }
}
