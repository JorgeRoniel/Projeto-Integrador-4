package com.ufc.APIlibrary.infra.exceptions.user;

public class ExpiredTokenException extends RuntimeException {
    public ExpiredTokenException() {
        super("O link de recuperação expirou!");
    }

    public ExpiredTokenException(String message) {
        super(message);
    }
}