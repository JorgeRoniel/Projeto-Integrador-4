package com.ufc.APIlibrary.dto.user;

public record UpdateUserDTO(String username, String nome, String email, String senha, byte[] foto, String telefone) {
}
