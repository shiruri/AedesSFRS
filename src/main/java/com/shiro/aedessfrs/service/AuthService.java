package com.shiro.aedessfrs.service;

import org.springframework.transaction.annotation.Transactional;

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
import lombok.RequiredArgsConstructor;
import org.apache.tomcat.util.http.parser.Authorization;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.UUID;


@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final UserMapper mapper;
    private final JwtUtils jwtUtils;


    public AuthResponse registerUser (CreateUseRequest createUseRequest) {
        if (userRepository.existsByName(createUseRequest.name())) {
            throw new DuplicateUserException("Username is already in use");
        }
        if (userRepository.existsByEmail(createUseRequest.email())) {
            throw new DuplicateUserException("Email is already in use");
        }
        String password = passwordEncoder.encode(createUseRequest.password());
        User user = User.builder()
                .name(createUseRequest.name())
                .email(createUseRequest.email())
                .password(password)
                .role(createUseRequest.role())
                .build();

        User saved = userRepository.save(user);
        String token = jwtUtils.generateToken(saved.getId(),saved.getRole());
        return new AuthResponse(mapper.toDto(saved), token);

    }

    public AuthResponse loginUser (LoginUserRequest loginUserRequest) {
        Optional<User> user = userRepository.findByNameOrEmail(
                loginUserRequest.login(),loginUserRequest.login());

        if(user.isEmpty()) {
            throw new NoSuchUserFoundException("User not found");
        }
        if(!passwordEncoder.matches(loginUserRequest.password(), user.get().getPassword())) {
            throw new MismatchPasswordException("Wrong password");
        }
        String token = jwtUtils.generateToken(user.get().getId(), user.get().getRole());
        return new AuthResponse(mapper.toDto(user.get()),token);
    }
    @Transactional(readOnly = true)
    public UserResponse getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        if (auth == null || auth.getName() == null) {
            throw new InvalidHeaderException("Unauthenticated User");
        }

        UUID userId = UUID.fromString(auth.getName());

        Optional<User> user = userRepository.findById(userId);
        if(user.isEmpty()) {
            throw new NoSuchUserFoundException("User not found");
        }

        return mapper.toDto(user.get());
    }
}
