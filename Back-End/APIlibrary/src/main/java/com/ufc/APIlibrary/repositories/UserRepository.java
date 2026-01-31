package com.ufc.APIlibrary.repositories;

import com.ufc.APIlibrary.domain.User.User;
import com.ufc.APIlibrary.domain.User.UserRoles;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Repository;
import java.util.Optional;

import java.util.List;

@Repository
public interface UserRepository extends JpaRepository<User, Integer> {
    UserDetails findByEmail(String email);

    @Query("SELECT u FROM User u WHERE u.email = :email")
    java.util.Optional<User> findUserByEmail(@org.springframework.data.repository.query.Param("email") String email);

    @Query("SELECT u FROM User u WHERE u.phone_number = :phoneNumber")
    java.util.Optional<User> findByPhoneNumber(
            @org.springframework.data.repository.query.Param("phoneNumber") String phoneNumber);

    @Query("SELECT COUNT(u) > 0 FROM User u WHERE u.email = :email")
    boolean existsByEmail(@org.springframework.data.repository.query.Param("email") String email);

    @Query("SELECT COUNT(u) > 0 FROM User u WHERE u.phone_number = :phoneNumber")
    boolean existsByPhoneNumber(@org.springframework.data.repository.query.Param("phoneNumber") String phoneNumber);

    @Query("SELECT COUNT(u) > 0 FROM User u WHERE u.username = :username")
    boolean existsByUsername(
            @org.springframework.data.repository.query.Param("username") String username
    );

    java.util.Optional<User> findByUsername(String username);

    long countByRole(UserRoles role);

    List<User> findByRole(UserRoles role);

    Optional<User> findByResetToken(String resetToken);
}
