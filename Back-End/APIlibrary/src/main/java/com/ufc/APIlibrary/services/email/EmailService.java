package com.ufc.APIlibrary.services.email;

public interface EmailService {
    void enviarEmail(String para, String assunto, String texto);
}