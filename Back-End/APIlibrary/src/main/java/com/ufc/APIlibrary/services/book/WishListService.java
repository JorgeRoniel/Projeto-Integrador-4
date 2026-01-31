package com.ufc.APIlibrary.services.book;

import com.ufc.APIlibrary.dto.book.DatasForWishListDTO;
import com.ufc.APIlibrary.dto.book.NotificationDTO;
import com.ufc.APIlibrary.dto.book.WishListDTO;
import com.ufc.APIlibrary.dto.wishlist.NotificationResponseDTO;

import java.util.List;

public interface WishListService {

    void addBookInWL(DatasForWishListDTO data);
    List<WishListDTO> listUsersWishes(Integer user_id);
    void updateNotification(NotificationDTO data);
    void removeFromWishList(DatasForWishListDTO data);
    List<NotificationResponseDTO> checkAndGetNotifications(Integer userId);
}
