package com.ufc.APIlibrary.dto.user;

public record ReturnLoginDTO(String token, Integer user_id, String username, String nome, String email, byte[] foto, String telefone, String role) {
}
