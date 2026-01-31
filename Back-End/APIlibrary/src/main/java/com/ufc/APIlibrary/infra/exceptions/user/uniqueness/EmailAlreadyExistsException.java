package com.ufc.APIlibrary.infra.exceptions.user.uniqueness;

public class EmailAlreadyExistsException extends RuntimeException {
    public EmailAlreadyExistsException() {
        super("Este email já está cadastrado.");
    }

    public EmailAlreadyExistsException(String message) {
        super(message);
    }
}
