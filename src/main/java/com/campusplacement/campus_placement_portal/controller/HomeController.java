
package com.campusplacement.campus_placement_portal.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;

@Controller
public class HomeController {

    @GetMapping("/")
    public void home(HttpServletResponse response) throws IOException {
        response.sendRedirect("/student-signup.html");
    }
}

