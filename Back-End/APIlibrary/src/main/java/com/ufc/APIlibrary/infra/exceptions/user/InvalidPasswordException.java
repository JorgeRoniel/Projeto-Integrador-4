package com.ufc.APIlibrary.infra.exceptions.user;

public class InvalidPasswordException extends RuntimeException {
    public InvalidPasswordException() {
        super("A senha deve ter no mínimo 6 caracteres!");
    }
    public InvalidPasswordException(String message) {
        super(message);
    }
}