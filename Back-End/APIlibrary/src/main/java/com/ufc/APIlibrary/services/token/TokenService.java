package com.ufc.APIlibrary.services.token;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTCreationException;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.ufc.APIlibrary.domain.User.User;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneOffset;

@Service
public class TokenService {

    private String secret = "T3ST3";

    public String generateToken(User user) {
        try {
            Algorithm alg = Algorithm.HMAC256(secret);
            String token = JWT.create()
                    .withIssuer("library_app")
                    .withSubject(String.valueOf(user.getId()))
                    .withExpiresAt(generateExpirationDate())
                    .sign(alg);
            return token;
        } catch (JWTCreationException e) {
            throw new RuntimeException("Erro: " + e);
        }
    }

    public String validateToken(String token) {
        try {
            Algorithm alg = Algorithm.HMAC256(secret);
            return JWT.require(alg)
                    .withIssuer("library_app")
                    .build()
                    .verify(token)
                    .getSubject();
        } catch (JWTVerificationException e) {
            throw new RuntimeException("Error: " + e);
        }
    }

    private Instant generateExpirationDate() {
        return LocalDateTime.now().plusHours(2).toInstant(ZoneOffset.of("-03:00"));
    }
}
