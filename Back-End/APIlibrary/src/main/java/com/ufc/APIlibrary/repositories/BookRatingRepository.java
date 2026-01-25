package com.ufc.APIlibrary.repositories;

import com.ufc.APIlibrary.domain.Book.BookRating;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookRatingRepository extends JpaRepository<BookRating, Integer> {
    List<BookRating> findByBookId(Integer BookId);
    List<BookRating> findByUserId(Integer UserId);
}
