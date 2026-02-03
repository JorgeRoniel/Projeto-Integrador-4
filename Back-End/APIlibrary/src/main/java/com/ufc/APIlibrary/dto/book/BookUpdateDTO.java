package com.ufc.APIlibrary.dto.book;

import java.time.LocalDateTime;
import java.util.List;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record BookUpdateDTO(
    @NotBlank(message = "O título não pode ser vazio")
    @Size(max = 255, message = "O título deve ter no máximo 255 caracteres") 
    String titulo, 

    @Size(max = 255, message = "O subtítulo é muito grande") 
    String subtitulo, 

    @NotBlank(message = "O autor não pode ser vazio")
    @Size(max = 255, message = "O autor deve ter no máximo 255 caracteres") 
    String autor, 

    @Size(max = 45, message = "A edição deve ter no máximo 45 caracteres") 
    String edicao, 

    @Size(min = 10, max = 13, message = "O ISBN deve ter entre 10 e 13 dígitos")
    String isbn, 

    @Min(value = 1, message = "São aceitos apenas números positivos")
    Integer ano_publicacao, 

    @Size(max = 255) 
    String editora, 

    List<String> categorias, 
    byte[] imagem, 

    @Size(max = 1000, message = "A URL da imagem do livro deve ter no máximo 1000 caracteres") 
    String imagemUrl, 

    @Size(max = 5000, message = "A descrição deve ter no máximo 5000 caracteres") 
    String descricao, 

    LocalDateTime data_aquisicao, 

    @Min(value = 1, message = "O livro deve ter pelo menos 1 página")
    Integer paginas, 

    @Size(max = 50, message = "O idioma informado deve ter no máximo 50 caracteres") 
    String idioma, 

    @Size(max = 1000, message = "A URL de preview do livro deve ter no máximo 1000 caracteres") 
    String preview_url
) {

    public BookUpdateDTO {
        if (isbn != null) {
            isbn = isbn.replaceAll("\\D", ""); 
        }
    }
}