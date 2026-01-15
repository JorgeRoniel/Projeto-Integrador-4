package com.ufc.APIlibrary.services.book;

import com.ufc.APIlibrary.dto.book.BookRegisterDTO;
import com.ufc.APIlibrary.dto.book.ReturnBookLongDTO;
import com.ufc.APIlibrary.dto.book.ReturnBookShortDTO;
import org.springframework.data.domain.Page;

public interface BookService {

    Page<ReturnBookShortDTO> listToHome();
    ReturnBookLongDTO findBook(Integer id);
    void registerBook(BookRegisterDTO data);
    void deleteBook(Integer id);
}
