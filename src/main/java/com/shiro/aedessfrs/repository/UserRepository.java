package com.shiro.aedessfrs.repository;

import com.shiro.aedessfrs.dto.response.UserResponse;
import com.shiro.aedessfrs.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserRepository extends JpaRepository<User, UUID> {

    @Modifying
    @Query("UPDATE User u SET u.name = :name, u.email = :email WHERE u.id = :id")
    void updateUser(UUID id, String name, String email);

    @Query("SELECT new com.shiro.aedessfrs.dto.response.UserResponse(u.id,u.name,u.email,u.role) FROM User u")
    Page<UserResponse> findAllUsers(Pageable pageable);

    boolean existsByEmail(String email);

    boolean existsById(UUID id);


    boolean existsByName(String name);

    Optional<User> findByNameOrEmail(String name, String email);
}
