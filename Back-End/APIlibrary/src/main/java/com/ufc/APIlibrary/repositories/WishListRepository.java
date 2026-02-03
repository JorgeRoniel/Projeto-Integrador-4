package com.ufc.APIlibrary.repositories;

import com.ufc.APIlibrary.domain.Book.WishList;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface WishListRepository extends JpaRepository<WishList, Integer> {

    List<WishList> findByUserId(Integer UserId);
    boolean existsByUserIdAndBookId(Integer userId, Integer bookId);
    WishList findByUserIdAndBookId(Integer userId, Integer bookId);
    List<WishList> findAllByUserIdAndNotificationTrue(Integer UserId);

    @Query("""
        SELECT COUNT(w)
        FROM WishList w
        WHERE w.user.id = :userId
    """)
    Integer countWishlistByUser(@Param("userId") Integer userId);

    @Query("SELECT wl FROM WishList wl " +
           "JOIN FETCH wl.user u " +
           "JOIN FETCH wl.book b " +
           "WHERE b.acquision_date = :hoje " +
           "AND wl.notification = true")
    List<WishList> findToNotify(@Param("hoje") LocalDate hoje);
}
