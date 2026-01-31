package com.ufc.APIlibrary.controllers;

import com.ufc.APIlibrary.domain.Book.Book;
import com.ufc.APIlibrary.dto.book.*;
import com.ufc.APIlibrary.services.book.BookService;
import com.ufc.APIlibrary.services.book.RatingBookService;
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

    @PostMapping
    @org.springframework.security.access.annotation.Secured("ROLE_ADMIN")
    public ResponseEntity<ReturnCreationBookDTO> regiterBookRoute(@RequestBody BookRegisterDTO data) {
        Book book = bookService.registerBook(data);
        return ResponseEntity.status(HttpStatus.CREATED).body(new ReturnCreationBookDTO(book.getId()));
    }

    @GetMapping
    public ResponseEntity<Page<ReturnBookShortDTO>> listToHomePage(
            @PageableDefault(size = 12, sort = "title", direction = Sort.Direction.ASC) Pageable page) {
        return ResponseEntity.ok(bookService.listToHome(page));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ReturnBookShortDTO> returnBook(@PathVariable Integer id, @RequestParam(required = false) Integer userId) {
        ReturnBookShortDTO book = bookService.findBook(id, userId);
        if (book == null)
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        return ResponseEntity.ok(book);
    }

    @GetMapping("/search")
    public ResponseEntity<java.util.List<ReturnBookShortDTO>> searchBooks(@RequestParam("query") String query) {
        return ResponseEntity.ok(bookService.searchBooks(query));
    }

    @PostMapping("/{id}/rating")
    public ResponseEntity<Void> doRatingRoute(@PathVariable("id") Integer book_id, @RequestBody DoRatingBookDTO data) {

        ratingBookService.rating(data, book_id);
        return ResponseEntity.ok().build();

    }

    @GetMapping("/{id}/rating")
    public ResponseEntity<List<ReturnRatingBookDTO>> listRatingsForBook(@PathVariable("id") Integer book_id) {
        return ResponseEntity.ok(ratingBookService.listRatedForBooks(book_id));
    }

    @DeleteMapping("/{id}/delete")
    @org.springframework.security.access.annotation.Secured("ROLE_ADMIN")
    public ResponseEntity<Void> deleteBook(@PathVariable("id") Integer book_id) {
        bookService.deleteBook(book_id);
        return ResponseEntity.ok().build();
    }

}
