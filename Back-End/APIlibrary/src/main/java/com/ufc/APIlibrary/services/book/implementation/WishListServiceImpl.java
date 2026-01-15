package com.ufc.APIlibrary.services.book.implementation;

import com.ufc.APIlibrary.domain.Book.Book;
import com.ufc.APIlibrary.domain.Book.WishList;
import com.ufc.APIlibrary.domain.Book.WishListId;
import com.ufc.APIlibrary.domain.User.User;
import com.ufc.APIlibrary.dto.book.WishListDTO;
import com.ufc.APIlibrary.repositories.BookRepository;
import com.ufc.APIlibrary.repositories.UserRepository;
import com.ufc.APIlibrary.repositories.WishListRepository;
import com.ufc.APIlibrary.services.book.WishListService;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;

public class WishListServiceImpl implements WishListService {

    @Autowired
    private WishListRepository repository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private BookRepository bookRepository;

    @Override
    public void addBookInWL(Integer user_id, Integer book_id) {

        if(repository.existsByUserIdAndBookId(user_id, book_id)){
            throw new RuntimeException("The Book is already in wishlist.");
        }
        User user = userRepository.findById(user_id).orElse(null);
        Book book = bookRepository.findById(book_id).orElse(null);
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
        return wl.stream().map(w -> new WishListDTO(
                w.getBook().getId(),
                w.getBook().getTitle(),
                w.getBook().getAuthor(),
                w.getBook().getPreview_picture(),
                w.getBook().getRating_avg(),
                w.getBook().getCategories(),
                w.getNotification()
        )).toList();
    }

    @Override
    public void updateNotification(Integer user_id, Integer book_id, Boolean notification) {
        if(!repository.existsByUserIdAndBookId(user_id, book_id)){
            throw new RuntimeException("WishList Not Created");
        }

        WishList wl = repository.findByUserIdAndBookId(user_id, book_id);
        wl.setNotification(notification);
        repository.save(wl);
    }

    @Override
    public void removeFromWishList(Integer user_id, Integer book_id) {
        if(!repository.existsByUserIdAndBookId(user_id, book_id)){
            throw new RuntimeException("WishList Not Created");
        }

        WishList wl = repository.findByUserIdAndBookId(user_id, book_id);
        repository.delete(wl);
    }
}
