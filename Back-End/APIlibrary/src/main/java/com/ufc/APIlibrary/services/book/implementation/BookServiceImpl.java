package com.ufc.APIlibrary.services.book.implementation;

import com.ufc.APIlibrary.domain.Book.Book;
import com.ufc.APIlibrary.dto.book.BookRegisterDTO;
import com.ufc.APIlibrary.dto.book.ReturnBookLongDTO;
import com.ufc.APIlibrary.dto.book.ReturnBookShortDTO;
import com.ufc.APIlibrary.infra.exceptions.book.BookNotFoundException;
import com.ufc.APIlibrary.repositories.BookRepository;
import com.ufc.APIlibrary.services.book.BookService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.util.Arrays;

@Service
public class BookServiceImpl implements BookService {

    @Autowired
    private BookRepository repository;

    @Override
    public Page<ReturnBookShortDTO> listToHome(Pageable pageable) {
        Page<Book> page = repository.findAll(pageable);

        Page<ReturnBookShortDTO> returnFormated = page.map(book -> new ReturnBookShortDTO(
                book.getId(),
                book.getTitle(),
                book.getAuthor(),
                book.getPreview_picture(),
                book.getRating_avg(),
                book.getCategory(),
                null,
                null));

        return returnFormated;
    }

    @Override
    public ReturnBookLongDTO findBook(Integer id) {
        Book book = repository.findById(id)
                .orElseThrow(BookNotFoundException::new);

        return new ReturnBookLongDTO(
                book.getId(),
                book.getTitle(),
                book.getAuthor(),
                book.getCategory(),
                book.getDescription(),
                Arrays.toString(book.getPreview_picture()),
                book.getRating_avg());
    }

    @Override
    public Book registerBook(BookRegisterDTO data) {

        Book book = new Book(
                data.titulo(),
                data.autor(),
                data.editora(),
                data.edicao(),
                data.ano_publicacao(),
                data.categorias(),
                data.descricao(),
                data.imagem());

        return repository.save(book);

    }

    @Override
    public void deleteBook(Integer id) {
        if (!repository.existsById(id)) {
            throw new BookNotFoundException();
        }
        repository.deleteById(id);
    }
}
