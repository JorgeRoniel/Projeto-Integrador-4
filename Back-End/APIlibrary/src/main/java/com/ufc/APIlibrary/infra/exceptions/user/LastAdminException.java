package com.ufc.APIlibrary.infra.exceptions.user;

public class LastAdminException extends RuntimeException {

    public LastAdminException() {
        super("O sistema deve possuir pelo menos um administrador.");
    }

    public LastAdminException(String message) {
        super(message);
    }
}