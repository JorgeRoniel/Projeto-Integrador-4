package com.ufc.APIlibrary.configurations;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import java.security.KeyFactory;
import java.security.interfaces.RSAPrivateKey;
import java.security.interfaces.RSAPublicKey;
import java.security.spec.PKCS8EncodedKeySpec;
import java.security.spec.X509EncodedKeySpec;
import java.util.Base64;
import org.springframework.core.io.ClassPathResource;

@Component
public class KeyUtils {

    @Value("${RSA_PRIVATE_KEY}")
    private String privateKeyStr;

    public RSAPrivateKey readPrivateKey() throws Exception {

        if (privateKeyStr == null) {
            throw new RuntimeException("Variável de ambiente RSA_PRIVATE_KEY não encontrada!");
        }

        String temp = privateKeyStr
                .replace("-----BEGIN PRIVATE KEY-----", "")
                .replace("-----END PRIVATE KEY-----", "")
                .replaceAll("\\s", ""); // Remove quebras de linha e espaços
        
        byte[] decoded = Base64.getDecoder().decode(temp);
        PKCS8EncodedKeySpec spec = new PKCS8EncodedKeySpec(decoded);
        return (RSAPrivateKey) KeyFactory.getInstance("RSA").generatePrivate(spec);
    }

    public RSAPublicKey readPublicKey() throws Exception {
        byte[] keyBytes = new ClassPathResource("certs/public_key.pem").getContentAsByteArray();
        String temp = new String(keyBytes)
                .replace("-----BEGIN PUBLIC KEY-----", "")
                .replace("-----END PUBLIC KEY-----", "")
                .replaceAll("\\s", "");
        
        byte[] decoded = Base64.getDecoder().decode(temp);
        X509EncodedKeySpec spec = new X509EncodedKeySpec(decoded);
        return (RSAPublicKey) KeyFactory.getInstance("RSA").generatePublic(spec);
    }
}