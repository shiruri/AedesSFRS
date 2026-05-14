package com.shiro.aedessfrs.controller;

import com.shiro.aedessfrs.model.Campus;
import com.shiro.aedessfrs.service.CampusService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("api/campus")
@RequiredArgsConstructor
public class CampusController {

    private final CampusService campusService;

    @GetMapping("")
    public ResponseEntity<List<Campus>> getAllCampus(){
        return null;
    }
}
