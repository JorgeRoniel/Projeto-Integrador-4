package com.ufc.APIlibrary.services.user.implementations;

import com.ufc.APIlibrary.domain.User.User;
import com.ufc.APIlibrary.dto.user.LoginUserDTO;
import com.ufc.APIlibrary.dto.user.RegisterUserDTO;
import com.ufc.APIlibrary.dto.user.ReturnLoginDTO;
import com.ufc.APIlibrary.repositories.UserRepository;
import com.ufc.APIlibrary.services.token.TokenService;
import com.ufc.APIlibrary.services.user.UserServices;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserServicesImpl implements UserServices {

    @Autowired
    private AuthenticationManager authenticationManager;
    @Autowired
    private TokenService tokenService;
    @Autowired
    private UserRepository repository;
    @Autowired
    private PasswordEncoder encoder;


    @Override
    public ReturnLoginDTO login(LoginUserDTO data) {
        var emailpass = new UsernamePasswordAuthenticationToken(data.email(), data.senha());
        try {
            var auth = authenticationManager.authenticate(emailpass);
            User user = (User) auth.getPrincipal();
            String token = tokenService.generateToken((User) user);
            return new ReturnLoginDTO(user.getId(), token);
        } catch (AuthenticationException e){
            throw new RuntimeException("Error On Login!");
        }
    }

    @Override
    public User register(RegisterUserDTO data) {
        String pass = encoder.encode(data.senha());
        User u = new User(data.nome(), data.username(), data.email(), pass, data.telefone(), data.role());
        return repository.save(u);
    }
}
