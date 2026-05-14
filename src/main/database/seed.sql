USE facility_db;

-- ─────────────────────────────────────────
-- USERS
-- ─────────────────────────────────────────
INSERT INTO users (user_id, name, email, password, role) VALUES
                                                             (UUID(), 'Admin User',    'admin@facility.edu',   '$2a$10$xyz...hashedpassword', 'ADMIN'),
                                                             (UUID(), 'Faculty Cruz',  'faculty@facility.edu', '$2a$10$xyz...hashedpassword', 'FACULTY'),
                                                             (UUID(), 'Student Reyes', 'student@facility.edu', '$2a$10$xyz...hashedpassword', 'STUDENT');

-- ─────────────────────────────────────────
-- CAMPUS
-- ─────────────────────────────────────────
INSERT INTO campus (campus_id, name, description) VALUES
    (UUID(), 'Main Campus', 'Primary campus with IT, main, and library buildings');

-- ─────────────────────────────────────────
-- BUILDINGS  (campus_id resolved via subquery)
-- ─────────────────────────────────────────
INSERT INTO buildings (building_id, campus_id, name, type, floor_count)
SELECT UUID(), campus_id, 'IT Building',   'Academic', 3 FROM campus WHERE name = 'Main Campus'
UNION ALL
SELECT UUID(), campus_id, 'Main Building', 'Academic', 4 FROM campus WHERE name = 'Main Campus'
UNION ALL
SELECT UUID(), campus_id, 'Library',       'Library',  2 FROM campus WHERE name = 'Main Campus';

-- ─────────────────────────────────────────
-- ROOMS  (building_id resolved via subquery)
-- ─────────────────────────────────────────
INSERT INTO rooms (room_id, building_id, name, capacity, type, has_projector, has_ac, has_lab_pcs)
SELECT UUID(), building_id, 'Room 101',     40, 'CLASSROOM',  TRUE,  TRUE,  FALSE FROM buildings WHERE name = 'IT Building'
UNION ALL
SELECT UUID(), building_id, 'Room 102',     35, 'CLASSROOM',  TRUE,  FALSE, FALSE FROM buildings WHERE name = 'IT Building'
UNION ALL
SELECT UUID(), building_id, 'Lab 1',        30, 'LABORATORY', TRUE,  TRUE,  TRUE  FROM buildings WHERE name = 'IT Building'
UNION ALL
SELECT UUID(), building_id, 'Lab 2',        30, 'LABORATORY', TRUE,  TRUE,  TRUE  FROM buildings WHERE name = 'IT Building'
UNION ALL
SELECT UUID(), building_id, 'Room 201',     50, 'CLASSROOM',  TRUE,  TRUE,  FALSE FROM buildings WHERE name = 'Main Building'
UNION ALL
SELECT UUID(), building_id, 'AVR',          80, 'AVR',        TRUE,  TRUE,  FALSE FROM buildings WHERE name = 'Main Building'
UNION ALL
SELECT UUID(), building_id, 'Conference A', 20, 'CONFERENCE', TRUE,  TRUE,  FALSE FROM buildings WHERE name = 'Main Building'
UNION ALL
SELECT UUID(), building_id, 'Study Room 1', 15, 'CONFERENCE', FALSE, TRUE,  FALSE FROM buildings WHERE name = 'Library'
UNION ALL
SELECT UUID(), building_id, 'Study Room 2', 15, 'CONFERENCE', FALSE, TRUE,  FALSE FROM buildings WHERE name = 'Library';