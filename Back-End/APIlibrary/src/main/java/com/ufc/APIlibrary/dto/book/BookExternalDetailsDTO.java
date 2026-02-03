package com.ufc.APIlibrary.dto.book;

import java.time.LocalDateTime;
import java.util.List;

public record BookExternalDetailsDTO(
    String titulo, 
    String subtitulo, 
    String autor, 
    String edicao, 
    String isbn, 
    Integer ano_publicacao, 
    String editora, 
    List<String> categorias, 
    byte[] imagem, 
    String imagemUrl,
    String descricao, 
    LocalDateTime data_aquisicao, 
    Integer paginas, 
    String idioma,  
    String preview_url) {

}
