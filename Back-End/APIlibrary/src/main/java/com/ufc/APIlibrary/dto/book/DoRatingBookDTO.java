package com.ufc.APIlibrary.dto.book;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Size;

public record DoRatingBookDTO(
    Integer user_id, 

    @Min(value = -1, message = "Nota baixa demais")
    @Max(value = 5, message = "Nota grande demais, o limite é 5")
    Integer nota, 

    @Size(max = 1000, message = "O comentário deve ter no máximo 1000 caracteres")
    String comentario
) {
    public DoRatingBookDTO
     {
        comentario = (comentario == null) ? "" : comentario.trim();
    }
}
