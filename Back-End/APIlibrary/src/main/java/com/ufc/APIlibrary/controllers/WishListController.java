package com.ufc.APIlibrary.controllers;

import com.ufc.APIlibrary.dto.book.DatasForWishListDTO;
import com.ufc.APIlibrary.dto.book.NotificationDTO;
import com.ufc.APIlibrary.services.book.WishListService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/wishlist")
public class WishListController {

    @Autowired
    private WishListService service;

    @PostMapping
    public ResponseEntity<Void> addInWishList(@RequestBody DatasForWishListDTO data) {
        service.addBookInWL(data);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/notification")
    public ResponseEntity<Void> updateNotificationRoute(@RequestBody NotificationDTO data) {
        service.updateNotification(data);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping
    public ResponseEntity<Void> delete(@RequestBody DatasForWishListDTO data) {
        service.removeFromWishList(data);
        return ResponseEntity.ok().build();
    }
}
