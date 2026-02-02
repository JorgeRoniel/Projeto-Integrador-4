package com.ufc.APIlibrary.repositories;

import com.ufc.APIlibrary.domain.Book.Book;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

@Repository
public interface BookRepository extends JpaRepository<Book, Integer> {

    @Query("SELECT b FROM Book b WHERE LOWER(REPLACE(b.title, '.', '')) LIKE LOWER(CONCAT('%', REPLACE(:title, '.', ''), '%'))")
    List<Book> findByTitleContainingIgnoreCase(@Param("title") String title);

    @Query("SELECT b FROM Book b WHERE LOWER(REPLACE(b.author, '.', '')) LIKE LOWER(CONCAT('%', REPLACE(:author, '.', ''), '%'))")
    List<Book> findByAuthorContainingIgnoreCase(@Param("author") String author);

    @Query("SELECT b FROM Book b JOIN b.category c WHERE LOWER(REPLACE(c, '.', '')) LIKE LOWER(CONCAT('%', REPLACE(:category, '.', ''), '%'))")
    List<Book> findByCategoryContainingIgnoreCase(@Param("category") String category);

    @Query("SELECT DISTINCT b FROM Book b " +
       "LEFT JOIN b.category cat " +
       "WHERE lower(b.title) LIKE lower(concat('%', :searchTerm, '%')) OR " +
       "lower(b.author) LIKE lower(concat('%', :searchTerm, '%')) OR " +
       "lower(cat) LIKE lower(concat('%', :searchTerm, '%'))")
    Page<Book> findByGlobalSearch(@Param("searchTerm") String searchTerm, Pageable pageable);

    @Query("SELECT r.book FROM BookRating r WHERE r.rating >= 0 AND r.dateReview >= :umaSemanaAtras GROUP BY r.book ORDER BY AVG(r.rating) DESC, COUNT(r.book) DESC")
    Page<Book> findHighlights(@Param("umaSemanaAtras") LocalDateTime umaSemanaAtras, Pageable pageable);

    @Query("SELECT DISTINCT b FROM Book b " +
       "JOIN b.category c " + 
       "WHERE c IN (" +
       "  SELECT r.book.category FROM BookRating r " +
       "  JOIN r.book.category rc " + 
       "  WHERE r.user.id = :userId AND r.rating >= 4" +
       ") " +
       "AND b.id NOT IN (SELECT r2.book.id FROM BookRating r2 WHERE r2.user.id = :userId) " +
       "ORDER BY b.rating_avg DESC")
    Page<Book> findRecommendations(@Param("userId") Integer userId, Pageable pageable);

    @Query("SELECT DISTINCT b FROM Book b LEFT JOIN b.category c " +
       "WHERE (b.author = :author OR c IN :categories) " +
       "AND b.id <> :currentBookId " +
       "ORDER BY b.popularity_score DESC")
    List<Book> findRelatedBooks(
        @Param("author") String author, 
        @Param("categories") List<String> categories, 
        @Param("currentBookId") Integer currentBookId, 
        Pageable pageable
    );

    boolean existsByIsbn(String isbn);
}
