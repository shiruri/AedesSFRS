package com.shiro.aedessfrs.model;


import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "campus")
public class Campus {

    @Id
    @JdbcTypeCode(SqlTypes.VARCHAR)
    @Column(name = "id", length = 36, updatable = false, nullable = false)
    private UUID campusId;

    @PrePersist
    protected void onCreate() {
        if (this.campusId == null) {
            this.campusId = UUID.randomUUID();
        }
        if (this.createdAt == null) {
            this.createdAt = LocalDateTime.now();
        }
    }

    @NotBlank
    @Size(max = 100)
    @Column(unique = true, nullable = false)
    private String campusName;


    @NotBlank
    @Size(max = 300)
    @Column(unique = false, nullable = true)
    private String description;

    @NotBlank
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();}
