package com.ufc.APIlibrary.dto.book;

import java.math.BigDecimal;
import java.util.List;

public record ReturnBookLongDTO(int id, String titulo, String autor, List<String> categorias, String descricao, String imagem, Float media, Float popularidade) {
}
