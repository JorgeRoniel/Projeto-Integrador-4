package com.ufc.APIlibrary.domain.Book;


import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.*;

import java.io.Serializable;

@Embeddable
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@EqualsAndHashCode
public class WishListId implements Serializable {

    @Column(name = "user_id")
    private Integer UserId;

    @Column(name = "book_id")
    private Integer BookId;
}
