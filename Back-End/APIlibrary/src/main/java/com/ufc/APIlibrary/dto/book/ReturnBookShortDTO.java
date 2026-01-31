package com.ufc.APIlibrary.dto.book;

import java.math.BigDecimal;
import java.util.List;
import java.time.LocalDate;

public record ReturnBookShortDTO(int id, String titulo, String autor, String imagem, Float media,
        List<String> categorias, Integer nota, String descricao, Float popularidade, LocalDate data_aquisicao) {
}
