package com.ufc.APIlibrary.domain.Book;


import com.ufc.APIlibrary.domain.User.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;
import java.time.LocalDate;

@Entity
@Table(name = "books_rating")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class BookRating implements Serializable {

    @EmbeddedId
    private BookRatingId id;

    @ManyToOne
    @MapsId("UserId")
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne
    @MapsId("BookId")
    @JoinColumn(name = "book_id")
    private Book book;

    @Column(nullable = false)
    private Integer rating;

    @Column(length = 255)
    private String review;

    private LocalDate review_date;

    public BookRating(User user, Book book, Integer rating, String review) {
        this.user = user;
        this.book = book;
        this.rating = rating;
        this.review = review;
        this.review_date = LocalDate.now();
    }
}
