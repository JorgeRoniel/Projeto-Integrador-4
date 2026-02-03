package com.ufc.APIlibrary.infra.exceptions.book;

public class IsbnNotAvailableException extends RuntimeException {
    public IsbnNotAvailableException() {
        super("O ISBN deve ter 10 ou 13 caracteres (sem contar os traços)");
    }

    public IsbnNotAvailableException(String message) {
        super(message);
    }
}
