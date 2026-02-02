package com.ufc.APIlibrary.services.book;

import com.ufc.APIlibrary.domain.Book.Book;
import com.ufc.APIlibrary.dto.book.BookRegisterDTO;
import com.ufc.APIlibrary.dto.book.BookUpdateDTO;
import com.ufc.APIlibrary.dto.book.ReturnBookShortDTO;
import com.ufc.APIlibrary.dto.book.ReturnBookLongDTO;
import com.ufc.APIlibrary.dto.book.ReturnCreationBookDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface BookService {

    Page<ReturnBookShortDTO> listToHome(String search, Pageable pageable);

    ReturnBookLongDTO findBook(Integer id, Integer userId);

    List<ReturnBookShortDTO> getWeeklyHighlights();

    Page<ReturnBookShortDTO> getRecommendations(Integer userId, Pageable pageable);

    List<ReturnBookShortDTO> getRelatedBooks(Integer id);

    Book registerBook(BookRegisterDTO data);

    void deleteBook(Integer id);

    void updateBook(Integer id, BookUpdateDTO data);

}
