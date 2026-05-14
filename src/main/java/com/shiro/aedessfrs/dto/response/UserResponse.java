package com.shiro.aedessfrs.dto.response;
import com.shiro.aedessfrs.model.User;

public record UserResponse(
        String username,
        String email,
        User.Role role) {


}
