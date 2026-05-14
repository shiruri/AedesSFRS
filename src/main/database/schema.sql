CREATE DATABASE IF NOT EXISTS facility_db;
USE facility_db;

-- ─────────────────────────────────────────
-- USERS
-- ─────────────────────────────────────────
CREATE TABLE users (
                       user_id    CHAR(36)     PRIMARY KEY DEFAULT (UUID()),
                       name       VARCHAR(100) NOT NULL,
                       email      VARCHAR(150) NOT NULL,
                       password   VARCHAR(255) NOT NULL,
                       role       ENUM('STUDENT','FACULTY','ADMIN') DEFAULT 'STUDENT',
                       created_at TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,

                       CONSTRAINT uq_users_email UNIQUE (email),
                       INDEX idx_users_role (role),
                       INDEX idx_users_created_at (created_at)
);

-- ─────────────────────────────────────────
-- CAMPUS
-- ─────────────────────────────────────────
CREATE TABLE campus (
                        campus_id   CHAR(36)     PRIMARY KEY DEFAULT (UUID()),
                        name        VARCHAR(100) NOT NULL,
                        description TEXT,
                        created_at  TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,

                        INDEX idx_campus_name (name)
);

-- ─────────────────────────────────────────
-- BUILDINGS
-- ─────────────────────────────────────────
CREATE TABLE buildings (
                           building_id CHAR(36)    PRIMARY KEY DEFAULT (UUID()),
                           campus_id   CHAR(36)    NOT NULL,
                           name        VARCHAR(100) NOT NULL,
                           type        VARCHAR(50),
                           floor_count INT          DEFAULT 1,
                           created_at  TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,

                           CONSTRAINT fk_buildings_campus
                               FOREIGN KEY (campus_id) REFERENCES campus(campus_id) ON DELETE CASCADE,

                           INDEX idx_buildings_campus_id (campus_id),
                           INDEX idx_buildings_type      (type)
);

-- ─────────────────────────────────────────
-- ROOMS
-- ─────────────────────────────────────────
CREATE TABLE rooms (
                       room_id        CHAR(36)    PRIMARY KEY DEFAULT (UUID()),
                       building_id    CHAR(36)    NOT NULL,
                       name           VARCHAR(100) NOT NULL,
                       capacity       INT          NOT NULL,
                       type           ENUM('CLASSROOM','LABORATORY','AVR','CONFERENCE','GYM') NOT NULL,
                       has_projector  BOOLEAN      DEFAULT FALSE,
                       has_ac         BOOLEAN      DEFAULT FALSE,
                       has_lab_pcs    BOOLEAN      DEFAULT FALSE,
                       has_whiteboard BOOLEAN      DEFAULT TRUE,
                       is_active      BOOLEAN      DEFAULT TRUE,
                       created_at     TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,

                       CONSTRAINT fk_rooms_building
                           FOREIGN KEY (building_id) REFERENCES buildings(building_id) ON DELETE CASCADE,

                       INDEX idx_rooms_building_id              (building_id),
                       INDEX idx_rooms_type                     (type),
                       INDEX idx_rooms_capacity                 (capacity),
                       INDEX idx_rooms_is_active                (is_active),
    -- Composite: filter active rooms by type + amenities (common query path)
                       INDEX idx_rooms_active_type_amenities    (is_active, type, has_projector, has_ac, has_lab_pcs),
    -- Composite: capacity filter for reservation matching
                       INDEX idx_rooms_active_capacity          (is_active, capacity)
);

-- ─────────────────────────────────────────
-- RESERVATIONS
-- ─────────────────────────────────────────
CREATE TABLE reservations (
                              reservation_id    CHAR(36)     PRIMARY KEY DEFAULT (UUID()),
                              user_id           CHAR(36)     NOT NULL,
                              room_id           CHAR(36),                         -- nullable until assigned
                              datetime_start    DATETIME     NOT NULL,
                              datetime_end      DATETIME     NOT NULL,
                              purpose           VARCHAR(255) NOT NULL,
                              required_capacity INT          NOT NULL,
                              needs_projector   BOOLEAN      DEFAULT FALSE,
                              needs_ac          BOOLEAN      DEFAULT FALSE,
                              needs_lab_pcs     BOOLEAN      DEFAULT FALSE,
                              status            ENUM('PENDING','APPROVED','REJECTED','CANCELLED','COMPLETED')
                    DEFAULT 'PENDING',
                              assigned_by       ENUM('AUTO','ADMIN') DEFAULT 'AUTO',
                              notes             TEXT,
                              created_at        TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,

                              CONSTRAINT fk_reservations_user
                                  FOREIGN KEY (user_id) REFERENCES users(user_id),
                              CONSTRAINT fk_reservations_room
                                  FOREIGN KEY (room_id) REFERENCES rooms(room_id),
                              CONSTRAINT chk_reservation_time
                                  CHECK (datetime_end > datetime_start),            -- guard invalid time ranges

                              INDEX idx_res_user_id                    (user_id),
                              INDEX idx_res_room_id                    (room_id),
                              INDEX idx_res_status                     (status),
    -- Core overlap-detection query: room + time window
                              INDEX idx_res_room_time                  (room_id, datetime_start, datetime_end),
    -- Fetch all reservations for a user ordered by time
                              INDEX idx_res_user_status_time           (user_id, status, datetime_start),
    -- Admin dashboard: pending queue by creation time
                              INDEX idx_res_status_created             (status, created_at)
);

-- ─────────────────────────────────────────
-- SCHEDULE CONFLICT LOG
-- ─────────────────────────────────────────
CREATE TABLE schedule_conflict_log (
                                       log_id          CHAR(36)  PRIMARY KEY DEFAULT (UUID()),
                                       user_id         CHAR(36)  NOT NULL,
                                       attempted_room  CHAR(36)  NOT NULL,
                                       conflict_with   CHAR(36)  NOT NULL,   -- reservation_id that caused the conflict
                                       attempted_start DATETIME  NOT NULL,
                                       attempted_end   DATETIME  NOT NULL,
                                       logged_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

                                       CONSTRAINT fk_conflict_log_user
                                           FOREIGN KEY (user_id)        REFERENCES users(user_id),
                                       CONSTRAINT fk_conflict_log_room
                                           FOREIGN KEY (attempted_room) REFERENCES rooms(room_id),
                                       CONSTRAINT fk_conflict_log_reservation
                                           FOREIGN KEY (conflict_with)  REFERENCES reservations(reservation_id),

                                       INDEX idx_conflict_user_id      (user_id),
                                       INDEX idx_conflict_room_id      (attempted_room),
                                       INDEX idx_conflict_logged_at    (logged_at)
);