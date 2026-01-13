package com.ufc.APIlibrary.domain.Book;


import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Objects;

@Embeddable
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class BookRatingId {

    @Column(name = "user_id")
    private Integer UserId;
    @Column(name = "book_id")
    private Integer BookId;

    @Override
    public boolean equals(Object o) {
        if (o == null || getClass() != o.getClass()) return false;
        BookRatingId that = (BookRatingId) o;
        return Objects.equals(UserId, that.UserId) && Objects.equals(BookId, that.BookId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(UserId, BookId);
    }
}
