package com.ufc.APIlibrary.infra.exceptions.book;

public class BookNotAvailableException extends RuntimeException {
    public BookNotAvailableException() {
        super("Este livro ainda não está disponível na biblioteca para esta ação.");
    }

    public BookNotAvailableException(String message) {
        super(message);
    }
}