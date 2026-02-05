package com.ufc.APIlibrary.repositories;

import com.ufc.APIlibrary.domain.Book.WishList;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

@Repository
public interface WishListRepository extends JpaRepository<WishList, Integer> {

    @Query("""
                SELECT w FROM WishList w
                JOIN w.book b
                WHERE w.user.id = :userId
                AND (:search IS NULL OR TRIM(:search) = '' OR
                    LOWER(b.title) LIKE LOWER(CONCAT('%', :search, '%')) OR
                    LOWER(b.author) LIKE LOWER(CONCAT('%', :search, '%')) OR
                    EXISTS (SELECT cat FROM b.category cat WHERE LOWER(cat) LIKE LOWER(CONCAT('%', :search, '%'))))
            """)
    Page<WishList> findByUserIdWithSearch(
            @Param("userId") Integer userId,
            @Param("search") String search,
            Pageable pageable);

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
