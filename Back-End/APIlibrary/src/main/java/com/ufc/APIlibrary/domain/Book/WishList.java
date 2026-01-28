package com.ufc.APIlibrary.domain.Book;

import com.ufc.APIlibrary.domain.User.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "wishlist")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Access(AccessType.FIELD)
public class WishList {

    @EmbeddedId
    private WishListId id = new WishListId();

    @ManyToOne
    @MapsId("userId")
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne
    @MapsId("bookId")
    @JoinColumn(name = "book_id")
    private Book book;

    @Column(nullable = false)
    private Boolean notification = false;

    public WishList(User user, Book book) {
        this.user = user;
        this.book = book;
        this.notification = false;
    }
}
