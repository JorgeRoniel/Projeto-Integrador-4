package com.ufc.APIlibrary.infra.ExceptionHandler;

import com.ufc.APIlibrary.infra.exceptions.book.BookNotFoundException;
import com.ufc.APIlibrary.infra.exceptions.book.InvalidRatingException;
import com.ufc.APIlibrary.infra.exceptions.book.WishListAlreadyExistsException;
import com.ufc.APIlibrary.infra.exceptions.user.RatingNotFoundException;
import com.ufc.APIlibrary.infra.exceptions.user.RegisterErrorException;
import com.ufc.APIlibrary.infra.exceptions.user.UserNotFoundException;
import com.ufc.APIlibrary.infra.exceptions.user.WishListNotFoundException;
import com.ufc.APIlibrary.infra.exceptions.user.uniqueness.EmailAlreadyExistsException;
import com.ufc.APIlibrary.infra.exceptions.user.uniqueness.PhoneNumberAlreadyExistsException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.AuthenticationException;
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

    // TRATAMENTO DE EXCESSÕES ACERCA DAS FUNÇÕES DO CONTROLLER 'USERCONTROLLER'
    @ExceptionHandler(AuthenticationException.class)
    public ResponseEntity<FormaterRestException> authErrorHandler(AuthenticationException exception) {
        FormaterRestException response = new FormaterRestException(HttpStatus.BAD_REQUEST, exception.getMessage());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }

    @ExceptionHandler(RegisterErrorException.class)
    public ResponseEntity<FormaterRestException> registerError(RegisterErrorException exception) {
        FormaterRestException response = new FormaterRestException(HttpStatus.INTERNAL_SERVER_ERROR,
                exception.getMessage());
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
    }

    @ExceptionHandler(UserNotFoundException.class)
    public ResponseEntity<FormaterRestException> userNotFoundHandler(UserNotFoundException exception) {
        FormaterRestException response = new FormaterRestException(HttpStatus.NOT_FOUND, exception.getMessage());
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
    }

    @ExceptionHandler(RatingNotFoundException.class)
    public ResponseEntity<FormaterRestException> ratingNotFoundHandler(RatingNotFoundException exception) {
        FormaterRestException response = new FormaterRestException(HttpStatus.NOT_FOUND, exception.getMessage());
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
    }

    @ExceptionHandler(WishListNotFoundException.class)
    public ResponseEntity<FormaterRestException> wishlistNotFound(WishListNotFoundException exception) {
        FormaterRestException response = new FormaterRestException(HttpStatus.NOT_FOUND, exception.getMessage());
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
    }

    // TRATAMENTO DE EXCESSÕES ACERCA DAS FUNÇÕES DO CONTROLLER 'BOOKCONTROLLER'

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

}
