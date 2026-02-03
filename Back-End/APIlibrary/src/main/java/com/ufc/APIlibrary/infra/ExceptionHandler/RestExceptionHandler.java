package com.ufc.APIlibrary.infra.ExceptionHandler;

import com.ufc.APIlibrary.infra.exceptions.book.BookNotFoundException;
import com.ufc.APIlibrary.infra.exceptions.book.InvalidRatingException;
import com.ufc.APIlibrary.infra.exceptions.book.uniqueness.IsbnAlreadyExistsException;
import com.ufc.APIlibrary.infra.exceptions.book.IsbnNotAvailableException;
import com.ufc.APIlibrary.infra.exceptions.book.uniqueness.WishListAlreadyExistsException;
import com.ufc.APIlibrary.infra.exceptions.user.ExpiredTokenException;
import com.ufc.APIlibrary.infra.exceptions.user.InvalidPasswordException;
import com.ufc.APIlibrary.infra.exceptions.user.LockedAccountException;
import com.ufc.APIlibrary.infra.exceptions.user.InvalidTokenException;
import com.ufc.APIlibrary.infra.exceptions.user.RatingNotFoundException;
import com.ufc.APIlibrary.infra.exceptions.user.RegisterErrorException;
import com.ufc.APIlibrary.infra.exceptions.user.UserNotFoundException;
import com.ufc.APIlibrary.infra.exceptions.user.WishListNotFoundException;
import com.ufc.APIlibrary.infra.exceptions.user.LastAdminException;
import com.ufc.APIlibrary.infra.exceptions.user.uniqueness.EmailAlreadyExistsException;
import com.ufc.APIlibrary.infra.exceptions.user.uniqueness.PhoneNumberAlreadyExistsException;
import com.ufc.APIlibrary.infra.exceptions.user.uniqueness.UsernameAlreadyExistsException;
import com.ufc.APIlibrary.infra.exceptions.book.BookNotAvailableException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

@ControllerAdvice
public class RestExceptionHandler extends ResponseEntityExceptionHandler {

    @ExceptionHandler(EmailAlreadyExistsException.class)
    public ResponseEntity<FormaterRestException> emailAlreadyExists(EmailAlreadyExistsException exception) {
        FormaterRestException response = new FormaterRestException(HttpStatus.CONFLICT, exception.getMessage());
        return ResponseEntity.status(HttpStatus.CONFLICT).body(response);
    }

    @ExceptionHandler(PhoneNumberAlreadyExistsException.class)
    public ResponseEntity<FormaterRestException> phoneAlreadyExists(PhoneNumberAlreadyExistsException exception) {
        FormaterRestException response = new FormaterRestException(HttpStatus.CONFLICT, exception.getMessage());
        return ResponseEntity.status(HttpStatus.CONFLICT).body(response);
    }

    // TRATAMENTO DE EXCESSÕES ACERCA DAS VALIDAÇÕES DOS DTO'S
    @Override
    protected ResponseEntity<Object> handleMethodArgumentNotValid(
            MethodArgumentNotValidException ex,
            org.springframework.http.HttpHeaders headers,
            org.springframework.http.HttpStatusCode status,
            org.springframework.web.context.request.WebRequest request) {

        String errorMessage = ex.getBindingResult().getFieldErrors().get(0).getDefaultMessage();
        FormaterRestException response = new FormaterRestException(HttpStatus.BAD_REQUEST, errorMessage);

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }

    // TRATAMENTO DE EXCESSÕES ACERCA DAS FUNÇÕES DO CONTROLLER 'USERCONTROLLER'

    @ExceptionHandler(LockedAccountException.class)
    public ResponseEntity<FormaterRestException> lockedAccountHandler(LockedAccountException exception) {
        FormaterRestException response = new FormaterRestException(HttpStatus.LOCKED, exception.getMessage());
        return ResponseEntity.status(HttpStatus.LOCKED).body(response);
    }

    @ExceptionHandler(AuthenticationException.class)
    public ResponseEntity<FormaterRestException> authErrorHandler(AuthenticationException exception) {
        FormaterRestException response = new FormaterRestException(HttpStatus.FORBIDDEN,"Email ou senha inválidos");
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(response);
    }

    @ExceptionHandler(InvalidPasswordException.class)
    public ResponseEntity<FormaterRestException> invalidPasswordHandler(InvalidPasswordException exception) {
        FormaterRestException response = new FormaterRestException(HttpStatus.BAD_REQUEST, exception.getMessage());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }

    @ExceptionHandler(RegisterErrorException.class)
    public ResponseEntity<FormaterRestException> registerErrorHandler(RegisterErrorException exception) {
        FormaterRestException response = new FormaterRestException(HttpStatus.INTERNAL_SERVER_ERROR,
                exception.getMessage());
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
    }

    @ExceptionHandler(UserNotFoundException.class)
    public ResponseEntity<FormaterRestException> userNotFoundHandler(UserNotFoundException exception) {
        FormaterRestException response = new FormaterRestException(HttpStatus.NOT_FOUND, exception.getMessage());
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
    }

        @ExceptionHandler(UsernameAlreadyExistsException.class)
    public ResponseEntity<FormaterRestException> usernameAlreadyExistsHandler(UsernameAlreadyExistsException exception) {
        FormaterRestException response = new FormaterRestException(HttpStatus.CONFLICT, exception.getMessage());
        return ResponseEntity.status(HttpStatus.CONFLICT).body(response);
    }

    @ExceptionHandler(RatingNotFoundException.class)
    public ResponseEntity<FormaterRestException> ratingNotFoundHandler(RatingNotFoundException exception) {
        FormaterRestException response = new FormaterRestException(HttpStatus.NOT_FOUND, exception.getMessage());
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
    }

    @ExceptionHandler(WishListNotFoundException.class)
    public ResponseEntity<FormaterRestException> wishlistNotFoundHandler(WishListNotFoundException exception) {
        FormaterRestException response = new FormaterRestException(HttpStatus.NOT_FOUND, exception.getMessage());
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
    }

        @ExceptionHandler(LastAdminException.class)
    public ResponseEntity<FormaterRestException> lastAdminHandler(LastAdminException exception) {
        FormaterRestException response = new FormaterRestException(HttpStatus.NOT_FOUND, exception.getMessage());
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
    }

    // TRATAMENTO DE EXCESSÕES ACERCA DAS FUNÇÕES DO CONTROLLER 'BOOKCONTROLLER'

    @ExceptionHandler(IsbnAlreadyExistsException.class)
    public ResponseEntity<FormaterRestException> isbnAlreadyExistsHandler(IsbnAlreadyExistsException exception) {
        FormaterRestException response = new FormaterRestException(HttpStatus.CONFLICT, exception.getMessage());
        return ResponseEntity.status(HttpStatus.CONFLICT).body(response);
    }

       @ExceptionHandler(IsbnNotAvailableException.class)
    public ResponseEntity<FormaterRestException> isbnNotAvailableHandler(IsbnNotAvailableException exception) {
        FormaterRestException response = new FormaterRestException(HttpStatus.BAD_REQUEST, exception.getMessage());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }

    @ExceptionHandler(BookNotAvailableException.class)
    public ResponseEntity<FormaterRestException> bookNotAvailableHandler(BookNotAvailableException exception) {
        FormaterRestException response = new FormaterRestException(HttpStatus.BAD_REQUEST, exception.getMessage());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }

    @ExceptionHandler(BookNotFoundException.class)
    public ResponseEntity<FormaterRestException> bookNotFound(BookNotFoundException ex) {
        FormaterRestException response = new FormaterRestException(HttpStatus.NOT_FOUND, ex.getMessage());
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
    }

    @ExceptionHandler(InvalidRatingException.class)
    public ResponseEntity<FormaterRestException> invalidRating(InvalidRatingException ex) {
        FormaterRestException response = new FormaterRestException(HttpStatus.BAD_REQUEST, ex.getMessage());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }

    // TRATAMENTO DE EXCESSÕES ACERCA DAS FUNÇÕES DO CONTROLLER 'WISHLISTCONTROLLER'

    @ExceptionHandler(WishListAlreadyExistsException.class)
    public ResponseEntity<FormaterRestException> wishlistAlreadyExists(WishListAlreadyExistsException ex) {
        FormaterRestException response = new FormaterRestException(HttpStatus.CONFLICT, ex.getMessage());
        return ResponseEntity.status(HttpStatus.CONFLICT).body(response);
    }

    // TRATAMENTO DE EXCESSÕES ACERCA DAS FUNÇÕES DO TOKEN DE RECUPERAÇÃO DE SENHA

    @ExceptionHandler(InvalidTokenException.class)
    public ResponseEntity<FormaterRestException> invalidTokenHandler(InvalidTokenException exception) {
        FormaterRestException response = new FormaterRestException(HttpStatus.BAD_REQUEST, exception.getMessage());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }

    @ExceptionHandler(ExpiredTokenException.class)
    public ResponseEntity<FormaterRestException> expiredTokenHandler(ExpiredTokenException exception) {
        FormaterRestException response = new FormaterRestException(HttpStatus.UNAUTHORIZED, exception.getMessage());
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
    }

}
