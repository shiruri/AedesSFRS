package com.shiro.aedessfrs.controller;


import com.shiro.aedessfrs.dto.request.LoginUserRequest;
import com.shiro.aedessfrs.dto.response.AuthResponse;
import com.shiro.aedessfrs.dto.response.UserResponse;
import com.shiro.aedessfrs.dto.request.CreateUseRequest;
import com.shiro.aedessfrs.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

@RequestMapping("/api/auth")
@RestController
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> registerUser(@Valid @RequestBody CreateUseRequest createUseRequest, BindingResult bindingResult) {
        return ResponseEntity.ok().body(authService.registerUser(createUseRequest));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> loginUser(@Valid @RequestBody LoginUserRequest loginUserRequest, BindingResult bindingResult) {
        return ResponseEntity.ok().body(authService.loginUser(loginUserRequest));
    }

    @PreAuthorize("isAuthenticated()")
    @GetMapping("/me")
    public ResponseEntity<UserResponse> getCurrentUser() {
        return ResponseEntity.ok().body(authService.getCurrentUser());

    }
}
