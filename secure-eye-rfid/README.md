# Secure Eye — RFID & GPS-Based Student Transport Monitoring System

ICT Final Year Project · Berecah Primary School · Namataba, Mukono District · 2026

One tap. Complete visibility. Instant peace of mind. Secure Eye identifies
students via RFID card at the school bus door, tracks vehicles by GPS, and
notifies parents in real time when their child boards or alights.

## Team

Mukisa Henry (System Architect & Admin Backend) · Ibrahim (Database Design &
API Development) · Baker (Frontend Dashboards) · Clovis (Hardware & RFID
Integration) · Moses (Testing, Docs & Presentation)

## Architecture

```
Hardware   USB RFID Reader (13.56MHz) + MIFARE cards + any Windows PC
Frontend   HTML5, Bootstrap 5, Chart.js — 5 role-based dashboards
Backend    PHP 8 REST API, JWT auth, CORS-enabled endpoints
Database   MySQL 8, 12 tables (schema.sql)
SMS        Africa's Talking (MTN/Airtel), optional — falls back to in-app only
```

## Repository layout

```
secure-eye-rfid/
├── database/
│   ├── schema.sql       # 12 tables: schools, users, students, vehicles, routes, ...
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

## Setup (WampServer / any Apache + PHP 8 + MySQL 8 stack)

1. **Database.** In phpMyAdmin or the MySQL CLI:
   ```sql
   SOURCE database/schema.sql;
   ```
2. **Generate real password hashes** — the seed file ships with placeholder
   hashes that will not authenticate. For each demo account, run:
   ```
   php backend/scripts/hash_password.php "SecureEye@2026"
   ```
   and paste the output into `database/seed.sql` (or update the `users` rows
   directly) before running:
   ```sql
   SOURCE database/seed.sql;
   ```
   The RFID kiosk account (`scanner@berecah.sc.ug`) uses password `scan123`
   in the demo script — hash that separately.
3. **Backend config.** Set environment variables (Apache vhost, `.env`, or
   `php.ini`) before serving:
   ```
   SECUREEYE_DB_HOST=127.0.0.1
   SECUREEYE_DB_NAME=secure_eye
   SECUREEYE_DB_USER=root
   SECUREEYE_DB_PASS=
   SECUREEYE_JWT_SECRET=<generate a long random string>
   SECUREEYE_CORS_ORIGINS=http://localhost:8080
   ```
   Never commit real secrets — `config.php` only reads from the environment.
4. **Serve the backend** at, e.g., `http://localhost/secure-eye-rfid/backend`
   (Apache `mod_rewrite` must be enabled for `.htaccess` to route `/api/*`
   to `index.php`).
5. **Serve the frontend** as static files. If the API isn't at
   `http://localhost/secure-eye-rfid/backend/api`, set the base URL before
   `api.js` loads:
   ```html
   <script>window.SECURE_EYE_API_BASE = 'http://localhost/secure-eye-rfid/backend/api';</script>
   ```

## Demo logins

| Role | Email | Password |
|---|---|---|
| Admin | admin@berecah.ug | SecureEye@2026 |
| Coordinator | coordinator@berecah.ug | SecureEye@2026 |
| Driver | peter@berecah.ug | SecureEye@2026 |
| Parent | jane@example.com | SecureEye@2026 |
| RFID Kiosk | scanner@berecah.sc.ug | scan123 |

Regenerate these hashes locally before any real deployment — see step 2 above.

## Live demo flow (matches the presentation)

1. Open `scanner.html`, log in as the kiosk account.
2. Tap a card (or type an `rfid_uid` from `seed.sql` and press Enter — a USB
   RFID reader behaves like a keyboard, so this mirrors real hardware).
3. Watch the tracking event and parent notification created within seconds.
4. Log in as the linked parent (`jane@example.com`) to see the notification
   arrive in `parent-dashboard.html`.

## Security

- JWT access tokens (15 min) + opaque refresh tokens hashed and stored in
  `refresh_tokens` (7-day expiry).
- Passwords hashed with bcrypt, cost factor 12.
- All SQL uses MySQLi prepared statements — no string-concatenated queries.
- Role-based access control enforced per-endpoint (`Auth::requireRole`).
- Every write/auth action is recorded in `audit_logs` (user, IP, timestamp).

## Known limitations / next steps

- Driver incident reporting is a UI stub — not yet persisted to the database.
- SMS sending via Africa's Talking is wired but disabled by default
  (`SECUREEYE_SMS_ENABLED=false`); enable once you have real API credentials.
- No live map (Leaflet/Google Maps) is wired in yet — vehicle coordinates are
  shown as raw lat/lng pending a mapping library integration.
- This is a pilot/demo build for the ICT final year project; harden further
  (rate limiting, HTTPS enforcement, input length limits) before any
  production rollout beyond Berecah Primary School.
