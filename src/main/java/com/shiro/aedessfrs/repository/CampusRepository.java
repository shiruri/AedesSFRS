package com.shiro.aedessfrs.repository;

import com.shiro.aedessfrs.model.Campus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface CampusRepository extends JpaRepository<Campus, UUID> {

}
