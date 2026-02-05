package com.ufc.APIlibrary.services.book;

import com.ufc.APIlibrary.dto.book.DatasForWishListDTO;
import com.ufc.APIlibrary.dto.book.NotificationDTO;
import com.ufc.APIlibrary.dto.book.WishListDTO;
import com.ufc.APIlibrary.dto.wishlist.NotificationResponseDTO;

import java.util.List;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Page;

public interface WishListService {

    void addBookInWL(DatasForWishListDTO data);
    Page<WishListDTO> listUsersWishes(Integer userId, String search, Pageable pageable);
    void updateNotification(NotificationDTO data);
    void removeFromWishList(DatasForWishListDTO data);
    List<NotificationResponseDTO> checkAndGetNotifications(Integer userId);
}
