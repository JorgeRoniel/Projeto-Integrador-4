package com.ufc.APIlibrary.dto.book;

import java.util.List;

public record BookRegisterDTO(String titulo, String autor, String edicao, Integer ano_publicacao, String editora, List<String> categorias, byte[] imagem, String descricao) {
}
