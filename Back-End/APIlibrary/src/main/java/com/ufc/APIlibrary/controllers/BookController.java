package com.ufc.APIlibrary.controllers;

import com.ufc.APIlibrary.domain.Book.Book;
import com.ufc.APIlibrary.dto.book.*;
import com.ufc.APIlibrary.services.book.BookService;
import com.ufc.APIlibrary.services.book.RatingBookService;
import com.ufc.APIlibrary.services.book.WishListService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/book")
public class BookController {

    @Autowired
    private BookService bookService;
    @Autowired
    private RatingBookService ratingBookService;
    @Autowired
    private WishListService wishListService;

    @PostMapping
    public ResponseEntity<ReturnCreationBookDTO> regiterBookRoute(@RequestBody BookRegisterDTO data){
        Book book = bookService.registerBook(data);
        return ResponseEntity.status(HttpStatus.CREATED).body(new ReturnCreationBookDTO(book.getId()));
    }

    @GetMapping
    public ResponseEntity<Page<ReturnBookShortDTO>> listToHomePage(@PageableDefault(
            size = 12,
            sort = "title",
            direction = Sort.Direction.ASC
    )Pageable page){
        return ResponseEntity.ok(bookService.listToHome(page));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ReturnBookLongDTO> returnBook(@PathVariable Integer id){
        ReturnBookLongDTO book = bookService.findBook(id);
        if (book == null) return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        return ResponseEntity.ok(book);
    }

    @PostMapping("/{id}/rating")
    public ResponseEntity doRatingRoute(@PathVariable("id") Integer book_id, @RequestBody DoRatingBookDTO data){
        String message = ratingBookService.rating(data, book_id);

        if(message.equals("OutInterval")){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("A nota está fora do intervalo (0 - 5).");
        }else if(message.equals("User/Book_null")){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Usuario e/ou Livro não encontrados.");
        }else{
            return ResponseEntity.status(HttpStatus.OK).build();
        }
    }

    @GetMapping("/{id}/rating")
    public ResponseEntity<List<ReturnRatingBookDTO>> listRatingsForBook(@PathVariable("id") Integer book_id){
        return ResponseEntity.ok(ratingBookService.listRatedForBooks(book_id));
    }


}
