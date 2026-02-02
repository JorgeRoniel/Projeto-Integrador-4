package com.ufc.APIlibrary.services.email.implementation;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import com.ufc.APIlibrary.services.email.EmailService;
import org.springframework.stereotype.Service;

@Service
public class EmailServiceImpl implements EmailService {

    @Autowired
    private JavaMailSender emailSender;

    @Override
    public void enviarEmail(String para, String assunto, String texto) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom("crateusbiblioteca@gmail.com"); 
            message.setTo(para);
            message.setSubject(assunto);
            message.setText(texto);
            emailSender.send(message);
            System.out.println("E-mail enviado com sucesso para: " + para);
        } catch (Exception e) {
            System.err.println("ERRO AO ENVIAR EMAIL: " + e.getMessage());
        }
    }
}