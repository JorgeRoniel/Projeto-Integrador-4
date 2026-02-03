package com.ufc.APIlibrary.services.user.implementations;

import com.ufc.APIlibrary.domain.User.User;
import com.ufc.APIlibrary.domain.User.UserRoles;
import com.ufc.APIlibrary.dto.user.LoginUserDTO;
import com.ufc.APIlibrary.dto.user.RegisterUserDTO;
import com.ufc.APIlibrary.dto.user.ResetPasswordDTO;
import com.ufc.APIlibrary.dto.user.ReturnLoginDTO;
import com.ufc.APIlibrary.dto.user.UpdateUserDTO;
import com.ufc.APIlibrary.infra.exceptions.user.InvalidPasswordException;
import com.ufc.APIlibrary.infra.exceptions.user.InvalidTokenException;
import com.ufc.APIlibrary.infra.exceptions.user.LastAdminException;
import com.ufc.APIlibrary.infra.exceptions.user.RegisterErrorException;
import com.ufc.APIlibrary.infra.exceptions.user.UserNotFoundException;
import com.ufc.APIlibrary.infra.exceptions.user.LockedAccountException;
import com.ufc.APIlibrary.repositories.UserRepository;
import com.ufc.APIlibrary.services.email.EmailService;
import com.ufc.APIlibrary.services.token.TokenService;
import com.ufc.APIlibrary.services.user.UserServices;
import com.ufc.APIlibrary.infra.exceptions.user.uniqueness.EmailAlreadyExistsException;
import com.ufc.APIlibrary.infra.exceptions.user.uniqueness.PhoneNumberAlreadyExistsException;
import com.ufc.APIlibrary.infra.exceptions.user.uniqueness.UsernameAlreadyExistsException;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class UserServicesImpl implements UserServices {

    @Value("${app.frontend.url}")
    private String frontendUrl;

    @Autowired
    private AuthenticationManager authenticationManager;
    @Autowired
    private TokenService tokenService;
    @Autowired
    private UserRepository repository;
    @Autowired
    private PasswordEncoder encoder;
    @Autowired
    private EmailService emailService;

    @Override
    public ReturnLoginDTO login(LoginUserDTO data) {
        User user = (User) repository.findByEmail(data.email());

        if (user != null) {
            if (user.getLockTime() != null && user.getLockTime().plusHours(1).isBefore(LocalDateTime.now())) {
                resetFailedAttempts(user);
            }
            if (!user.isAccountNonLocked()) {
                throw new LockedAccountException();
            }
        }

        try {
            var emailpass = new UsernamePasswordAuthenticationToken(data.email(), data.senha());

            var auth = authenticationManager.authenticate(emailpass);

            User userAutenticado = (User) auth.getPrincipal();
            resetFailedAttempts(userAutenticado);

            String token = tokenService.generateToken(userAutenticado);

            return new ReturnLoginDTO(
                    token,
                    userAutenticado.getId(),
                    userAutenticado.getUsername(),
                    userAutenticado.getName(),
                    userAutenticado.getEmail(),
                    userAutenticado.getProfile(),
                    userAutenticado.getPhone_number(),
                    userAutenticado.getRole().toString());

        } catch (BadCredentialsException e) {
            if (user != null) {
                increaseFailedAttempts(user);
            }
            throw e;
        }

    }

    private void increaseFailedAttempts(User user) {
        int newFailAttempts = user.getFailedAttempt() + 1;
        user.setFailedAttempt(newFailAttempts);

        if (newFailAttempts >= 5) {
            user.setAccountNonLocked(false);
            user.setLockTime(LocalDateTime.now());
        }
        repository.save(user);
    }

    private void resetFailedAttempts(User user) {
        user.setFailedAttempt(0);
        user.setAccountNonLocked(true);
        user.setLockTime(null);
        repository.save(user);
    }

    @Override
    public User register(RegisterUserDTO data) throws RegisterErrorException {
        if (data.senha() == null || data.senha().length() < 6) {
            throw new InvalidPasswordException();
        }

        if (repository.existsByEmail(data.email())) {
            throw new EmailAlreadyExistsException();
        }
        if (repository.existsByPhoneNumber(data.telefone())) {
            throw new PhoneNumberAlreadyExistsException();
        }

        if (repository.existsByUsername(data.username())) {
            throw new UsernameAlreadyExistsException();
        }

        String pass = encoder.encode(data.senha());
        // Constructor expectations: username, name, email, password, phone, role
        User u = new User(data.username(), data.nome(), data.email(), pass, data.telefone(), UserRoles.USER);
        return repository.save(u);
    }

    @Override
    public void updateUser(Integer user_id, UpdateUserDTO data) {

        User user = repository.findById(user_id)
                .orElseThrow(UserNotFoundException::new);

        if (data.senha() != null && !data.senha().isBlank()) {

            if (data.senha().length() < 6) {
                throw new InvalidPasswordException();
            }
            user.setPassword(encoder.encode(data.senha()));
        }

        if (!user.getEmail().equals(data.email())
                && repository.existsByEmail(data.email())) {
            throw new EmailAlreadyExistsException();
        }

        if (!user.getPhone_number().equals(data.telefone())
                && repository.existsByPhoneNumber(data.telefone())) {
            throw new PhoneNumberAlreadyExistsException();
        }

        if (!user.getUsername().equals(data.username())
                && repository.existsByUsername(data.username())) {
            throw new UsernameAlreadyExistsException();
        }

        user.setUsername(data.username());
        user.setName(data.nome());
        user.setEmail(data.email());
        user.setProfile(data.foto());
        user.setPhone_number(data.telefone());

        repository.save(user);
    }

    @Override
    public void deleteUser(Integer user_id) {
        if (repository.existsById(user_id)) {
            repository.deleteById(user_id);
        } else {
            throw new UserNotFoundException();
        }
    }

    @Override
    public void updateUserRole(String username, UserRoles newRole) {

        User user = repository.findByUsername(username)
                .orElseThrow(UserNotFoundException::new);

        if (user.getRole() == newRole) {
            return;
        }

        if (user.getRole() == UserRoles.ADMIN && newRole == UserRoles.USER) {

            long admins = repository.countByRole(UserRoles.ADMIN);

            if (admins <= 1) {
                throw new LastAdminException();
            }
        }

        user.setRole(newRole);
        repository.save(user);
    }

    @Override
    public List<String> listAdminUsernames() {
        return repository.findByRole(UserRoles.ADMIN)
                .stream()
                .map(User::getUsername)
                .toList();
    }

    @Override
    public void recoverPassword(String email) {
        User user = (User) repository.findByEmail(email);
        if (user == null)
            throw new UserNotFoundException();

        String token = tokenService.generatePasswordRecoveryToken(user);

        String recoveryLink = frontendUrl + "/reset-password?token=" + token;

        String corpoEmail = "Olá " + user.getName() + ",\n\n" +
                "Recebemos uma solicitação para redefinir sua senha.\n" +
                "Clique no link abaixo (válido por 15 min):\n" +
                recoveryLink + "\n\n" +
                "Se não foi você, apenas ignore este e-mail.";

        emailService.enviarEmail(user.getEmail(), "Recuperação de Senha", corpoEmail);

    }

    @Override
    public void resetPassword(ResetPasswordDTO data) {
        if (data.senha() == null || data.senha().length() < 6) {
            throw new InvalidPasswordException();
        }

        String subject = tokenService.validateToken(data.token(), "password_recovery");

        if (subject.isEmpty()) {
            throw new InvalidTokenException();
        }

        Integer userId = Integer.parseInt(subject);
        User user = repository.findById(userId)
                .orElseThrow(UserNotFoundException::new);

        user.setPassword(encoder.encode(data.senha()));
        repository.save(user);
    }
}
