package com.ufc.APIlibrary.infra.ExceptionHandler;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import org.springframework.http.HttpStatus;

@AllArgsConstructor
@Getter
@Setter
public class FormaterRestException {

    private HttpStatus status;
    private String message;
}
