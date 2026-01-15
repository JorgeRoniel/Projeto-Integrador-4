package com.ufc.APIlibrary.dto.book;

public record DoRatingBookDTO(Integer user_id, Integer book_id, Integer nota, String comentario) {
    public DoRatingBookDTO(Integer user_id, Integer book_id, Integer nota, String comentario) {
        this.user_id = user_id;
        this.book_id = book_id;
        this.nota = nota;

        if(comentario.isEmpty()){
            this.comentario = "";
        }else{
            this.comentario = comentario;
        }
    }
}
