-- Secure Eye demo seed data — Berecah Primary School, Kiira Municipality,
-- Wakiso District (matches the final year project report, Appendix B).
--
-- Demo credentials (see README for the full table):
--   admin@berecah.sc.ug        / mhuks            (School Admin — Mukisa Henry)
--   coordinator@berecah.sc.ug  / SecureEye@2026    (Coordinator — Ibrahim Kato)
--   baker@berecah.sc.ug        / SecureEye@2026    (Driver — Baker Mugisha)
--   clovis@berecah.sc.ug       / SecureEye@2026    (Driver — Clovis Ssebastian)
--   moses@berecah.sc.ug        / SecureEye@2026    (Driver — Moses Kiggundu)
--   jane@example.com           / SecureEye@2026    (Parent — Jane Mukasa)
--   kiosk@berecah.sc.ug        / scan123           (RFID Kiosk)
--
-- Hashes below are real bcrypt (cost 12) digests of the demo passwords above,
-- generated with backend/scripts/hash_password.php. Rotate them (and every
-- password) before using this project anywhere but a local/offline demo —
-- these are published in the project report and are not secret.

USE secureeye_db;

INSERT INTO schools (id, name, district, address) VALUES
    (1, 'Berecah Primary School', 'Wakiso District', 'Kiira Municipality, Wakiso District, Uganda');

INSERT INTO users (id, school_id, name, email, password_hash, role, phone) VALUES
    (1, 1, 'Mukisa Henry',        'admin@berecah.sc.ug',       '$2y$12$2J/REnA6ksIBlPB/7tgpEOMyiXBpCJl2R01jELJF1UB9z1ifVuBzO', 'admin', '+256700000001'),
    (2, 1, 'Ibrahim Kato',        'coordinator@berecah.sc.ug', '$2y$12$/hK1Xi7LvfyNuke6Zg6apeL.DVn0SyWHbVFbG6ROvMierjtbIUCKi', 'coordinator', '+256700000002'),
    (3, 1, 'Baker Mugisha',       'baker@berecah.sc.ug',       '$2y$12$/hK1Xi7LvfyNuke6Zg6apeL.DVn0SyWHbVFbG6ROvMierjtbIUCKi', 'driver', '+256700000003'),
    (4, 1, 'Clovis Ssebastian',   'clovis@berecah.sc.ug',      '$2y$12$/hK1Xi7LvfyNuke6Zg6apeL.DVn0SyWHbVFbG6ROvMierjtbIUCKi', 'driver', '+256700000004'),
    (5, 1, 'Moses Kiggundu',      'moses@berecah.sc.ug',       '$2y$12$/hK1Xi7LvfyNuke6Zg6apeL.DVn0SyWHbVFbG6ROvMierjtbIUCKi', 'driver', '+256700000005'),
    (6, 1, 'Jane Mukasa',         'jane@example.com',          '$2y$12$/hK1Xi7LvfyNuke6Zg6apeL.DVn0SyWHbVFbG6ROvMierjtbIUCKi', 'parent', '+256700000006'),
    (7, 1, 'RFID Kiosk',          'kiosk@berecah.sc.ug',       '$2y$12$4/cRQX6KkCnlV7b1h2EIEO90ruFaV3yCKtwv21c.Y4bRiFZkkUKVq', 'scanner', NULL);

INSERT INTO drivers (id, user_id, license_no) VALUES
    (1, 3, 'DL-UG-00931'),
    (2, 4, 'DL-UG-00932'),
    (3, 5, 'DL-UG-00933');

INSERT INTO parents (id, user_id, notify_sms, notify_push) VALUES
    (1, 6, 1, 1);

INSERT INTO vehicles (id, school_id, plate_number, capacity, driver_id, gps_device_id) VALUES
    (1, 1, 'UBH 214K', 33, 1, 'GPS-DEV-001'),
    (2, 1, 'UBH 215K', 33, 2, 'GPS-DEV-002'),
    (3, 1, 'UBH 216K', 33, 3, 'GPS-DEV-003'),
    (4, 1, 'UBH 217K', 33, NULL, 'GPS-DEV-004'),
    (5, 1, 'UBH 218K', 33, NULL, 'GPS-DEV-005'),
    (6, 1, 'UBH 219K', 33, NULL, 'GPS-DEV-006');

INSERT INTO routes (id, school_id, name, schedule_time, vehicle_id) VALUES
    (1, 1, 'Route A — Kiira Central', '06:45:00', 1),
    (2, 1, 'Route B — Wakiso Town',   '06:50:00', 2),
    (3, 1, 'Route C — Namugongo Road', '06:40:00', 3);

INSERT INTO route_stops (route_id, stop_name, sequence_no, lat, lng) VALUES
    (1, 'Kiira Town Centre',       1, 0.3986, 32.6656),
    (1, 'Berecah Primary School',  2, 0.4021, 32.6610),
    (2, 'Wakiso Town Stage',       1, 0.4044, 32.4593),
    (2, 'Berecah Primary School',  2, 0.4021, 32.6610),
    (3, 'Namugongo Road Junction', 1, 0.3667, 32.6944),
    (3, 'Berecah Primary School',  2, 0.4021, 32.6610);

-- Sample students (a subset of the 247 tracked at the pilot school).
-- Alice and Joseph are Jane Mukasa's children, matching the report's UAT
-- scenarios (getMyChildren() test: "Alice + Joseph returned"). Card UIDs
-- match the report's own test data: A3B4C5D6 was assigned to Alice per
-- UT06, and 2631743298 is the physical card verified end-to-end in 1.8
-- seconds (UT03 / IT01 / Table 3.6 row 15) — seeded here on Joseph so both
-- of the report's flagship test scans work out of the box.
INSERT INTO students (school_id, rfid_card_uid, full_name, class, route_id, parent_id) VALUES
    (1, 'A3B4C5D6',   'Alice Mukasa',     'P4', 1, 1),
    (1, '2631743298', 'Joseph Mukasa',    'P2', 1, 1),
    (1, '04C9D0E1F2', 'Sarah Namutebi',   'P5', 2, NULL),
    (1, '04G3H4I5J6', 'David Kato',       'P3', 2, NULL),
    (1, '04K7L8M9N0', 'Esther Nabirye',   'P6', 3, NULL),
    (1, '04O1P2Q3R4', 'Isaac Ssempa',     'P1', 3, NULL);
