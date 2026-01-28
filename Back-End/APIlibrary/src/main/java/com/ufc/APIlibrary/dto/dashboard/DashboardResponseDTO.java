package com.ufc.APIlibrary.dto.dashboard;

import java.util.List;

public record DashboardResponseDTO(
        Integer wishlistCount,
        Double satisfactionPercentage,
        Integer booksReadThisMonth,
        Integer booksReadLastMonth,
        Integer booksReadThisYear,
        List<TopAuthorDTO> topAuthors,
        List<TopCategoryDTO> topRatedCategories,
        List<TopCategoryDTO> mostReadCategories
) {
}
