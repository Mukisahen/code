-- Secure Eye demo seed data — Berecah Primary School, Namataba, Mukono District
-- Password for ALL demo accounts below is: SecureEye@2026 (except the scanner kiosk, see note)
-- Hashes are bcrypt (cost 12) placeholders — regenerate with backend/scripts/hash_password.php before real use.

USE secure_eye;

INSERT INTO schools (id, name, district, address) VALUES
    (1, 'Berecah Primary School', 'Mukono District', 'Namataba, Mukono District, Uganda');

-- password_hash values below are bcrypt('SecureEye@2026') / bcrypt('scan123')
-- generate real hashes locally: php backend/scripts/hash_password.php SecureEye@2026
INSERT INTO users (id, school_id, name, email, password_hash, role, phone) VALUES
    (1, 1, 'Admin User',        'admin@berecah.ug',        '$2y$12$REPLACE_WITH_REAL_BCRYPT_HASH', 'admin', '+256700000001'),
    (2, 1, 'Coordinator User',  'coordinator@berecah.ug',  '$2y$12$REPLACE_WITH_REAL_BCRYPT_HASH', 'coordinator', '+256700000002'),
    (3, 1, 'Peter Ssebunya',    'peter@berecah.ug',        '$2y$12$REPLACE_WITH_REAL_BCRYPT_HASH', 'driver', '+256700000003'),
    (4, 1, 'Jane Nakato',       'jane@example.com',        '$2y$12$REPLACE_WITH_REAL_BCRYPT_HASH', 'parent', '+256700000004'),
    (5, 1, 'Bus Gate Scanner',  'scanner@berecah.sc.ug',   '$2y$12$REPLACE_WITH_REAL_BCRYPT_HASH', 'scanner', NULL);

INSERT INTO drivers (id, user_id, license_no) VALUES
    (1, 3, 'DL-UG-00931');

INSERT INTO parents (id, user_id, notify_sms, notify_push) VALUES
    (1, 4, 1, 1);

INSERT INTO vehicles (id, school_id, plate_number, capacity, driver_id, gps_device_id) VALUES
    (1, 1, 'UBH 214K', 33, 1, 'GPS-DEV-001'),
    (2, 1, 'UBH 215K', 33, NULL, 'GPS-DEV-002'),
    (3, 1, 'UBH 216K', 33, NULL, 'GPS-DEV-003'),
    (4, 1, 'UBH 217K', 33, NULL, 'GPS-DEV-004'),
    (5, 1, 'UBH 218K', 33, NULL, 'GPS-DEV-005'),
    (6, 1, 'UBH 219K', 33, NULL, 'GPS-DEV-006');

INSERT INTO routes (id, school_id, name, schedule_time, vehicle_id) VALUES
    (1, 1, 'Route A — Namataba Central', '06:45:00', 1),
    (2, 1, 'Route B — Mukono Town',       '06:50:00', 2),
    (3, 1, 'Route C — Seeta Road',        '06:40:00', 3);

INSERT INTO route_stops (route_id, stop_name, sequence_no, lat, lng) VALUES
    (1, 'Namataba Trading Centre', 1, 0.3654, 32.7621),
    (1, 'Berecah Primary School',  2, 0.3701, 32.7580),
    (2, 'Mukono Town Stage',       1, 0.3533, 32.7553),
    (2, 'Berecah Primary School',  2, 0.3701, 32.7580),
    (3, 'Seeta Road Junction',     1, 0.3611, 32.7702),
    (3, 'Berecah Primary School',  2, 0.3701, 32.7580);

-- Sample students (a subset of the 247 tracked at the pilot school)
INSERT INTO students (school_id, rfid_uid, full_name, class, route_id, parent_id) VALUES
    (1, '04A1B2C3D4', 'Grace Nakato',     'P4', 1, 1),
    (1, '04E5F6A7B8', 'David Mukisa',     'P3', 1, NULL),
    (1, '04C9D0E1F2', 'Sarah Namutebi',   'P5', 2, NULL),
    (1, '04G3H4I5J6', 'Joseph Kato',      'P2', 2, NULL),
    (1, '04K7L8M9N0', 'Esther Nabirye',   'P6', 3, NULL),
    (1, '04O1P2Q3R4', 'Isaac Ssempa',     'P1', 3, NULL);
