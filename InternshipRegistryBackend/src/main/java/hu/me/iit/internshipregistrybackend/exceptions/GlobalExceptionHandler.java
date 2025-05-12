package hu.me.iit.internshipregistrybackend.exceptions;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.util.HashMap;
import java.util.Map;

@ControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(AppException.class)
    public ResponseEntity<Object> handleAppException(AppException ex) {
        Map<String, Object> body = new HashMap<>();
        body.put("message", ex.getMessage());
        body.put("status", ex.getStatus().value());
        return new ResponseEntity<>(body, ex.getStatus());
    }
}
