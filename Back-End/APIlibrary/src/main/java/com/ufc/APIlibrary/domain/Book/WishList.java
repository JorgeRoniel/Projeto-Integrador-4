package com.ufc.APIlibrary.domain.Book;

import com.ufc.APIlibrary.domain.User.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "usuario_deseja_livro")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class WishList {

    @EmbeddedId
    private WishListId id;

    @ManyToOne
    @MapsId("UserId")
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne
    @MapsId("BookId")
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
