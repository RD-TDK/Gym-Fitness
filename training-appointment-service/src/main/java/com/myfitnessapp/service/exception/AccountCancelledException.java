package com.myfitnessapp.service.exception;

public class AccountCancelledException extends RuntimeException {
  public AccountCancelledException(String message) {
    super(message);
  }
}
