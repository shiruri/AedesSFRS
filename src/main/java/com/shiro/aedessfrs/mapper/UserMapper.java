package com.shiro.aedessfrs.mapper;

import com.shiro.aedessfrs.dto.request.CreateUseRequest;
import com.shiro.aedessfrs.dto.response.UserResponse;
import com.shiro.aedessfrs.model.User;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface UserMapper {

    User toEntity(CreateUseRequest createUseRequest);

    UserResponse toDto(User user);
}
