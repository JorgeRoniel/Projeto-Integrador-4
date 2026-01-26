package com.ufc.APIlibrary.services.dashboard;

import com.ufc.APIlibrary.dto.dashboard.DashboardResponseDTO;

public interface DashboardService {

    DashboardResponseDTO getDashboard(Integer userId);
}
