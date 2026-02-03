package com.ufc.APIlibrary.services.book;

import com.ufc.APIlibrary.dto.book.DoRatingBookDTO;
import com.ufc.APIlibrary.dto.book.ReturnBookShortDTO;
import com.ufc.APIlibrary.dto.book.ReturnRatingBookDTO;

import java.util.List;

import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Page;

public interface RatingBookService {

    String rating(DoRatingBookDTO data, Integer book_id);
    Page<ReturnRatingBookDTO> listRatedForBooks(Integer book_id, Pageable pageable);
    List<ReturnBookShortDTO> listRatedBooksByUser(Integer user_id);

}
