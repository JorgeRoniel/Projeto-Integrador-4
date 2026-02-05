package com.ufc.APIlibrary.services.dashboard.implementation;

import com.ufc.APIlibrary.dto.dashboard.*;
import com.ufc.APIlibrary.repositories.BookRatingRepository;
import com.ufc.APIlibrary.repositories.WishListRepository;
import com.ufc.APIlibrary.services.dashboard.DashboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
public class DashboardServiceImpl implements DashboardService {

    @Autowired
    private WishListRepository wishListRepository;

    @Autowired
    private BookRatingRepository bookRatingRepository;

    @Override
    public DashboardResponseDTO getDashboard(Integer userId) {

        LocalDateTime now = LocalDateTime.now();
        LocalDateTime startOfMonth = now.withDayOfMonth(1).truncatedTo(ChronoUnit.DAYS);
        LocalDateTime startOfLastMonth = startOfMonth.minusMonths(1);
        LocalDateTime endOfLastMonth = startOfMonth.minusNanos(1);
        LocalDateTime startOfYear = now.withDayOfYear(1).truncatedTo(ChronoUnit.DAYS);

        // Wishlist
        Integer wishlistCount =
                wishListRepository.countWishlistByUser(userId);

        // Satisfação (%)
        Double avgRating =
                bookRatingRepository.findAverageRatingByUser(userId);

        Double satisfactionPercentage =
                avgRating == null ? 0.0 : (avgRating / 5.0) * 100;

        // Livros lidos
        Integer booksThisMonth =
                bookRatingRepository.countBooksReadBetween(
                        userId, startOfMonth, now);

        Integer booksLastMonth =
                bookRatingRepository.countBooksReadBetween(
                        userId,
                        startOfLastMonth,
                        endOfLastMonth
                );

        Integer booksThisYear =
                bookRatingRepository.countBooksReadBetween(
                        userId, startOfYear, now);

        Pageable topFive = PageRequest.of(0, 5);

        //  Rankings
         //  Top autores
        List<TopAuthorDTO> topAuthors =
                bookRatingRepository.findTopAuthorsByUser(userId, topFive)
                .stream()
                .map(obj -> new TopAuthorDTO(
                        (String) obj[0],
                        (Double) obj[1]
                ))
                .toList();

        // Categorias melhor avaliadas
        List<TopCategoryDTO> topRatedCategories =
                bookRatingRepository.findTopCategoriesByUser(userId, topFive) 
                .stream()
                .map(obj -> new TopCategoryDTO(
                        (String) obj[0],
                        (Double) obj[1],
                        null
                ))
                .toList();

        // Categorias mais lidas
        List<TopCategoryDTO> mostReadCategories =
        bookRatingRepository.findMostReadCategoriesByUser(userId, topFive) 
                .stream()
                .map(obj -> new TopCategoryDTO(
                        (String) obj[0],
                        null,
                        (Long) obj[1]
                ))
                .toList();

        return new DashboardResponseDTO(
                wishlistCount,
                satisfactionPercentage,
                booksThisMonth,
                booksLastMonth,
                booksThisYear,
                topAuthors,
                topRatedCategories,
                mostReadCategories
        );
    }
}
