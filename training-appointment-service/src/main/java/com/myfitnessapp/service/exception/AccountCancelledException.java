package com.myfitnessapp.service.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.FORBIDDEN)
public class AccountCancelledException extends RuntimeException {
    public AccountCancelledException(String message) {
        super(message);
    }
}
