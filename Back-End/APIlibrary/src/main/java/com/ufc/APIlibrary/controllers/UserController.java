package com.ufc.APIlibrary.controllers;

import com.ufc.APIlibrary.domain.User.User;
import com.ufc.APIlibrary.dto.book.ReturnBookShortDTO;
import com.ufc.APIlibrary.dto.book.WishListDTO;
import com.ufc.APIlibrary.dto.user.LoginUserDTO;
import com.ufc.APIlibrary.dto.user.RegisterUserDTO;
import com.ufc.APIlibrary.dto.user.ReturnLoginDTO;
import com.ufc.APIlibrary.dto.user.UpdateUserDTO;
import com.ufc.APIlibrary.services.book.RatingBookService;
import com.ufc.APIlibrary.services.book.WishListService;
import com.ufc.APIlibrary.services.user.UserServices;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
    public ResponseEntity register(@RequestBody RegisterUserDTO data){
        User u = services.register(data);
        if (u == null) return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @PostMapping("/login")
    public ResponseEntity<ReturnLoginDTO> login(@RequestBody LoginUserDTO data){
        return ResponseEntity.status(HttpStatus.OK).body(services.login(data));
    }

    @PutMapping("/{id}/update")
    public ResponseEntity updateUserRoute(@PathVariable("id") Integer user_id, @RequestBody UpdateUserDTO data){
        services.updateUser(user_id, data);
        return ResponseEntity.status(HttpStatus.OK).build();
    }

    @DeleteMapping("/{id}/delete")
    public ResponseEntity deleteUserRoute(@PathVariable("id") Integer user_id){
        services.deleteUser(user_id);
        return ResponseEntity.status(HttpStatus.OK).build();
    }

    @GetMapping("/ratings/{id}")
    public ResponseEntity<List<ReturnBookShortDTO>> listRatingsForUser(@PathVariable("id") Integer user_id){
        return ResponseEntity.ok(ratingBookService.listRatedBooksByUser(user_id));
    }

    @GetMapping("/{id}/wishlist")
    public ResponseEntity<List<WishListDTO>> listOfWishList(@PathVariable("id") Integer user_id){
        return ResponseEntity.ok(wishListService.listUsersWishes(user_id));
    }

}
