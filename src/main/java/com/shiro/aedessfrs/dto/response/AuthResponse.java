package com.shiro.aedessfrs.dto.response;

public record AuthResponse(
        UserResponse userResponse,
        String token) {
}
