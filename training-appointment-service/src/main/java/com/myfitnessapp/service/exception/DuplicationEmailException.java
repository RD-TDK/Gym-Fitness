package com.myfitnessapp.service.exception;

public class DuplicationEmailException extends RuntimeException {
    public DuplicationEmailException(String message) {
        super(message);
    }
}
