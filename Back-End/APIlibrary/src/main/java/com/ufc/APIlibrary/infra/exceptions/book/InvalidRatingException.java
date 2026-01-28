package com.ufc.APIlibrary.infra.exceptions.book;

public class InvalidRatingException extends RuntimeException {
    public InvalidRatingException() {
        super("A nota deve estar entre 0 e 5.");
    }

    public InvalidRatingException(String message) {
        super(message);
    }
}
