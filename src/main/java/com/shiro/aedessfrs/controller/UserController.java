package com.shiro.aedessfrs.controller;

import com.shiro.aedessfrs.dto.request.UpdateUserRequest;
import com.shiro.aedessfrs.dto.response.ImportResult;
import com.shiro.aedessfrs.dto.response.UserResponse;
import com.shiro.aedessfrs.model.User;
import com.shiro.aedessfrs.service.UserService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import lombok.RequiredArgsConstructor;
import org.apache.coyote.Response;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.UUID;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("")
    public Page<UserResponse> getUsers(Pageable  pageable) {
        return userService.getUsers(pageable);
    }

    @PreAuthorize("isAuthenticated()")
    @PatchMapping("/update")
    public void updateUser(@Valid @RequestBody UpdateUserRequest req) {
        userService.updateUser(req);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/delete/{id}")
    public ResponseEntity deleteUser(@PathVariable UUID id) {
        userService.deleteUser(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserResponse> getUserById(@PathVariable UUID id) {
        return ResponseEntity.ok().body(userService.getUserById(id));
    }

    @PostMapping("/password-change")
    public ResponseEntity<UserResponse> changePassword(@Req) {

    }

}
