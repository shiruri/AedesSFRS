package com.shiro.aedessfrs.dto.response;
import com.shiro.aedessfrs.model.User;

import java.util.UUID;

public record UserResponse(
        UUID id,
        String name,
        String email,
        User.Role role
        ,boolean forcedPasswordChange) {


}
