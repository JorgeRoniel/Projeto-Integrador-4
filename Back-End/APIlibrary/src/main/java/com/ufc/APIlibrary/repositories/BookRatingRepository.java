package com.ufc.APIlibrary.repositories;

import com.ufc.APIlibrary.domain.Book.BookRating;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface BookRatingRepository extends JpaRepository<BookRating, Integer> {
    List<BookRating> findByBookId(Integer BookId);

    List<BookRating> findByUserId(Integer UserId);

    BookRating findByUserIdAndBookId(Integer userId, Integer bookId);

    Page<BookRating> findByBookIdAndRatingGreaterThanEqual(Integer bookId, Integer minRating, Pageable pageable);

    @Query("""
            SELECT COUNT(r)
            FROM BookRating r
            WHERE r.book.id = :bookId AND r.rating <> -1
        """)
    Integer countValidRatings(@Param("bookId") Integer bookId);

    @Query("""
            SELECT COALESCE(SUM(r.rating), 0)
            FROM BookRating r
            WHERE r.book.id = :bookId AND r.rating <> -1
        """)
    Integer sumValidRatings(@Param("bookId") Integer bookId);

    @Query("""
                SELECT AVG(r.rating)
                FROM BookRating r
                WHERE r.user.id = :userId AND r.rating <> -1
            """)
    Double findAverageRatingByUser(@Param("userId") Integer userId);

    // Livros lidos em intervalo de datas (mês, ano etc)
    @Query("""
                SELECT COUNT(r)
                FROM BookRating r
                WHERE r.user.id = :userId
                AND r.dateReview BETWEEN :start AND :end
            """)
    Integer countBooksReadBetween(
            @Param("userId") Integer userId,
            @Param("start") LocalDateTime start,
            @Param("end") LocalDateTime end);

   // Top autores
    @Query("""
            SELECT r.book.author, AVG(r.rating)
            FROM BookRating r
            WHERE r.user.id = :userId AND r.rating <> -1
            GROUP BY r.book.author
            ORDER BY AVG(r.rating) DESC
        """)
    List<Object[]> findTopAuthorsByUser(@Param("userId") Integer userId, Pageable pageable);

    // Top categorias avaliadas
    @Query("""
            SELECT c, AVG(r.rating)
            FROM BookRating r
            JOIN r.book.category c
            WHERE r.user.id = :userId AND r.rating <> -1
            GROUP BY c
            ORDER BY AVG(r.rating) DESC
        """)
    List<Object[]> findTopCategoriesByUser(@Param("userId") Integer userId, Pageable pageable);

    // Categorias mais lidas
    @Query("""
            SELECT c, COUNT(r)
            FROM BookRating r
            JOIN r.book.category c
            WHERE r.user.id = :userId
            GROUP BY c
            ORDER BY COUNT(r) DESC
        """)
    List<Object[]> findMostReadCategoriesByUser(@Param("userId") Integer userId, Pageable pageable);
}
