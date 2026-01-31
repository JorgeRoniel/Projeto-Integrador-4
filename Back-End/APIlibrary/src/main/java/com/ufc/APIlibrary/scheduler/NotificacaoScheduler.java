package com.ufc.APIlibrary.scheduler;

import com.ufc.APIlibrary.domain.Book.WishList;
import com.ufc.APIlibrary.domain.User.User; 
import com.ufc.APIlibrary.repositories.WishListRepository;
import com.ufc.APIlibrary.services.email.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.List;
import java.util.Map; 
import java.util.stream.Collectors; 

// Esse código roda apenas uma vez por dia, ele compara os livros que chegam hoje com a data de hoje
// O que me garante que apenas um email será enviado por usuário por todos livros que chegam no dia atual (e que estão em sua lista de desejos)
@Component
public class NotificacaoScheduler {

    @Autowired
    private WishListRepository wishListRepository;

    @Autowired
    private EmailService emailService;

    @Scheduled(cron = "0 0 8 * * *")  // Todos os dias às 8h
    public void verificarLivrosDisponiveis() {
        LocalDate hoje = LocalDate.now();
        List<WishList> listaParaNotificar = wishListRepository.findToNotify(hoje);

        if (listaParaNotificar.isEmpty()) {
            return; 
        }

        // Agrupa os livros por usuário para evitar spam
        Map<User, List<WishList>> notificacoesPorUsuario = listaParaNotificar.stream()
                .collect(Collectors.groupingBy(WishList::getUser));

        notificacoesPorUsuario.forEach((usuario, itens) -> {
            String nomeUsuario = usuario.getName();
            String emailDestino = usuario.getEmail();

            // Transforma a lista de objetos WishList em uma String com os títulos
            String listaLivros = itens.stream()
                    .map(wl -> " - " + wl.getBook().getTitle())
                    .collect(Collectors.joining("\n"));

            String mensagem = "Olá " + nomeUsuario + "!\n\n" +
                              "Os seguintes livros da sua lista chegaram na Biblioteca Crateús hoje: \n\n" +
                              listaLivros + "\n\n" +
                              "Venha conferir!";

            emailService.enviarEmail(emailDestino, "Seus livros chegaram!", mensagem);
        });
    }
}