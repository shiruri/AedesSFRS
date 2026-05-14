package com.shiro.aedessfrs.dto.request;


import com.shiro.aedessfrs.model.User;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;
import org.antlr.v4.runtime.misc.NotNull;

public record CreateUseRequest(
        @NotNull
        @Size(max = 50)
        String name,


        @NotNull
        @Size(max = 255)
        String password,

        @NotNull
        @Email
        @Size(max = 100)
        String email,

        @Enumerated(EnumType.STRING)
        User.Role role

) {


}
