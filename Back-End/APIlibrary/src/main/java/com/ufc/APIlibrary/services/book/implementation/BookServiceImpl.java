package com.ufc.APIlibrary.services.book.implementation;

import com.ufc.APIlibrary.domain.Book.Book;
import com.ufc.APIlibrary.domain.Book.BookRating;
import com.ufc.APIlibrary.dto.book.BookRegisterDTO;
import com.ufc.APIlibrary.dto.book.BookUpdateDTO;
import com.ufc.APIlibrary.dto.book.ReturnBookShortDTO;
import com.ufc.APIlibrary.dto.book.ReturnBookLongDTO;
import com.ufc.APIlibrary.infra.exceptions.book.BookNotFoundException;
import com.ufc.APIlibrary.infra.exceptions.book.uniqueness.IsbnAlreadyExistsException;
import com.ufc.APIlibrary.repositories.BookRatingRepository;
import com.ufc.APIlibrary.repositories.BookRepository;
import com.ufc.APIlibrary.repositories.UserRepository;
import com.ufc.APIlibrary.services.book.BookService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.Base64;
import java.util.List;

@Service
public class BookServiceImpl implements BookService {

    @Autowired
    private BookRepository repository;

    @Autowired
    private BookRatingRepository ratingRepository;

    @Autowired
    private UserRepository userRepository;

    @Override
    public Page<ReturnBookShortDTO> listToHome(String search, Pageable pageable) {
        Page<Book> books;
        if (search != null && !search.isBlank()) {
            books = repository.findByGlobalSearch(search, pageable);
        } else {
            books = repository.findAll(pageable);
        }
        return books.map(this::mapToDTO);
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
    public ReturnBookLongDTO findBook(Integer id, Integer userId) {
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

    return new ReturnBookLongDTO(
            book.getId(),
            book.getTitle(),
            book.getAuthor(),
            resolveImagem(book),
            book.getPreview_picture_url(),
            book.getRating_avg(),
            book.getCategory(),
            notaUsuario,
            book.getDescription(),
            book.getPopularity_score(),
            book.getAcquision_date(),
            book.getPublisher(),
            book.getEdition(),
            book.getDate_publication());
    }

    @Override
    public Book registerBook(BookRegisterDTO data) {

        if (data.isbn() != null && !data.isbn().isBlank()) {
            if (repository.existsByIsbn(data.isbn())) {
                throw new IsbnAlreadyExistsException();
            }
        }

        byte[] imagemFinal = null;
        String imagemUrlFinal = null;

        if (data.imagemUrl() != null && !data.imagemUrl().isBlank()) {
            imagemUrlFinal = data.imagemUrl();
        } else if (data.imagem() != null && data.imagem().length > 0) {
            imagemFinal = data.imagem();
        }

        LocalDateTime dataFinal = (data.data_aquisicao() != null) ? data.data_aquisicao() : LocalDateTime.now();

        Book book = new Book(
            data.titulo(),
            data.subtitulo(),
            data.autor(),
            data.editora(),
            data.edicao(),
            data.ano_publicacao(),
            data.isbn(),
            data.categorias(),
            data.descricao(),
            data.paginas(),
            data.idioma(),
            data.preview_url(),
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
    public List<ReturnBookShortDTO> getWeeklyHighlights() {
        LocalDateTime aWeekAgo = LocalDateTime.now().minusDays(7).with(LocalTime.MIN);
        Pageable topTen = PageRequest.of(0, 10);
        return repository.findHighlights(aWeekAgo, topTen).map(this::mapToDTO).getContent();
    }

    @Override
    public Page<ReturnBookShortDTO> getRecommendations(Integer userId, Pageable pageable) {
        return repository.findRecommendations(userId, pageable).map(this::mapToDTO);
    }

   @Override
    public List<ReturnBookShortDTO> getRelatedBooks(Integer id) {

        Book book = repository.findById(id)
            .orElseThrow(BookNotFoundException::new);

        Pageable pageable = PageRequest.of(0, 5);

        List<Book> related = repository.findRelatedBooks(
            book.getAuthor(),
            book.getCategory(),
            id,
            pageable);

        return related.stream()
            .map(this::mapToDTO)
            .toList();
    }

    private ReturnBookShortDTO mapToDTO(Book book) {
        return new ReturnBookShortDTO(
            book.getId(),
            book.getTitle(),
            book.getAuthor(),
            resolveImagem(book),
            book.getRating_avg(), 
            book.getCategory(), 
            null, 
            book.getDescription(),
            book.getPopularity_score(), 
            book.getAcquision_date()
        );
    }

    @Override
    public void updateBook(Integer id, BookUpdateDTO data) {
        Book book = repository.findById(id)
            .orElseThrow(BookNotFoundException::new);

        book.setTitle(data.titulo());
        book.setAuthor(data.autor());
        book.setEdition(data.edicao());
        book.setDate_publication(data.ano_publicacao());
        book.setPublisher(data.editora());
        book.setDescription(data.descricao());

        if (data.data_aquisicao() != null) {
            book.setAcquision_date(data.data_aquisicao());
        }

        if (data.imagemUrl() != null && !data.imagemUrl().isBlank()) {
            book.setPreview_picture_url(data.imagemUrl());
            book.setPreview_picture(null);
        } 

        else if (data.imagem() != null && data.imagem().length > 0) {
            book.setPreview_picture(data.imagem());
            book.setPreview_picture_url(null);
        }

        if (data.categorias() != null) {
            book.setCategory(data.categorias());
        }

        repository.save(book);
    }

}
