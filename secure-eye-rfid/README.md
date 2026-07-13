# Secure Eye — RFID and GPS-Based Student Transport Monitoring System

Final Year ICT Project · Project Code 56 · Uganda Institute of Information
and Communications Technology (UICT) · Pilot Institution: Berecah Primary
School, Kiira Municipality, Wakiso District, Uganda · June 2026

School transport safety is a critical concern in Ugandan primary schools.
Secure Eye automates student identification with 13.56 MHz MIFARE RFID cards
at the bus door, records every boarding/alighting event to a MySQL 8
database, and sends real-time notifications to parents.

Full project report: [`docs/ICT_GROUP_56_FINAL.docx`](docs/ICT_GROUP_56_FINAL.docx)

## Declared authors (report Declaration page)

Malinga Edirisa (2024/DCS/WKD/0321) · Kasirye Steven (2024/DCS/WKD/0353) ·
Kigonya Ibrahim (2024/DCS/WKD/0289) · Musinguzi Joel (2024/DITB/EVE/1564) ·
Ogwang Ashiraf (2024/DCS/WKD/0592)

## System personas (used throughout the UI, UAT, and demo data)

| Name | Role | Report reference |
|---|---|---|
| Mukisa Henry | School Administrator | Head Teacher in UAT (Table 3.10) |
| Ibrahim Kato | Transport Coordinator | UAT participant |
| Baker Mugisha | Driver | UAT participant |
| Clovis Ssebastian | Driver | UAT participant |
| Moses Kiggundu | Driver | Referenced in Conclusion (4.1) |
| Jane Mukasa | Parent (children: Alice, Joseph) | UAT participant |

## Architecture

```
Hardware   USB RFID Reader (13.56MHz HID) + MIFARE cards + Windows PC (WampServer)
Frontend   HTML5, Bootstrap 5.3, JavaScript ES6+, Chart.js 4.4 — 5 role-based dashboards
Backend    PHP 8.1 REST API, JWT (HS256) auth, CORS-enabled endpoints
Database   MySQL 8 / MariaDB, 12 tables (schema.sql), PDO with prepared statements
SMS        Africa's Talking (MTN/Airtel) — Phase 2, not yet activated (see below)
Push       Firebase Cloud Messaging — Phase 2, not yet activated
```

Phase 1 hardware cost: **UGX 110,000 (~USD 29)**. Physical RFID scan
verified end-to-end in **1.8 seconds** (target: under 3 seconds).

## Repository layout

```
secure-eye-rfid/
├── docs/
│   └── ICT_GROUP_56_FINAL.docx  # Full final year project report
├── database/
│   ├── schema.sql       # secureeye_db — 12 tables: schools, users, students, vehicles, routes, ...
│   └── seed.sql         # Demo data for Berecah Primary School
├── backend/
│   ├── config/          # DB + JWT + CORS + SMS config (env-driven)
│   ├── lib/              # Jwt, Auth, Response, Audit, Sms helpers
│   ├── middleware/       # CORS
│   ├── api/               # auth, students, vehicles, routes, scan, tracking, notifications, reports
│   ├── scripts/            # hash_password.php CLI helper
│   └── index.php           # front controller / router
└── frontend/
    ├── index.html            # role-based login
    ├── admin-dashboard.html
    ├── coordinator-dashboard.html
    ├── driver-dashboard.html
    ├── parent-dashboard.html
    ├── scanner.html           # RFID kiosk (USB reader acts as a keyboard)
    └── assets/                # shared css/js (api.js is the fetch client)
```

Note: the report's Appendix A references a separate `Mukisahen/secure-eye`
repository. This project currently lives under `secure-eye-rfid/` inside the
`Mukisahen/code` repository instead — update the report's repository link if
you need it to point here.

## Setup (WampServer / any Apache + PHP 8 + MySQL 8 stack)

1. **Database.** In phpMyAdmin or the MySQL CLI:
   ```sql
   SOURCE database/schema.sql;
   SOURCE database/seed.sql;
   ```
   This creates `secureeye_db` and seeds it with the demo accounts below —
   `seed.sql` ships with real bcrypt hashes so the demo logins work
   immediately for local/offline use. Before using this project anywhere
   beyond a local demo, rotate every demo password and regenerate its hash
   with:
   ```
   php backend/scripts/hash_password.php "<new-password>"
   ```
2. **Backend config.** Set environment variables (Apache vhost, `.env`, or
   `php.ini`) before serving:
   ```
   SECUREEYE_DB_HOST=127.0.0.1
   SECUREEYE_DB_NAME=secureeye_db
   SECUREEYE_DB_USER=root
   SECUREEYE_DB_PASS=
   SECUREEYE_JWT_SECRET=<generate a long random string>
   SECUREEYE_CORS_ORIGINS=http://localhost:8080
   ```
   Never commit real secrets — `config.php` only reads from the environment.
3. **Serve the backend** at, e.g., `http://localhost/secure-eye-rfid/backend`
   (Apache `mod_rewrite` must be enabled for `.htaccess` to route `/api/*`
   to `index.php`).
4. **Serve the frontend** as static files. If the API isn't at
   `http://localhost/secure-eye-rfid/backend/api`, set the base URL before
   `api.js` loads:
   ```html
   <script>window.SECURE_EYE_API_BASE = 'http://localhost/secure-eye-rfid/backend/api';</script>
   ```

## Demo logins (report Appendix B)

| Name | Role | Email | Password |
|---|---|---|---|
| Mukisa Henry | School Admin | admin@berecah.sc.ug | mhuks |
| Ibrahim Kato | Coordinator | coordinator@berecah.sc.ug | SecureEye@2026 |
| Baker Mugisha | Driver | baker@berecah.sc.ug | SecureEye@2026 |
| Clovis Ssebastian | Driver | clovis@berecah.sc.ug | SecureEye@2026 |
| Moses Kiggundu | Driver | moses@berecah.sc.ug | SecureEye@2026 |
| Jane Mukasa | Parent | jane@example.com | SecureEye@2026 |
| RFID Kiosk | Kiosk | kiosk@berecah.sc.ug | scan123 |

These credentials are already published in the project report, so they are
not secret — rotate them (see step 1 above) before using this anywhere but a
local/offline demo. The admin demo password (`mhuks`) is intentionally weak,
as printed in the report; treat it as a placeholder only.

## Live demo flow

1. Open `scanner.html`, log in as the RFID Kiosk account.
2. Tap a card (or type an `rfid_card_uid` from `seed.sql` and press Enter —
   a USB RFID reader behaves like a keyboard, so this mirrors real
   hardware). The seeded card `A3B4C5D6` belongs to Alice Mukasa and
   `2631743298` to Joseph Mukasa — the same UIDs used in the report's own
   test cases (UT03, UT06, IT01).
3. Watch the tracking event and parent notification created within seconds.
   Scanning the same student/event again within 2 minutes is rejected as a
   duplicate (FR06).
4. Log in as the linked parent (`jane@example.com`) to see the notification
   arrive in `parent-dashboard.html`.

## Feature status (report Tables 3.6 / 3.7)

**Done:** authentication (JWT + bcrypt), student CRUD with RFID card
assignment and duplicate-card detection, RFID kiosk scanning with duplicate
scan prevention, vehicle + route management, admin/coordinator/driver/parent
dashboards, attendance and fleet-utilisation reports, audit logging.

**Phase 2 / not yet done** (matches the report's own limitations list):
live GPS map from on-bus hardware (Raspberry Pi + RC522 + NEO-6M — Phase 2
BOM not yet procured), Africa's Talking SMS (account registration pending),
Firebase push notifications, driver incident persistence (currently a UI
stub), speed alerts.

## Live map (beyond the report's baseline)

The admin, coordinator, and parent dashboards embed a Leaflet map
(`assets/js/fleet-map.js`) using OpenStreetMap tiles — no API key required.
It plots whatever coordinates are in `vehicles.last_lat/last_lng`, currently
populated by a driver's browser broadcasting its own geolocation (see
`driver-dashboard.html`) rather than the Phase 2 on-bus GPS hardware the
report describes. This goes further than the report's "Not Done" status for
the live map, but it is not a substitute for the NEO-6M-based Phase 2
tracking — remove or ignore it if you need the project to match the report's
feature list exactly.

## Security

- JWT access tokens (15 min) + opaque refresh tokens hashed and stored in
  the `sessions` table (7-day expiry), enabling per-token revocation.
- Passwords hashed with bcrypt, cost factor 12.
- All SQL uses PDO prepared statements — no string-concatenated queries.
- Role-based access control enforced per-endpoint (`Auth::requireRole`).
- Every write/auth action is recorded in `audit_logs` (user, IP, timestamp).

## Known limitations / next steps

- Driver incident reporting is a UI stub — not yet persisted to the database.
- SMS sending via Africa's Talking is wired but disabled by default
  (`SECUREEYE_SMS_ENABLED=false`); enable once you have real API credentials.
- Live GPS tracking from on-bus hardware (Phase 2: Raspberry Pi + RC522 +
  NEO-6M) is not implemented — see "Live map" above for the current
  browser-geolocation stand-in.
- This is a pilot/demo build; harden further (rate limiting, HTTPS
  enforcement, input length limits) before any production rollout beyond
  Berecah Primary School.
