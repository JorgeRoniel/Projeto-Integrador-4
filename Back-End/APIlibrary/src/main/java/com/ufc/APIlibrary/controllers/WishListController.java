package com.ufc.APIlibrary.controllers;

import com.ufc.APIlibrary.dto.book.DatasForWishListDTO;
import com.ufc.APIlibrary.dto.book.NotificationDTO;
import com.ufc.APIlibrary.dto.wishlist.NotificationResponseDTO;
import com.ufc.APIlibrary.services.book.WishListService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/wishlist")
public class WishListController {

    @Autowired
    private WishListService service;

    @PostMapping
    @PreAuthorize("#data.user_id == authentication.principal.id")
    public ResponseEntity<Void> addInWishList(@RequestBody DatasForWishListDTO data) {
        service.addBookInWL(data);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/notification")
    @PreAuthorize("#data.user_id == authentication.principal.id")
    public ResponseEntity<Void> updateNotificationRoute(@RequestBody NotificationDTO data) {
        service.updateNotification(data);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/check/{userId}")
    @PreAuthorize("#userId == authentication.principal.id")
    public ResponseEntity<List<NotificationResponseDTO>> checkNotifications(@PathVariable Integer userId) {
        return ResponseEntity.ok(service.checkAndGetNotifications(userId));
    }

    @DeleteMapping
    @PreAuthorize("#data.user_id == authentication.principal.id")
    public ResponseEntity<Void> delete(@RequestBody DatasForWishListDTO data) {
        service.removeFromWishList(data);
        return ResponseEntity.ok().build();
    }
}
