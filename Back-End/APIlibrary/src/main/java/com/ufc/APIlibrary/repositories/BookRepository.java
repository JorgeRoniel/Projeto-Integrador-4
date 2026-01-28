package com.ufc.APIlibrary.repositories;

import com.ufc.APIlibrary.domain.Book.Book;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

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
}
