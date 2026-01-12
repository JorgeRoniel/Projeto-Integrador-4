package com.ufc.APIlibrary.domain.Book;


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
    private Integer UserId;
    private Integer BookId;
}
