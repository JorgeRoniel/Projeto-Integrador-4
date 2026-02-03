package com.ufc.APIlibrary.dto.book;
import java.time.LocalDateTime;
import java.util.List;

public record WishListDTO(Integer id, String titulo, String autor, String imagem, Float media, List<String> categorias, Boolean notificacao, LocalDateTime data_aquisicao) {

}
