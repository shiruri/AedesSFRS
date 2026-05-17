package com.shiro.aedessfrs.service;

import com.shiro.aedessfrs.dto.request.UpdateUserRequest;
import com.shiro.aedessfrs.dto.response.ImportErrors;
import com.shiro.aedessfrs.dto.response.ImportResult;
import com.shiro.aedessfrs.dto.response.UserResponse;
import com.shiro.aedessfrs.exception.NoSuchUserFoundException;
import com.shiro.aedessfrs.mapper.UserMapper;
import com.shiro.aedessfrs.model.User;
import com.shiro.aedessfrs.repository.UserRepository;
import jakarta.validation.ConstraintViolation;
import org.apache.poi.ss.usermodel.*;

import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.context.annotation.Import;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.validation.Validator;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final Validator validator;

    @Transactional(readOnly = true)
    public Page<UserResponse> getUsers(Pageable pageable) {
        return userRepository.findAllUsers(pageable);
    }

    @Transactional
    public void updateUser(UpdateUserRequest req) {
        if (req.id() == null) {
            throw new NoSuchUserFoundException("User with id " + req.id() + " does not exist");
        }

        userRepository.updateUser(req.id(), req.name(), req.email());

    }

    @Transactional
    public void deleteUser(UUID id) {
        userRepository.deleteById(id);
    }

    @Transactional(readOnly = true)
    public UserResponse getUserById(UUID id) {
        return userMapper.toDto(userRepository.findById(id).orElseThrow(
                () -> new NoSuchUserFoundException("No User Found with given ID")
        ));
    }


}

