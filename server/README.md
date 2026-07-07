# Farm Bhade — Pilot Backend

A Node.js + TypeScript + Express + PostgreSQL (via Prisma) backend for the Farm Bhade
pilot study. Covers auth, marketplace (listings/offers/orders/buyer requests/favorites),
direct + community chat, notifications, AI Crop Doctor (photo upload + heuristic +
curated diagnosis), market prices, real weather (Open-Meteo), and the admin back-office.

## Stack

- **Runtime**: Node.js 22, TypeScript
- **HTTP**: Express 4
- **Database**: PostgreSQL via Prisma ORM
- **Auth**: JWT (30-day bearer token), bcrypt password hashing
- **Uploads**: Multer (memory) → Sharp (resize/compress) → local disk, served statically
- **Validation**: Zod
- **Weather**: [Open-Meteo](https://open-meteo.com) (free, no API key), cached 1 hour per district

## Local development

Requires Node 20+ and a PostgreSQL instance (or use `docker compose up postgres` from this
directory to run just the database).

```bash
cd server
cp .env.example .env      # then edit DATABASE_URL / JWT_SECRET as needed
npm install
npm run prisma:migrate    # creates tables
npm run seed               # loads demo accounts + sample data
npm run dev                 # starts the API on http://localhost:4000
```

Demo accounts (all share the password `Password123`):

| Role | Phone |
|---|---|
| Farmer | +256701234567 |
| Buyer | +256772345678 |
| Processor | +256783456789 |
| Admin | +256700000001 |

## Deploying to a single VPS

This repo ships a `docker-compose.yml` that runs three containers: PostgreSQL, the API,
and [Caddy](https://caddyserver.com) as a reverse proxy with automatic HTTPS.

1. Provision a small VPS (e.g. a $6–12/mo Hetzner or DigitalOcean droplet) with Docker
   and Docker Compose installed, and point a DNS `A` record at it if you have a domain.
2. Copy this `server/` directory to the VPS (e.g. `git clone` the repo there).
3. Create a `.env` file in `server/` with:
   ```
   POSTGRES_PASSWORD=<a strong random password>
   JWT_SECRET=<at least 32 random characters — `openssl rand -base64 48`>
   API_DOMAIN=api.yourdomain.com   # omit to just use the server's IP over HTTP on localhost
   CORS_ORIGIN=https://yourdomain.com   # required — the app refuses to boot with "*" in production
   PUBLIC_UPLOADS_BASE_URL=https://api.yourdomain.com/uploads
   ```
4. Run:
   ```bash
   docker compose up -d --build
   ```
5. Bootstrap the one real supreme admin — **do not run `npm run seed` against this
   database**, it creates every demo account (including an admin) with the public
   password `Password123` and the app refuses to run it when `NODE_ENV=production`:
   ```bash
   docker compose exec \
     -e SUPER_ADMIN_PHONE=+2567XXXXXXXX \
     -e SUPER_ADMIN_PASSWORD='<a long random password, at least 12 chars>' \
     -e SUPER_ADMIN_NAME='Your Name' \
     api npm run create-admin
   ```
6. Caddy automatically requests a Let's Encrypt certificate for `API_DOMAIN` and proxies
   HTTPS traffic to the API container. Database migrations run automatically on container
   start (`prisma migrate deploy`).

To ship a code update: `git pull && docker compose up -d --build`.

### Production hardening already in place

- `NODE_ENV=production` is baked into the API image; on boot the app refuses to start
  if `JWT_SECRET` is under 32 characters or `CORS_ORIGIN` is left as `*`.
- `helmet` sets standard security headers; `express-rate-limit` caps `/auth/register`,
  `/auth/login`, and `/auth/password-reset` at 20 requests per 15 minutes per IP.
  `app.set('trust proxy', 1)` makes that limiter see the real client IP through Caddy.
- The API container has a Docker healthcheck against `GET /health`, and the process
  shuts down gracefully on `SIGTERM`/`SIGINT` (closes the HTTP server, then disconnects
  Prisma) so `docker compose restart`/redeploys don't drop in-flight requests abruptly.
- Demo seed data (`npm run seed`) is blocked outright when `NODE_ENV=production`; the
  only supported way to create an admin in production is `npm run create-admin`
  (above), which creates exactly one supreme admin from env vars you choose yourself.

## API surface

All endpoints are under `/api`. Authenticated endpoints expect `Authorization: Bearer <token>`.

- `POST /auth/register`, `POST /auth/login`, `GET /auth/me`, `POST /auth/password-reset`
- `PATCH /users/me`
- `GET/POST /products`, `GET /products/mine`, `GET/PATCH/DELETE /products/:id`
- `POST /offers`, `GET /offers/mine`, `GET /offers/received`, `PATCH /offers/:id`
- `POST /orders`, `GET /orders/mine`, `GET /orders/selling`, `PATCH /orders/:id/status`
- `GET/POST /buyer-requests`, `GET /buyer-requests/mine`, `PATCH /buyer-requests/:id`
- `GET/POST /favorites`, `DELETE /favorites/:productId`
- `GET /conversations`, `POST /conversations/direct`, `GET /conversations/community`,
  `GET/POST /conversations/:id/messages`
- `GET /notifications`, `PATCH /notifications/:id/read`, `POST /notifications/read-all`
- `POST /crop-doctor/diagnose` (multipart, field `photo`), `GET /crop-doctor/history`
- `GET /market-prices`, `GET /market-prices/trend`, `POST /market-prices` (admin)
- `GET /weather/:district`
- `GET /districts`
- `GET/PATCH /admin/*` (users, listings, verifications, tickets, audit-logs,
  subscriptions, system-health, analytics, overview, assistant) — admin role only
- `POST /admin/admins/:userId` (promote to admin), `DELETE /admin/admins/:userId`
  (revoke admin) — supreme admin only

## Admin hierarchy

Admin accounts can never be created through public registration — the `role`
field there only accepts `farmer` / `buyer` / `processor`. The seed script
creates one **supreme admin** (`+256700000001`, `isSuperAdmin: true`), who is
the only account that can promote another user to `admin` or revoke an
existing admin's access. Admins promoted this way get every other admin
capability but not `isSuperAdmin`, so they cannot manage other admins or act
on the supreme admin's account (change its status, suspend it, revoke it).

## Known limitations (pilot scope)

- **AI Crop Doctor is still simulated.** The server ports the same client-side
  color-histogram heuristic (rejects obviously-not-a-plant photos) and picks a
  random diagnosis from a curated pool — this is *not* a real disease-classification
  model. Swapping in a real vision model (hosted or self-trained, with Luganda-aware
  recommendations) is the next major backend milestone.
- **No SMS/OTP integration.** `POST /auth/password-reset` only checks the phone
  exists; it doesn't send anything. Wiring a real SMS provider (e.g. Africa's
  Talking) is required before this is usable outside the pilot.
- **No payments gateway.** Subscriptions and orders track amounts but there's no
  real billing/payment collection flow yet.
- **Realtime is polling-based**, not WebSockets — simplest and most robust choice
  for rural connectivity during the pilot. Messages/notifications endpoints accept
  a `?since=<ISO timestamp>` query param so clients can poll efficiently. Revisit
  WebSockets post-pilot if instant delivery becomes a real requirement.
- **Auth tokens don't support server-side revocation** (no refresh-token/blocklist
  system) — acceptable for a pilot's scale, but worth adding before wider rollout.
