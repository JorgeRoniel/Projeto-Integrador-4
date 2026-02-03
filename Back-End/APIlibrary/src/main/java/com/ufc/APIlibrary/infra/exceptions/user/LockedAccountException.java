package com.ufc.APIlibrary.infra.exceptions.user;

public class LockedAccountException extends RuntimeException {

    public LockedAccountException() {
        super("Conta bloqueada. Tente novamente mais tarde.");
    }

    public LockedAccountException(String message) {
        super(message);
    }
}