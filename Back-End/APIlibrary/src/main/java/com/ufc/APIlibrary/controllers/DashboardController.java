package com.ufc.APIlibrary.controllers;

import com.ufc.APIlibrary.dto.dashboard.DashboardResponseDTO;
import com.ufc.APIlibrary.services.dashboard.DashboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    @Autowired
    private DashboardService service;

    @GetMapping
    public ResponseEntity<DashboardResponseDTO> getDashboard() {
        DashboardResponseDTO dashboard = service.getDashboard();
        return ResponseEntity.ok(dashboard);
    }
}
