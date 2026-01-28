package com.ufc.APIlibrary.infra.exceptions.user;

public class RegisterErrorException extends RuntimeException{
    public RegisterErrorException() {
        super("Erro ao registrar usuário!");
    }

    public RegisterErrorException(String message) {
        super(message);
    }
}
