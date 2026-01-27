package com.ufc.APIlibrary.infra.exceptions.user.uniqueness;

public class PhoneNumberAlreadyExistsException extends RuntimeException {
    public PhoneNumberAlreadyExistsException() {
        super("Este número de telefone já está cadastrado.");
    }
}
