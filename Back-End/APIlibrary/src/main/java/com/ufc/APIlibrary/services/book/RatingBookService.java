package com.ufc.APIlibrary.services.book;

import com.ufc.APIlibrary.dto.book.DoRatingBookDTO;
import com.ufc.APIlibrary.dto.book.ReturnBookLongDTO;
import com.ufc.APIlibrary.dto.book.ReturnBookShortDTO;
import com.ufc.APIlibrary.dto.book.ReturnRatingBookDTO;

import java.util.List;

public interface RatingBookService {

    String rating(DoRatingBookDTO data);
    List<ReturnRatingBookDTO> listRatedForBooks(Integer book_id);
    List<ReturnBookShortDTO> listRatedBooksByUser(Integer user_id);

}
