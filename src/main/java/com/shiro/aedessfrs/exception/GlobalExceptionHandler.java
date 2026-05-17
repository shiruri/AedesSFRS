package com.shiro.aedessfrs.exception;

import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.nio.file.AccessDeniedException;
import java.time.Instant;
import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiErrorResponse> handleInvalidArgs(MethodArgumentNotValidException
                                                               ex, HttpServletRequest request) {
        ApiErrorResponse errorResponse = new ApiErrorResponse(
                Instant.now()
                ,HttpStatus.BAD_REQUEST.value()
                ,HttpStatus.BAD_REQUEST.getReasonPhrase()
                ,"Validation Failed"
                ,request.getRequestURI()
                ,getErrors(ex));
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
    }

    @ExceptionHandler(DuplicateUserException.class)
    public ResponseEntity<ApiErrorResponse> handleDuplicateUser(DuplicateUserException ex,
                                                                        HttpServletRequest request) {
        ApiErrorResponse errorResponse = new ApiErrorResponse(
                Instant.now()
                , HttpStatus.CONFLICT.value()
                , HttpStatus.CONFLICT.getReasonPhrase()
                , ex.getMessage()
                , request.getRequestURI()
                , null);
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
    }

    @ExceptionHandler(NoSuchUserFoundException.class)
    public ResponseEntity<ApiErrorResponse> handleNoSuchUserFoundException(NoSuchUserFoundException ex,
                                                                 HttpServletRequest request) {
        ApiErrorResponse errorResponse = new ApiErrorResponse(
                Instant.now()
                , HttpStatus.NOT_FOUND.value()
                , HttpStatus.NOT_FOUND.getReasonPhrase()
                , ex.getMessage()
                , request.getRequestURI()
                , null);
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
    }
    @ExceptionHandler(InvalidHeaderException.class)
    public ResponseEntity<ApiErrorResponse> handleInvalidHeaderException(InvalidHeaderException ex,
                                                                            HttpServletRequest request) {
        ApiErrorResponse errorResponse = new ApiErrorResponse(
                Instant.now()
                , HttpStatus.FORBIDDEN.value()
                , HttpStatus.FORBIDDEN.getReasonPhrase()
                , ex.getMessage()
                , request.getRequestURI()
                , null);
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(errorResponse);
    }

    @ExceptionHandler(MismatchPasswordException.class)
    public ResponseEntity<ApiErrorResponse> handleMismatchPasswordException(MismatchPasswordException ex,
                                                                 HttpServletRequest request) {
        ApiErrorResponse errorResponse = new ApiErrorResponse(
                Instant.now()
                , HttpStatus.BAD_REQUEST.value()
                , HttpStatus.BAD_REQUEST.getReasonPhrase()
                , ex.getMessage()
                , request.getRequestURI()
                , null);
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ApiErrorResponse> handleAccessDeniedException(AccessDeniedException ex,
                                                                             HttpServletRequest request) {
        ApiErrorResponse errorResponse = new ApiErrorResponse(
                Instant.now()
                , HttpStatus.UNAUTHORIZED.value()
                , HttpStatus.UNAUTHORIZED.getReasonPhrase()
                , "You are not allowed to access this resource"
                , request.getRequestURI()
                , null);
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(errorResponse);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiErrorResponse> handleGenericException(Exception ex, HttpServletRequest request) {
        log.error("Unhandled exception: {}", ex.getMessage(), ex);
        ApiErrorResponse errorResponse = new ApiErrorResponse(
                Instant.now()
                , HttpStatus.INTERNAL_SERVER_ERROR.value()
                , HttpStatus.INTERNAL_SERVER_ERROR.getReasonPhrase()
                , "An unexpected error occurred"
                , request.getRequestURI()
                , null);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
    }


    private Map<String,String> getErrors(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        ex.getFieldErrors().forEach(error ->
                errors.put(error.getField(), error.getDefaultMessage())
        );
        return errors;
    }

}
