package com.shiro.aedessfrs.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record LoginUserRequest(
        @NotBlank
        @Email
        @Size(max = 100)
        String login
        ,
        @NotBlank
        @Size(max = 255)
        String password) {
}
