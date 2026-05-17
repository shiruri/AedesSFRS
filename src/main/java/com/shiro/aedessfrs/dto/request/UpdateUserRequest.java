package com.shiro.aedessfrs.dto.request;

import com.shiro.aedessfrs.model.User;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.util.UUID;


public record UpdateUserRequest(
        UUID id,

        @Size(max = 50)
        String name,


        @Size(max = 255)
        String password,

        @Email
        @Size(max = 100)
        String email,

        @Enumerated(EnumType.STRING)
        User.Role role
) {

}
