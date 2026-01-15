package com.ufc.APIlibrary.dto.book;

import java.time.LocalDate;

public record ReturnRatingBookDTO(String username, String fotoDePerfil, Integer nota, String comentario, LocalDate dataComentario) {
}
