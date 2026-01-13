package com.ufc.APIlibrary.dto.book;

public record BookRegisterDTO(String titulo, String autor, String edicao, Integer ano_publicacao, String editora, String imagem, String descricao) {
}
