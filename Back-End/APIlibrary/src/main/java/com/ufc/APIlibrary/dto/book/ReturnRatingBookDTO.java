package com.ufc.APIlibrary.dto.book;

import java.time.LocalDateTime;

public record ReturnRatingBookDTO(Integer id, String username, byte[] fotoDePerfil, Integer nota, String comentario, LocalDateTime dataComentario) {
}
