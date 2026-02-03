package com.ufc.APIlibrary.controllers;

import com.ufc.APIlibrary.dto.dashboard.DashboardResponseDTO;
import com.ufc.APIlibrary.services.dashboard.DashboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    @Autowired
    private DashboardService service;

    @GetMapping("/user/{id}")
    @PreAuthorize("#id == authentication.principal.id")
    public ResponseEntity<DashboardResponseDTO> getDashboard(
        @PathVariable Integer id
    ) {
        DashboardResponseDTO dashboard = service.getDashboard(id);
        return ResponseEntity.ok(dashboard);
    }
}
