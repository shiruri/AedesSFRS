package com.shiro.aedessfrs.service;


import com.shiro.aedessfrs.dto.request.CreateUseRequest;
import com.shiro.aedessfrs.dto.request.LoginUserRequest;
import com.shiro.aedessfrs.dto.response.AuthResponse;
import com.shiro.aedessfrs.dto.response.UserResponse;
import com.shiro.aedessfrs.exception.DuplicateUserException;
import com.shiro.aedessfrs.exception.InvalidHeaderException;
import com.shiro.aedessfrs.exception.MismatchPasswordException;
import com.shiro.aedessfrs.exception.NoSuchUserFoundException;
import com.shiro.aedessfrs.mapper.UserMapper;
import com.shiro.aedessfrs.model.User;
import com.shiro.aedessfrs.repository.UserRepository;
import com.shiro.aedessfrs.security.JwtUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.UUID;


@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final UserMapper mapper;
    private final JwtUtils jwtUtils;

    @Autowired
    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, UserMapper mapper, JwtUtils jwtUtils) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.mapper = mapper;
        this.jwtUtils = jwtUtils;
    }

    public AuthResponse registerUser (CreateUseRequest createUseRequest) {

        if (userRepository.existsByUsername(createUseRequest.username())) {
            throw new DuplicateUserException("Username is already in use");
        }
        if (userRepository.existsByEmail(createUseRequest.email())) {
            throw new DuplicateUserException("Email is already in use");
        }
        User user = new User();
        user.setUsername(createUseRequest.username());
        user.setEmail(createUseRequest.email());
        user.setPasswordHash(passwordEncoder.encode(createUseRequest.password()));
        User saved = userRepository.save(user);
        String token = jwtUtils.generateToken(saved.getId());
        return new AuthResponse(mapper.toDto(saved), token);

    }

    public AuthResponse loginUser (LoginUserRequest loginUserRequest) {
        Optional<User> user = userRepository.findByUsernameOrEmail(
                loginUserRequest.login(),loginUserRequest.login());

        if(user.isEmpty()) {
            throw new NoSuchUserFoundException("User not found");
        }
        if(!passwordEncoder.matches(loginUserRequest.password(), user.get().getPasswordHash())) {
            throw new MismatchPasswordException("Wrong password");
        }
        String token = jwtUtils.generateToken(user.get().getId());
        return new AuthResponse(mapper.toDto(user.get()),token);
    }

    public UserResponse getCurrentUser(String token) {
        if(token.isBlank()) {
            throw new InvalidHeaderException("No logged in user");
        }
        UUID userId = UUID.fromString(jwtUtils.extractUserId(token));

        Optional<User> user = userRepository.findById(userId);
        if(user.isEmpty()) {
            throw new NoSuchUserFoundException("User not found");
        }

        return mapper.toDto(user.get());
    }
}
