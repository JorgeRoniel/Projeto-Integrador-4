package com.ufc.APIlibrary.services.user.implementations;

import com.ufc.APIlibrary.domain.User.User;
import com.ufc.APIlibrary.dto.user.LoginUserDTO;
import com.ufc.APIlibrary.dto.user.RegisterUserDTO;
import com.ufc.APIlibrary.dto.user.ReturnLoginDTO;
import com.ufc.APIlibrary.dto.user.UpdateUserDTO;
import com.ufc.APIlibrary.infra.exceptions.user.RegisterErrorException;
import com.ufc.APIlibrary.infra.exceptions.user.UserNotFoundException;
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
        var auth = authenticationManager.authenticate(emailpass);
        User user = (User) auth.getPrincipal();
        String token = tokenService.generateToken((User) user);
        return new ReturnLoginDTO(token, user.getId(), user.getUsername(), user.getName(), user.getEmail(), user.getProfile(), user.getPhone_number(), user.getRole().toString());

    }

    @Override
    public User register(RegisterUserDTO data) throws RegisterErrorException {
        String pass = encoder.encode(data.senha());
        User u = new User(data.nome(), data.username(), data.email(), pass, data.telefone(), data.role());
        return repository.save(u);
    }

    @Override
    public void updateUser(Integer user_id, UpdateUserDTO data) {
        var u = repository.findById(user_id).orElse(null);

        if(u != null){
            String new_pass = encoder.encode(data.senha());

            u.setUsername(data.username());
            u.setName(data.nome());
            u.setEmail(data.email());
            u.setPassword(new_pass);
            u.setProfile(data.foto());
            u.setPhone_number(data.telefone());

            repository.save(u);
        }else{
            throw new UserNotFoundException();
        }
    }

    @Override
    public void deleteUser(Integer user_id) {
        if(repository.existsById(user_id)){
            repository.deleteById(user_id);
        }else{
            throw new UserNotFoundException();
        }
    }
}
