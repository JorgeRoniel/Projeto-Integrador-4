package com.ufc.APIlibrary.infra.exceptions.user;

public class RatingNotFoundException extends RuntimeException{
    public RatingNotFoundException() {
        super("Avaliacao Nao Encontrada! Provavelmente o usuário informado nao avaliou um livro ainda.");
    }

    public RatingNotFoundException(String message) {
        super(message);
    }
}
