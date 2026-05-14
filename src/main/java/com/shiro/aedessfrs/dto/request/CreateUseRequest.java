package com.shiro.aedessfrs.dto.request;


import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;
import org.antlr.v4.runtime.misc.NotNull;

public record CreateUseRequest(
        @NotNull
        @Size(max = 50)
        String username,


        @NotNull
        @Size(max = 255)
        String password,

        @NotNull
        @Email
        @Size(max = 100)
        String email

) {


}
