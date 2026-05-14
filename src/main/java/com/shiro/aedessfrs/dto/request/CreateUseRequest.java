package com.shiro.aedessfrs.dto.request;


import com.shiro.aedessfrs.model.User;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CreateUseRequest(
        @NotBlank
        @Size(max = 50)
        String name,


        @NotBlank
        @Size(max = 255)
        String password,

        @NotBlank
        @Email
        @Size(max = 100)
        String email,

        @Enumerated(EnumType.STRING)
        User.Role role

) {


}
