package com.ufc.APIlibrary.services.book.implementation;

import com.ufc.APIlibrary.domain.Book.Book;
import com.ufc.APIlibrary.domain.Book.BookRating;
import com.ufc.APIlibrary.domain.User.User;
import com.ufc.APIlibrary.dto.book.DoRatingBookDTO;
import com.ufc.APIlibrary.dto.book.ReturnBookShortDTO;
import com.ufc.APIlibrary.dto.book.ReturnRatingBookDTO;
import com.ufc.APIlibrary.infra.exceptions.book.BookNotFoundException;
import com.ufc.APIlibrary.infra.exceptions.book.InvalidRatingException;
import com.ufc.APIlibrary.infra.exceptions.user.RatingNotFoundException;
import com.ufc.APIlibrary.infra.exceptions.user.UserNotFoundException;
import com.ufc.APIlibrary.repositories.BookRatingRepository;
import com.ufc.APIlibrary.repositories.BookRepository;
import com.ufc.APIlibrary.repositories.UserRepository;
import com.ufc.APIlibrary.services.book.RatingBookService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RatingBookServiceImpl implements RatingBookService {

    @Autowired
    private BookRatingRepository repository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private BookRepository bookRepository;

    @Override
    public String rating(DoRatingBookDTO data, Integer book_id) {
        if (data.nota() == null || (data.nota() < 0 && data.nota() != -1) || data.nota() > 5) {
            throw new InvalidRatingException();
        }

        // Tenta encontrar avaliação existente para o par Usuário/Livro
        BookRating rating = repository.findByUserIdAndBookId(data.user_id(), book_id);

        if (rating != null) {
            // Atualiza existente
            rating.setRating(data.nota());
            rating.setReview(data.comentario());
            rating.setDate_review(java.time.LocalDate.now());
            repository.save(rating);
        } else {
            // Cria nova
            User user = userRepository.findById(data.user_id())
                    .orElseThrow(UserNotFoundException::new);
            Book book = bookRepository.findById(book_id)
                    .orElseThrow(BookNotFoundException::new);

            BookRating newRating = new BookRating(user, book, data.nota(), data.comentario());
            // Vincula explicitamente o ID composto
            newRating.getId().setUserId(user.getId());
            newRating.getId().setBookId(book.getId());

            repository.save(newRating);
        }

        return "OK";
    }

    @Override
    public List<ReturnRatingBookDTO> listRatedForBooks(Integer book_id) {
        List<BookRating> books = repository.findByBookId(book_id);
        List<ReturnRatingBookDTO> r = books.stream().map(rating -> new ReturnRatingBookDTO(
                rating.getUser().getUsername(),
                rating.getUser().getProfile(),
                rating.getRating(),
                rating.getReview(),
                rating.getDate_review())).toList();
        return r;
    }

    @Override
    public List<ReturnBookShortDTO> listRatedBooksByUser(Integer user_id) {
        List<BookRating> ratings = repository.findByUserId(user_id);
        if (!ratings.isEmpty()) {
            return ratings.stream().map(r -> new ReturnBookShortDTO(
                    r.getBook().getId(),
                    r.getBook().getTitle(),
                    r.getBook().getAuthor(),
                    r.getBook().getPreview_picture(),
                    r.getBook().getRating_avg(),
                    r.getBook().getCategory(),
                    r.getRating(),
                    r.getReview())).toList();
        } else {
            throw new RatingNotFoundException();
        }
    }
}
