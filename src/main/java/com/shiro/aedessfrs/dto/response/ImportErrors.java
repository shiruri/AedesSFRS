package com.shiro.aedessfrs.dto.response;

public record ImportErrors(
    int rowNumber,
    String field,
    String reason)

{}
