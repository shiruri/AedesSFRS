package com.shiro.aedessfrs.exception;

public class NoSuchUserFoundException extends RuntimeException {
    public NoSuchUserFoundException(String message) {
        super(message);
    }
}
