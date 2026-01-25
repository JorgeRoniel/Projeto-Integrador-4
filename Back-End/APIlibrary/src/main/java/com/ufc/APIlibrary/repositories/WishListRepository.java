package com.ufc.APIlibrary.repositories;

import com.ufc.APIlibrary.domain.Book.WishList;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WishListRepository extends JpaRepository<WishList, Integer> {

    List<WishList> findByUserId(Integer UserId);
    boolean existsByUserIdAndBookId(Integer userId, Integer bookId);
    WishList findByUserIdAndBookId(Integer userId, Integer bookId);
}
