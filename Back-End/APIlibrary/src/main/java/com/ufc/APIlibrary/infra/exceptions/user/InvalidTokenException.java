package com.ufc.APIlibrary.infra.exceptions.user;

public class InvalidTokenException extends RuntimeException {
    public InvalidTokenException() {
        super("Token de recuperação inválido!");
    }

        public InvalidTokenException(String message) {
        super(message);
    }
}