package com.ufc.APIlibrary.services.book;

import com.ufc.APIlibrary.dto.book.WishListDTO;

import java.util.List;

public interface WishListService {

    void addBookInWL(Integer user_id, Integer book_id);
    List<WishListDTO> listUsersWishes(Integer user_id);
    void updateNotification(Integer user_id, Integer book_id, Boolean notification);
    void removeFromWishList(Integer user_id, Integer book_id);
}
