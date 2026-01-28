package com.ufc.APIlibrary.domain.User;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

@Table(name = "users_tb")
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class User implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String username;
    private String name;
    private String email;
    private String password;
    private String phone_number;
    private byte[] profile;
    private UserRoles role;

    public User(String username, String name, String email, String password, String phone_number, byte[] profile,
            UserRoles role) {
        this.username = username;
        this.name = name;
        this.email = email;
        this.password = password;
        this.phone_number = phone_number;
        this.profile = profile;
        this.role = role;
    }

    public User(String username, String name, String email, String password, String phone_number, UserRoles role) {
        this.username = username;
        this.name = name;
        this.email = email;
        this.password = password;
        this.phone_number = phone_number;
        this.role = role;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        if (this.role == UserRoles.ADMIN)
            return List.of(new SimpleGrantedAuthority("ROLE_ADMIN"), new SimpleGrantedAuthority("ROLE_USER"));
        return List.of(new SimpleGrantedAuthority("ROLE_USER"));
    }
}
