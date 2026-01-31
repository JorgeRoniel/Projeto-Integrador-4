package com.ufc.APIlibrary.services.book.implementation;

import com.ufc.APIlibrary.domain.Book.Book;
import com.ufc.APIlibrary.domain.Book.WishList;
import com.ufc.APIlibrary.domain.User.User;
import com.ufc.APIlibrary.dto.book.DatasForWishListDTO;
import com.ufc.APIlibrary.dto.book.NotificationDTO;
import com.ufc.APIlibrary.dto.book.WishListDTO;
import com.ufc.APIlibrary.dto.wishlist.NotificationResponseDTO;
import com.ufc.APIlibrary.infra.exceptions.book.BookNotFoundException;
import com.ufc.APIlibrary.infra.exceptions.book.WishListAlreadyExistsException;
import com.ufc.APIlibrary.infra.exceptions.user.UserNotFoundException;
import com.ufc.APIlibrary.infra.exceptions.user.WishListNotFoundException;
import com.ufc.APIlibrary.repositories.BookRepository;
import com.ufc.APIlibrary.repositories.UserRepository;
import com.ufc.APIlibrary.repositories.WishListRepository;
import com.ufc.APIlibrary.services.book.WishListService;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

import java.util.ArrayList;
import java.util.Base64;
import java.util.List;

@Service
public class WishListServiceImpl implements WishListService {

    @Autowired
    private WishListRepository repository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private BookRepository bookRepository;

    @Override
    public void addBookInWL(DatasForWishListDTO data) {

        if (repository.existsByUserIdAndBookId(data.user_id(), data.book_id())) {
            throw new WishListAlreadyExistsException();
        }

        User user = userRepository.findById(data.user_id())
                .orElseThrow(UserNotFoundException::new);

        Book book = bookRepository.findById(data.book_id())
                .orElseThrow(BookNotFoundException::new);

        WishList newWish = new WishList(user, book);

        if (book.getAcquision_date() != null && book.getAcquision_date().isAfter(LocalDate.now())) {
            newWish.setNotification(true);
        }

        repository.save(newWish);

        book.setCount_in_wishlist(book.getCount_in_wishlist() + 1);
        book.updatePopularity(userRepository.count());
        bookRepository.save(book);

    }

    @Override
    public List<WishListDTO> listUsersWishes(Integer user_id) {
        List<WishList> wl = repository.findByUserId(user_id);
        if (!wl.isEmpty()) {
            return wl.stream().map(w -> new WishListDTO(
                    w.getBook().getId(),
                    w.getBook().getTitle(),
                    w.getBook().getAuthor(),
                    resolveImagem(w.getBook()),
                    w.getBook().getRating_avg(),
                    w.getBook().getCategory(),
                    w.getNotification(),
                    w.getBook().getAcquision_date())).toList();
        } else {
            throw new WishListNotFoundException();
        }
    }

    private String resolveImagem(Book book) {
        if (book.getPreview_picture_url() != null && !book.getPreview_picture_url().isBlank()) {
            return book.getPreview_picture_url();
        }
        if (book.getPreview_picture() != null) {
            return Base64.getEncoder()
                .encodeToString(book.getPreview_picture());
     }
        return null;
    }

    @Override
    public void updateNotification(NotificationDTO data) {
        WishList wl = repository.findByUserIdAndBookId(data.user_id(), data.book_id());

        if (wl == null) {
            throw new WishListNotFoundException();
        }

        wl.setNotification(data.notificacao());
        repository.save(wl);
    }

    @Override
    @Transactional
    public List<NotificationResponseDTO> checkAndGetNotifications(Integer userId) {

    List<WishList> items = repository.findAllByUserIdAndNotificationTrue(userId);
    
    List<NotificationResponseDTO> notifications = new ArrayList<>();
    LocalDate hoje = LocalDate.now();

    for (WishList wl : items) {

        if (wl.getBook().getAcquision_date().isBefore(hoje) || 
            wl.getBook().getAcquision_date().isEqual(hoje)) {
            
            notifications.add(new NotificationResponseDTO(
                wl.getBook().getId(), 
                wl.getBook().getTitle()
            ));

            wl.setNotification(false);
            repository.save(wl);
        }
    }
    
    return notifications;
}

    @Override
    public void removeFromWishList(DatasForWishListDTO data) {
        WishList wl = repository.findByUserIdAndBookId(data.user_id(), data.book_id());

        if (wl == null) {
            throw new WishListNotFoundException();
        }

        repository.delete(wl);

        Book book = bookRepository.findById(data.book_id())
            .orElseThrow(BookNotFoundException::new);

        book.setCount_in_wishlist(Math.max(0, book.getCount_in_wishlist() - 1));
        book.updatePopularity(userRepository.count());
        bookRepository.save(book);
    }
}
