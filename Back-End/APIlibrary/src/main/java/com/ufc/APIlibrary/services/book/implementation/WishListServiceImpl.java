package com.ufc.APIlibrary.services.book.implementation;

import com.ufc.APIlibrary.domain.Book.Book;
import com.ufc.APIlibrary.domain.Book.WishList;
import com.ufc.APIlibrary.domain.Book.WishListId;
import com.ufc.APIlibrary.domain.User.User;
import com.ufc.APIlibrary.dto.book.DatasForWishListDTO;
import com.ufc.APIlibrary.dto.book.NotificationDTO;
import com.ufc.APIlibrary.dto.book.WishListDTO;
import com.ufc.APIlibrary.infra.exceptions.user.WishListNotFoundException;
import com.ufc.APIlibrary.repositories.BookRepository;
import com.ufc.APIlibrary.repositories.UserRepository;
import com.ufc.APIlibrary.repositories.WishListRepository;
import com.ufc.APIlibrary.services.book.WishListService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

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

        if(repository.existsByUserIdAndBookId(data.user_id(), data.book_id())){
            throw new RuntimeException("The Book is already in wishlist.");
        }
        User user = userRepository.findById(data.user_id()).orElse(null);
        Book book = bookRepository.findById(data.book_id()).orElse(null);
        if(book != null && user != null){
            WishList wl = new WishList(user, book);
            repository.save(wl);
        }else{
            throw new RuntimeException("Error while add book in wishlist.");
        }

    }

    @Override
    public List<WishListDTO> listUsersWishes(Integer user_id) {
        List<WishList> wl = repository.findByUserId(user_id);
        if (!wl.isEmpty()){
            return wl.stream().map(w -> new WishListDTO(
                    w.getBook().getId(),
                    w.getBook().getTitle(),
                    w.getBook().getAuthor(),
                    w.getBook().getPreview_picture(),
                    w.getBook().getRating_avg(),
                    w.getBook().getCategory(),
                    w.getNotification()
            )).toList();
        }else{
            throw new WishListNotFoundException();
        }
    }

    @Override
    public void updateNotification(NotificationDTO data) {
        if(!repository.existsByUserIdAndBookId(data.user_id(), data.book_id())){
            throw new RuntimeException("WishList Not Created");
        }

        WishList wl = repository.findByUserIdAndBookId(data.user_id(), data.book_id());
        wl.setNotification(data.notification());
        repository.save(wl);
    }

    @Override
    public void removeFromWishList(DatasForWishListDTO data) {
        if(!repository.existsByUserIdAndBookId(data.user_id(), data.book_id())){
            throw new RuntimeException("WishList Not Created");
        }

        WishList wl = repository.findByUserIdAndBookId(data.user_id(), data.book_id());
        repository.delete(wl);
    }
}
