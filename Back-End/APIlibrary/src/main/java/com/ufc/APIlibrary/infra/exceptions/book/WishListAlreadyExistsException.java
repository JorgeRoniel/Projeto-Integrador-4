package com.ufc.APIlibrary.infra.exceptions.book;

public class WishListAlreadyExistsException extends RuntimeException {
    public WishListAlreadyExistsException() {
        super("O livro já está na wishlist do usuário.");
    }

    public WishListAlreadyExistsException(String message) {
        super(message);
    }
}
