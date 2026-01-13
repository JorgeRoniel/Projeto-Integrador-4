package com.ufc.APIlibrary.dto.book;

import java.math.BigDecimal;
import java.util.List;

public record WishListDTO(Integer id, String titulo, String autor, String imagem, BigDecimal nota, List<String> categorias, Boolean notificacao) {

}
