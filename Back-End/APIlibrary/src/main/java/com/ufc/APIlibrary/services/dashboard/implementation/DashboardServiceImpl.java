package com.ufc.APIlibrary.services.dashboard.implementation;

import com.ufc.APIlibrary.domain.User.User;
import com.ufc.APIlibrary.dto.dashboard.*;
import com.ufc.APIlibrary.repositories.BookRatingRepository;
import com.ufc.APIlibrary.repositories.WishListRepository;
import com.ufc.APIlibrary.services.dashboard.DashboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class DashboardServiceImpl implements DashboardService {

    @Autowired
    private WishListRepository wishListRepository;

    @Autowired
    private BookRatingRepository bookRatingRepository;

    @Override
    public DashboardResponseDTO getDashboard() {

        // Usuário vindo do JWT
        User user = (User) SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getPrincipal();

        Integer userId = user.getId();

        LocalDate now = LocalDate.now();
        LocalDate startOfMonth = now.withDayOfMonth(1);
        LocalDate startOfLastMonth = startOfMonth.minusMonths(1);
        LocalDate startOfYear = now.withDayOfYear(1);

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
                        startOfMonth.minusDays(1)
                );

        Integer booksThisYear =
                bookRatingRepository.countBooksReadBetween(
                        userId, startOfYear, now);

        //  Rankings
         //  Top autores
        List<TopAuthorDTO> topAuthors =
                bookRatingRepository.findTopAuthorsByUser(userId)
                        .stream()
                        .map(obj -> new TopAuthorDTO(
                                (String) obj[0],
                                (Double) obj[1]
                        ))
                        .toList();

        //  Categorias melhor avaliadas
        List<TopCategoryDTO> topRatedCategories =
                bookRatingRepository.findTopCategoriesByUser(userId)
                        .stream()
                        .map(obj -> new TopCategoryDTO(
                                (String) obj[0],
                                (Double) obj[1],
                                null
                        ))
                        .toList();

        //  Categorias mais lidas
        List<TopCategoryDTO> mostReadCategories =
                bookRatingRepository.findMostReadCategoriesByUser(userId)
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
