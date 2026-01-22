package com.ufc.APIlibrary.infra.ExceptionHandler;

import com.ufc.APIlibrary.infra.exceptions.user.RatingNotFoundException;
import com.ufc.APIlibrary.infra.exceptions.user.RegisterErrorException;
import com.ufc.APIlibrary.infra.exceptions.user.UserNotFoundException;
import com.ufc.APIlibrary.infra.exceptions.user.WishListNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

@ControllerAdvice
public class RestExceptionHandler extends ResponseEntityExceptionHandler {

    // TRATAMENTO DE EXCESSÕES ACERCA DAS FUNÇÕES DO CONTROLLER 'USERCONTROLLER'
    @ExceptionHandler(AuthenticationException.class)
    private ResponseEntity<FormaterRestException> authErrorHandler(AuthenticationException exception){
        FormaterRestException response = new FormaterRestException(HttpStatus.BAD_REQUEST, exception.getMessage());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }

    @ExceptionHandler(RegisterErrorException.class)
    private ResponseEntity<FormaterRestException> registerError(RegisterErrorException exception){
        FormaterRestException response = new FormaterRestException(HttpStatus.INTERNAL_SERVER_ERROR, exception.getMessage());
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
    }

    @ExceptionHandler(UserNotFoundException.class)
    private ResponseEntity<FormaterRestException> userNotFoundHandler(UserNotFoundException exception){
        FormaterRestException response = new FormaterRestException(HttpStatus.NOT_FOUND, exception.getMessage());
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
    }

    @ExceptionHandler(RatingNotFoundException.class)
    private ResponseEntity<FormaterRestException> ratingNotFoundHandler(RatingNotFoundException exception){
        FormaterRestException response = new FormaterRestException(HttpStatus.NOT_FOUND, exception.getMessage());
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
    }

    @ExceptionHandler(WishListNotFoundException.class)
    private ResponseEntity<FormaterRestException> wishlistNotFound(WishListNotFoundException exception){
        FormaterRestException response = new FormaterRestException(HttpStatus.NOT_FOUND, exception.getMessage());
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
    }

    //TRATAMENTO DE EXCESSÕES ACERCA DAS FUNÇÕES DO CONTROLLER 'BOOKCONTROLLER'

    //TRATAMENTO DE EXCESSÕES ACERCA DAS FUNÇÕES DO CONTROLLER 'WISHLISTCONTROLLER'
}
