package com.ufc.APIlibrary.domain.Book;


import com.ufc.APIlibrary.domain.User.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;
import java.time.LocalDateTime;

@Entity
@Table(name = "book_ratings")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Access(AccessType.FIELD)
public class BookRating implements Serializable {

    @EmbeddedId
    private BookRatingId id = new BookRatingId();

    @ManyToOne
    @MapsId("userId")
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne
    @MapsId("bookId")
    @JoinColumn(name = "book_id")
    private Book book;

    @Column(nullable = false)
    private Integer rating;

    @Column(length = 255)
    private String review;

    @Column(name = "date_review", columnDefinition = "TEXT")
    private LocalDateTime dateReview;

    public BookRating(User user, Book book, Integer rating, String review) {
        this.user = user;
        this.book = book;
        this.rating = rating;
        this.review = review;
        this.dateReview = LocalDateTime.now();
    }
}
