package com.ufc.APIlibrary.infra.exceptions.book.uniqueness;

public class WishListAlreadyExistsException extends RuntimeException {
    public WishListAlreadyExistsException() {
        super("O livro já está na wishlist do usuário.");
    }

    public WishListAlreadyExistsException(String message) {
        super(message);
    }
}
