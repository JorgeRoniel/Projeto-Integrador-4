package com.ufc.APIlibrary.dto.book;

import java.util.List;
import java.time.LocalDateTime;

public record ReturnBookShortDTO(int id, String titulo, String autor, String imagem, Float media,
        List<String> categorias, Integer nota, String descricao, Float popularidade, LocalDateTime data_aquisicao) {
}
