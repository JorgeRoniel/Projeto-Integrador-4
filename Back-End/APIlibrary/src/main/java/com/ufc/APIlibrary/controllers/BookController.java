package com.ufc.APIlibrary.controllers;

import com.ufc.APIlibrary.domain.Book.Book;
import com.ufc.APIlibrary.dto.book.*;
import com.ufc.APIlibrary.services.book.BookService;
import com.ufc.APIlibrary.services.book.RatingBookService;

import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
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
    public ResponseEntity<ReturnCreationBookDTO> regiterBookRoute(@RequestBody @Valid BookRegisterDTO data) {
        Book book = bookService.registerBook(data);
        return ResponseEntity.status(HttpStatus.CREATED).body(new ReturnCreationBookDTO(book.getId()));
    }

    @GetMapping
    public ResponseEntity<Page<ReturnBookShortDTO>> listToHomePage(
            @RequestParam(value = "search", required = false) String search,
            @PageableDefault(size = 12, sort = "title", direction = Sort.Direction.ASC) Pageable page) {
        return ResponseEntity.ok(bookService.listToHome(search, page));
    }

    @GetMapping("/{id}/related")
    public ResponseEntity<List<ReturnBookShortDTO>> getRelatedBooks(@PathVariable Integer id) {
        List<ReturnBookShortDTO> related = bookService.getRelatedBooks(id);
        return ResponseEntity.ok(related);
    }

    @GetMapping("/highlights")
    public ResponseEntity<List<ReturnBookShortDTO>> getHighlights() {
        return ResponseEntity.ok(bookService.getWeeklyHighlights());
    }

    @GetMapping("/recommendations/{userId}")
    public ResponseEntity<Page<ReturnBookShortDTO>> getRecommendations(
            @PathVariable Integer userId,
            @PageableDefault(size = 10) Pageable pageable) {
        return ResponseEntity.ok(bookService.getRecommendations(userId, pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ReturnBookLongDTO> returnBook(@PathVariable Integer id,
            @RequestParam(required = false) Integer userId) {
        ReturnBookLongDTO book = bookService.findBook(id, userId);
        if (book == null)
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        return ResponseEntity.ok(book);
    }

    @PostMapping("/{id}/rating")
    @PreAuthorize("#data.user_id == authentication.principal.id")
    public ResponseEntity<Void> doRatingRoute(@PathVariable("id") Integer book_id,
            @RequestBody @Valid DoRatingBookDTO data) {

        ratingBookService.rating(data, book_id);
        return ResponseEntity.ok().build();

    }

    @GetMapping("/{id}/rating")
    public ResponseEntity<Page<ReturnRatingBookDTO>> listRatingsForBook(
            @PathVariable("id") Integer book_id,
            @PageableDefault(size = 5, sort = "dateReview", direction = Sort.Direction.DESC) Pageable page) {
        return ResponseEntity.ok(ratingBookService.listRatedForBooks(book_id, page));
    }

    @PutMapping("/{id}/update")
    @org.springframework.security.access.annotation.Secured("ROLE_ADMIN")
    public ResponseEntity<Void> updateBook(
            @PathVariable("id") Integer book_id,
            @RequestBody @Valid BookUpdateDTO data) {
        bookService.updateBook(book_id, data);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}/delete")
    @org.springframework.security.access.annotation.Secured("ROLE_ADMIN")
    public ResponseEntity<Void> deleteBook(@PathVariable("id") Integer book_id) {
        bookService.deleteBook(book_id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/external/isbn")
    @org.springframework.security.access.annotation.Secured("ROLE_ADMIN")
    public ResponseEntity<BookExternalDetailsDTO> getExternalBookDetails(@RequestParam("isbn") String isbn) {
        BookExternalDetailsDTO details = bookService.searchExternalBookByIsbn(isbn);
        return ResponseEntity.ok(details);
    }

}
