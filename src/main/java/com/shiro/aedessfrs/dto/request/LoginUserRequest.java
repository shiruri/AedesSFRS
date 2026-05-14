package com.shiro.aedessfrs.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;
import org.antlr.v4.runtime.misc.NotNull;

public record LoginUserRequest(
        @NotNull
        @Email
        @Size(max = 100)
        String login
        ,
        @NotNull
        @Size(max = 255)
        String password) {
}
