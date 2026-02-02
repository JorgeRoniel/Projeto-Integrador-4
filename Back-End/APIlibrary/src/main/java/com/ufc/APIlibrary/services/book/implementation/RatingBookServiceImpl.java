package com.ufc.APIlibrary.services.book.implementation;

import com.ufc.APIlibrary.domain.Book.Book;
import com.ufc.APIlibrary.domain.Book.BookRating;
import com.ufc.APIlibrary.domain.User.User;
import com.ufc.APIlibrary.dto.book.DatasForWishListDTO;
import com.ufc.APIlibrary.dto.book.DoRatingBookDTO;
import com.ufc.APIlibrary.dto.book.ReturnBookShortDTO;
import com.ufc.APIlibrary.dto.book.ReturnRatingBookDTO;
import com.ufc.APIlibrary.infra.exceptions.book.BookNotFoundException;
import com.ufc.APIlibrary.infra.exceptions.book.BookNotAvailableException;
import com.ufc.APIlibrary.infra.exceptions.book.InvalidRatingException;
import com.ufc.APIlibrary.infra.exceptions.user.RatingNotFoundException;
import com.ufc.APIlibrary.infra.exceptions.user.UserNotFoundException;
import com.ufc.APIlibrary.infra.exceptions.user.WishListNotFoundException;
import com.ufc.APIlibrary.repositories.BookRatingRepository;
import com.ufc.APIlibrary.repositories.BookRepository;
import com.ufc.APIlibrary.repositories.UserRepository;
import com.ufc.APIlibrary.repositories.WishListRepository;
import com.ufc.APIlibrary.services.book.RatingBookService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.LocalDateTime;
import java.util.Base64;
import java.util.List;

@Service
public class RatingBookServiceImpl implements RatingBookService {

    @Autowired
    private BookRatingRepository repository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private BookRepository bookRepository;

    @Autowired
    private WishListServiceImpl wishlistService;

    @Override
    @Transactional
    public String rating(DoRatingBookDTO data, Integer book_id) {

        if (data.nota() == null || (data.nota() < 0 && data.nota() != -1) || data.nota() > 5) {
            throw new InvalidRatingException();
        }

        User user = userRepository.findById(data.user_id())
            .orElseThrow(UserNotFoundException::new);

        Book book = bookRepository.findById(book_id)
            .orElseThrow(BookNotFoundException::new);

        if (book.getAcquision_date() != null && book.getAcquision_date().isAfter(LocalDateTime.now())) {
            throw new BookNotAvailableException();
        }

        BookRating rating = repository.findByUserIdAndBookId(user.getId(), book_id);

        if (rating != null) {

            if (rating.getRating() == -1 && data.nota() > 0) {
                book.setCount_reading(Math.max(0, book.getCount_reading() - 1));
                book.setCount_read(book.getCount_read() + 1);
            }
            // Atualiza avaliação existente
            rating.setRating(data.nota());
            rating.setReview(data.comentario());
            rating.setDateReview(LocalDateTime.now());
            repository.save(rating);
        } else {
            if (data.nota() == -1) {
                book.setCount_reading(book.getCount_reading() + 1);
            }else {
                book.setCount_read(book.getCount_read() + 1);
            }
            try {
                this.wishlistService.removeFromWishList(new DatasForWishListDTO(user.getId(), book_id));
            } catch (WishListNotFoundException e) {
                // Ignora se não estiver na wishlist, pois o objetivo é apenas garantir que saia de lá
            }
            // Cria nova avaliação
            BookRating newRating = new BookRating(user, book, data.nota(), data.comentario());
            newRating.getId().setUserId(user.getId());
            newRating.getId().setBookId(book.getId());
            repository.save(newRating);
        }

        // RECALCULA MÉTRICAS DE POPULARIDADE
        long totalUsers = userRepository.count();
        book.updatePopularity(totalUsers);

        // RECALCULA MÉTRICAS DO LIVRO
        Integer reviewsCount = repository.countValidRatings(book_id);
        Integer sumRatings = repository.sumValidRatings(book_id);

        float avg = (reviewsCount == 0) ? 0f : (float) sumRatings / reviewsCount;

        book.setReviews_count(reviewsCount);
        book.setSum_ratings(sumRatings);
        book.setRating_avg(avg);

        bookRepository.save(book);

        return "OK";
    }

    @Override
    public Page<ReturnRatingBookDTO> listRatedForBooks(Integer book_id, Pageable pageable) {
        Page<BookRating> ratingsPage = repository.findByBookIdAndRatingGreaterThanEqual(book_id, 0, pageable);
    
        return ratingsPage.map(rating -> new ReturnRatingBookDTO(
            rating.getId().getUserId(),
            rating.getUser().getUsername(),
            rating.getUser().getProfile(),
            rating.getRating(),
            rating.getReview(),
            rating.getDateReview()));
    }

    @Override
    public List<ReturnBookShortDTO> listRatedBooksByUser(Integer user_id) {
        List<BookRating> ratings = repository.findByUserId(user_id);
        if (!ratings.isEmpty()) {
            return ratings.stream().map(r -> new ReturnBookShortDTO(
                    r.getBook().getId(),
                    r.getBook().getTitle(),
                    r.getBook().getAuthor(),
                    resolveImagem(r.getBook()),
                    r.getBook().getRating_avg(),
                    r.getBook().getCategory(),
                    r.getRating(),
                    r.getReview(),
                    r.getBook().getPopularity_score(),
                    r.getBook().getAcquision_date())).toList();
        } else {
            throw new RatingNotFoundException();
        }
    }

    private String resolveImagem(Book book) {
        if (book.getPreview_picture_url() != null && !book.getPreview_picture_url().isBlank()) {
            return book.getPreview_picture_url();
        }
        if (book.getPreview_picture() != null) {
            return Base64.getEncoder()
                .encodeToString(book.getPreview_picture());
     }
        return null;
    }
}
