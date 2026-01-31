package com.ufc.APIlibrary.dto.book;
import java.time.LocalDate;
import java.math.BigDecimal;
import java.util.List;

public record WishListDTO(Integer id, String titulo, String autor, String imagem, Float media, List<String> categorias, Boolean notificacao, LocalDate data_aquisicao) {

}
