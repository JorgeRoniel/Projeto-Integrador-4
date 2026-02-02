package com.ufc.APIlibrary.infra.exceptions.book;

public class IsbnAlreadyExistsException extends RuntimeException {
    public IsbnAlreadyExistsException() {
        super("Já existe um livro cadastrado com este ISBN.");
    }

    public IsbnAlreadyExistsException(String message) {
        super(message);
    }
}