package com.ufc.APIlibrary.controllers;

import com.ufc.APIlibrary.domain.User.User;
import com.ufc.APIlibrary.dto.book.ReturnBookShortDTO;
import com.ufc.APIlibrary.dto.book.WishListDTO;
import com.ufc.APIlibrary.dto.user.LoginUserDTO;
import com.ufc.APIlibrary.dto.user.RegisterUserDTO;
import com.ufc.APIlibrary.dto.user.ResetPasswordDTO;
import com.ufc.APIlibrary.dto.user.RecoveryRequestDTO;
import com.ufc.APIlibrary.dto.user.ReturnLoginDTO;
import com.ufc.APIlibrary.dto.user.UpdateUserDTO;
import com.ufc.APIlibrary.dto.user.UpdateUserRoleDTO;
import com.ufc.APIlibrary.services.book.RatingBookService;
import com.ufc.APIlibrary.services.book.WishListService;
import com.ufc.APIlibrary.services.user.UserServices;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/user")
public class UserController {
    @Autowired
    private UserServices services;
    @Autowired
    private RatingBookService ratingBookService;
    @Autowired
    private WishListService wishListService;

    @PostMapping("/register")
    public ResponseEntity<Void> register(@RequestBody @Valid RegisterUserDTO data) {
        User u = services.register(data);
        if (u == null)
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @PostMapping("/login")
    public ResponseEntity<ReturnLoginDTO> login(@RequestBody @Valid LoginUserDTO data) {
        return ResponseEntity.status(HttpStatus.OK).body(services.login(data));
    }

    @PutMapping("/{id}/update")
    @PreAuthorize("#user_id == authentication.principal.id")
    public ResponseEntity<Void> updateUserRoute(@PathVariable("id") Integer user_id,
            @RequestBody @Valid UpdateUserDTO data) {
        services.updateUser(user_id, data);
        return ResponseEntity.status(HttpStatus.OK).build();
    }

    @DeleteMapping("/{id}/delete")
    @PreAuthorize("#user_id == authentication.principal.id")
    public ResponseEntity<Void> deleteUserRoute(@PathVariable("id") Integer user_id) {
        services.deleteUser(user_id);
        return ResponseEntity.status(HttpStatus.OK).build();
    }

    @GetMapping("/ratings/{id}")
    @PreAuthorize("#user_id == authentication.principal.id")
    public ResponseEntity<Page<ReturnBookShortDTO>> listRatingsForUser(
            @PathVariable("id") Integer user_id,
            @RequestParam(defaultValue = "false") boolean apenasValidas,
            @RequestParam(required = false) String search,
            Pageable pageable) {
        return ResponseEntity.ok(ratingBookService.listRatedBooksByUser(user_id, apenasValidas, search, pageable));
    }

    @GetMapping("/{id}/wishlist")
    @PreAuthorize("#user_id == authentication.principal.id")
    public ResponseEntity<Page<WishListDTO>> listOfWishList(
            @PathVariable("id") Integer user_id,
            @RequestParam(required = false) String search,
            Pageable pageable) {
        return ResponseEntity.ok(wishListService.listUsersWishes(user_id, search, pageable));
    }

    @PutMapping("/role/{username}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> updateUserRole(
            @PathVariable String username,
            @RequestBody UpdateUserRoleDTO data) {
        services.updateUserRole(username, data.role());
        return ResponseEntity.ok().build();
    }

    @GetMapping("/admin/usernames")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<String>> listAdminUsernames() {
        return ResponseEntity.ok(services.listAdminUsernames());
    }

    @PostMapping("/recover-password")
    public ResponseEntity<Void> recoverPassword(@RequestBody @Valid RecoveryRequestDTO data) {
        services.recoverPassword(data.email());
        return ResponseEntity.ok().build();
    }

    @PutMapping("/reset-password-final")
    public ResponseEntity<Void> resetPasswordFinal(@RequestBody ResetPasswordDTO data) {
        services.resetPassword(data);
        return ResponseEntity.ok().build();
    }
}
