package com.ufc.APIlibrary.dto.user;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record LoginUserDTO(
    @Email(message = "Por favor, insira um endereço de email válido")
    @NotBlank(message = "O email não pode ficar em branco")
    @Size(min = 5, max = 50, message = "Utilize um email de 5 a 50 caracteres") 
    String email, 

    @NotBlank(message = "A senha não pode ficar em branco")
    String senha) {
}
