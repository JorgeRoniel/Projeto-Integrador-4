package com.ufc.APIlibrary.services.book;

import com.ufc.APIlibrary.dto.book.DatasForWishListDTO;
import com.ufc.APIlibrary.dto.book.WishListDTO;

import java.util.List;

public interface WishListService {

    void addBookInWL(DatasForWishListDTO data);
    List<WishListDTO> listUsersWishes(Integer user_id);
    void updateNotification(DatasForWishListDTO data, Boolean notification);
    void removeFromWishList(DatasForWishListDTO data);
}
