package com.ufc.APIlibrary.infra.exceptions.user.uniqueness;

public class UsernameAlreadyExistsException extends RuntimeException {

    public UsernameAlreadyExistsException() {
        super("Este nome de usuário já está em uso.");
    }
    public UsernameAlreadyExistsException(String message) {
        super(message);
    }
}