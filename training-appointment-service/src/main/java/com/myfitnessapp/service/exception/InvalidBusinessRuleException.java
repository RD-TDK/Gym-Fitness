package com.myfitnessapp.service.exception;

public class InvalidBusinessRuleException extends RuntimeException{
    public InvalidBusinessRuleException(String message) { super(message); }
}
