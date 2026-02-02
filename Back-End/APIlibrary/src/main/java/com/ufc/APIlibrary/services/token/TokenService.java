package com.ufc.APIlibrary.services.token;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTCreationException;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.ufc.APIlibrary.domain.User.User;
import com.ufc.APIlibrary.configurations.KeyUtils;
import org.springframework.stereotype.Service;

import java.security.interfaces.RSAPrivateKey;
import java.security.interfaces.RSAPublicKey;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.time.temporal.ChronoUnit;

@Service
public class TokenService {

    private final RSAPrivateKey privateKey;
    private final RSAPublicKey publicKey;

    public TokenService() throws Exception {
        this.privateKey = KeyUtils.readPrivateKey();
        this.publicKey = KeyUtils.readPublicKey();
    }

    public String generateToken(User user) {
        try {
            Algorithm alg = Algorithm.RSA256(publicKey, privateKey);
            return JWT.create()
                    .withIssuer("library_app")
                    .withSubject(String.valueOf(user.getId()))
                    .withExpiresAt(generateExpirationDate()) 
                    .sign(alg);
        } catch (JWTCreationException e) {
            throw new RuntimeException("Erro ao gerar token de sessão", e);
        }
    }

    public String generatePasswordRecoveryToken(User user) {
        try {
            Algorithm alg = Algorithm.RSA256(publicKey, privateKey);
            return JWT.create()
                    .withIssuer("library_app")
                    .withSubject(String.valueOf(user.getId()))
                    .withClaim("purpose", "password_recovery")
                    .withExpiresAt(Instant.now().plus(15, ChronoUnit.MINUTES))
                    .sign(alg);
        } catch (JWTCreationException e) {
            throw new RuntimeException("Erro ao gerar token de recuperação", e);
        }
    }

    public String validateToken(String token, String requiredPurpose) {
        try {
            Algorithm alg = Algorithm.RSA256(publicKey, null);
            var verifier = JWT.require(alg)
                .withIssuer("library_app")
                .build()
                .verify(token);
        
            String purpose = verifier.getClaim("purpose").asString();
        
            if (requiredPurpose != null && !requiredPurpose.equals(purpose)) {
                return "";
            }
        
            if (requiredPurpose == null && "password_recovery".equals(purpose)) {
                return "";
            }

            return verifier.getSubject();
        } catch (JWTVerificationException e) {
            return "";
        }
    }

    private Instant generateExpirationDate() {
        return LocalDateTime.now().plusHours(2).toInstant(ZoneOffset.of("-03:00"));
    }
}
