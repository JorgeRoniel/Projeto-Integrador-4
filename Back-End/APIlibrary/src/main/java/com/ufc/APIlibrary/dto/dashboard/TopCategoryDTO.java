package com.ufc.APIlibrary.dto.dashboard;

public record TopCategoryDTO(
        String category,
        Double averageRating,
        Long count
) {}
