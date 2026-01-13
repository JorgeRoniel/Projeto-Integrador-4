package com.ufc.APIlibrary.dto.book;

import java.math.BigDecimal;
import java.util.List;

public record ReturnBookShortDTO(int id, String titulo, String autor, String imagem, BigDecimal nota, List<String> categorias) {
}
