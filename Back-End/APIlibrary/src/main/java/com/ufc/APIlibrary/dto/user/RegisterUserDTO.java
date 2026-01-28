package com.ufc.APIlibrary.dto.user;

import com.ufc.APIlibrary.domain.User.UserRoles;

public record RegisterUserDTO(String username, String nome, String email, String senha, String telefone, UserRoles role) {
}
