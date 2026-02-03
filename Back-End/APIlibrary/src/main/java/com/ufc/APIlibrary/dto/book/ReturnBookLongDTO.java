package com.ufc.APIlibrary.dto.book;

import java.time.LocalDateTime;
import java.util.List;

public record ReturnBookLongDTO(
    int id, 
    String titulo, 
    String autor, 
    String imagem, 
    String imagemUrl, 
    Float media, 
    List<String> categorias, 
    Integer nota, 
    String descricao, 
    Float popularidade, 
    LocalDateTime data_aquisicao, 
    String editora, 
    String edicao, 
    Integer ano) {
}
