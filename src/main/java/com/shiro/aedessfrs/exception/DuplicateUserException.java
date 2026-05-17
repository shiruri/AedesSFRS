package com.shiro.aedessfrs.exception;

import jakarta.servlet.annotation.HttpConstraint;


public class DuplicateUserException extends RuntimeException {
    public DuplicateUserException(String message) {
        super(message);
    }
}
