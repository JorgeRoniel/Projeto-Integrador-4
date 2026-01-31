package com.ufc.APIlibrary.services.book.implementation;

import com.ufc.APIlibrary.domain.Book.Book;
import com.ufc.APIlibrary.domain.Book.BookRating;
import com.ufc.APIlibrary.dto.book.BookRegisterDTO;
import com.ufc.APIlibrary.dto.book.ReturnBookLongDTO;
import com.ufc.APIlibrary.dto.book.ReturnBookShortDTO;
import com.ufc.APIlibrary.infra.exceptions.book.BookNotFoundException;
import com.ufc.APIlibrary.repositories.BookRatingRepository;
import com.ufc.APIlibrary.repositories.BookRepository;
import com.ufc.APIlibrary.repositories.UserRepository;
import com.ufc.APIlibrary.services.book.BookService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.Base64;

@Service
public class BookServiceImpl implements BookService {

    @Autowired
    private BookRepository repository;

    @Autowired
    private BookRatingRepository ratingRepository;

    @Autowired
    private UserRepository userRepository;

    @Override
    public Page<ReturnBookShortDTO> listToHome(Pageable pageable) {
        Page<Book> page = repository.findAll(pageable);

        Page<ReturnBookShortDTO> returnFormated = page.map(book -> new ReturnBookShortDTO(
                book.getId(),
                book.getTitle(),
                book.getAuthor(),
                resolveImagem(book),
                book.getRating_avg(),
                book.getCategory(),
                null,
                book.getDescription(),
                book.getPopularity_score(),
                book.getAcquision_date()));

        return returnFormated;
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

    @Override
    public ReturnBookShortDTO findBook(Integer id, Integer userId) {
        Book book = repository.findById(id).orElseThrow(BookNotFoundException::new);

        long totalUsers = userRepository.count();
        book.updatePopularity(totalUsers);
        repository.save(book);
    
        Integer notaUsuario = null;
    if (userId != null) {
        BookRating rating = ratingRepository.findByUserIdAndBookId(userId, id);
        if (rating != null) {
            notaUsuario = rating.getRating();
        }
    }

    return new ReturnBookShortDTO(
            book.getId(),
            book.getTitle(),
            book.getAuthor(),
            resolveImagem(book),
            book.getRating_avg(),
            book.getCategory(),
            notaUsuario,
            book.getDescription(),
            book.getPopularity_score(),
            book.getAcquision_date());
}

    @Override
    public Book registerBook(BookRegisterDTO data) {

        byte[] imagemFinal = null;
        String imagemUrlFinal = null;

        if (data.imagem() != null && data.imagem().length > 0) {
            imagemFinal = data.imagem();
        } else if (data.imagemUrl() != null && !data.imagemUrl().isBlank()) {
            imagemUrlFinal = data.imagemUrl();
        }

        LocalDate dataFinal = (data.data_aquisicao() != null) ? data.data_aquisicao() : LocalDate.now();

        Book book = new Book(
            data.titulo(),
            data.autor(),
            data.editora(),
            data.edicao(),
            data.ano_publicacao(),
            data.categorias(),
            data.descricao(),
            imagemFinal,
            imagemUrlFinal,
            dataFinal
        );

        return repository.save(book);
}

    @Override
    public void deleteBook(Integer id) {
        if (!repository.existsById(id)) {
            throw new BookNotFoundException();
        }
        repository.deleteById(id);
    }

    @Override
    public java.util.List<ReturnBookShortDTO> searchBooks(String query) {
        java.util.Set<Book> results = new java.util.HashSet<>();
        results.addAll(repository.findByTitleContainingIgnoreCase(query));
        results.addAll(repository.findByAuthorContainingIgnoreCase(query));
        results.addAll(repository.findByCategoryContainingIgnoreCase(query));

        return results.stream().map(book -> new ReturnBookShortDTO(
                book.getId(),
                book.getTitle(),
                book.getAuthor(),
                resolveImagem(book),
                book.getRating_avg(),
                book.getCategory(),
                null,
                book.getDescription(),
                book.getPopularity_score(),
                book.getAcquision_date())).toList();
    }
}
