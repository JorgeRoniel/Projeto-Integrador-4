package com.ufc.APIlibrary.infra.security;

import com.ufc.APIlibrary.repositories.UserRepository;
import com.ufc.APIlibrary.services.token.TokenService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class SecurityFilter extends OncePerRequestFilter {

    @Autowired
    private TokenService tokenService;
    @Autowired
    private UserRepository repository;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        var token = recoveryToken(request);
        if (token != null) {
            var subject = tokenService.validateToken(token, null);
            try {
                Integer userId = Integer.parseInt(subject);
                UserDetails user = repository.findById(userId).orElse(null);

                if (user != null) {
                    var authorization = new UsernamePasswordAuthenticationToken(user, null, user.getAuthorities());
                    SecurityContextHolder.getContext().setAuthentication(authorization);
                }
            } catch (NumberFormatException e) {
                // Legado: tenta por email se não for número (opcional, mas bom pra transição)
                UserDetails user = repository.findByEmail(subject);
                if (user != null) {
                    var authorization = new UsernamePasswordAuthenticationToken(user, null, user.getAuthorities());
                    SecurityContextHolder.getContext().setAuthentication(authorization);
                }
            }
        }
        filterChain.doFilter(request, response);
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) throws ServletException {
        String path = request.getRequestURI();
        return path.startsWith("/swagger-ui")
                || path.startsWith("/v3/api-docs")
                || path.startsWith("/api/user/login")
                || path.startsWith("/api/user/register")
                || path.startsWith("/api/user/recover-password")
                || path.startsWith("/api/user/reset-password-final")
                || request.getMethod().equalsIgnoreCase("OPTIONS");
    }

    private String recoveryToken(HttpServletRequest request) {
        var authHeader = request.getHeader("Authorization");
        if (authHeader == null) {
            return null;
        }
        return authHeader.replace("Bearer ", "");
    }
}
