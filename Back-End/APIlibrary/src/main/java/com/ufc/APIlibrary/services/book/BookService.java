package com.ufc.APIlibrary.services.book;

import com.ufc.APIlibrary.dto.book.BookRegisterDTO;
import com.ufc.APIlibrary.dto.book.ReturnBookLongDTO;
import com.ufc.APIlibrary.dto.book.ReturnBookShortDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface BookService {

    Page<ReturnBookShortDTO> listToHome(Pageable pageable);
    ReturnBookLongDTO findBook(Integer id);
    void registerBook(BookRegisterDTO data);
    void deleteBook(Integer id);
}
