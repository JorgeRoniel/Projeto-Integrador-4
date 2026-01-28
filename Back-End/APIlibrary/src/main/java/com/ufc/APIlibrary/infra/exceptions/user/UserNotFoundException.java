package com.ufc.APIlibrary.infra.exceptions.user;

public class UserNotFoundException extends RuntimeException{

    public UserNotFoundException() {
        super("Usuario nao encontrado!");
    }

    public UserNotFoundException(String message) {
        super(message);
    }
}
