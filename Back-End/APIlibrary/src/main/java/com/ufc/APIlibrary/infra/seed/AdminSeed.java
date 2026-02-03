package com.ufc.APIlibrary.infra.seed;

import com.ufc.APIlibrary.domain.User.User;
import com.ufc.APIlibrary.domain.User.UserRoles;
import com.ufc.APIlibrary.repositories.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.event.EventListener;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.boot.context.event.ApplicationReadyEvent;

@Component
public class AdminSeed {

    @Value("${admin.email}")
    private String email;

    @Value("${admin.password}")
    private String password;

    @Value("${admin.username}")
    private String username;

    @Autowired
    private UserRepository repository;

    @Autowired
    private PasswordEncoder encoder;

    @EventListener(ApplicationReadyEvent.class)
    public void createAdminIfNotExists() {

        if (repository.existsByEmail(email)) {
            return;
        }

        User admin = new User(
                username,
                "Administrador",
                email,
                encoder.encode(password),
                "00000000000",
                UserRoles.ADMIN
        );

        repository.save(admin);

        System.out.println("ADMIN criado automaticamente: " + email);
    }
}