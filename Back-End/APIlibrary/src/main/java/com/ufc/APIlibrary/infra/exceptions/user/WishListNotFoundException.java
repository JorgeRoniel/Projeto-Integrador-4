package com.ufc.APIlibrary.infra.exceptions.user;

public class WishListNotFoundException extends RuntimeException{
    public WishListNotFoundException() {
        super("O usuario nao possui livros na lista de desejos!");
    }

    public WishListNotFoundException(String message) {
        super(message);
    }
}
