# Farm Bhade — From Seed to Market

Farm Bhade is an AI-powered digital maize ecosystem for Uganda, guiding farmers from
planning through growing, harvesting, storage, selling and processing — with a
trusted marketplace, AI Crop Doctor, live market prices and weather forecasts.

The frontend is a Progressive Web App built with React, TypeScript and Tailwind
CSS, backed by a real Node/Express/Prisma API (see [`server/`](./server)). It's
also packaged as a sideloadable Android APK via Capacitor — see below.

## Tech stack

- React 19 + TypeScript
- Vite
- Tailwind CSS v4 (Material Design 3-inspired token system)
- React Router
- Progressive Web App (installable, offline-ready)

## Getting started

```bash
npm install
npm run dev
```

```bash
npm run build    # type-check + production build
npm run preview  # preview the production build
npm run lint     # oxlint
```

The backend (API + database) lives in [`server/`](./server) — see `server/README.md` for
running it locally.

## Deploying a free test instance (Render)

`render.yaml` at the repo root is a [Render Blueprint](https://render.com/docs/blueprint-spec)
that stands up the API, a Postgres database, and the PWA as a static site, all on Render's
free tier — no credentials need to be shared with anyone to do this:

1. Push this repo to GitHub (already done if you're reading this from the repo).
2. In the Render dashboard: **New +** → **Blueprint** → connect this repo. Render reads
   `render.yaml` and provisions all three services.
3. Once the API service is live, bootstrap the real supreme admin: in the `farm-bhade-api`
   service's **Environment** tab, temporarily add `SUPER_ADMIN_PHONE` and
   `SUPER_ADMIN_PASSWORD` (12+ characters), save (triggers a redeploy — the start command
   runs `npm run create-admin` automatically when these are set), then **delete both vars**
   and redeploy again so the password doesn't sit in the dashboard long-term.
4. The PWA is served from `farm-bhade-pwa.onrender.com`, calling the API at
   `farm-bhade-api.onrender.com`. If either name is taken, update the URLs in
   `render.yaml`'s `CORS_ORIGIN` / `PUBLIC_UPLOADS_BASE_URL` / `VITE_API_URL` to match
   whatever Render actually assigns, then redeploy.

**Known limitations of this free-tier setup** (fine for functional testing, not for a
real multi-day pilot):
- Render's free web services use an **ephemeral filesystem** — uploaded crop-doctor
  photos and product images are lost on every redeploy or spin-down, since there's no
  persistent disk on the free plan. The VPS deployment in `server/README.md` doesn't
  have this problem.
- Free services **spin down after inactivity** and take ~30–60s to wake back up on the
  next request.
- Render's free Postgres plan has historically had a retention window (it has changed
  over time) — check current terms in the Render dashboard before relying on it.

## Sideloadable Android APK

The PWA is wrapped as a native Android app with [Capacitor](https://capacitorjs.com)
(the `android/` project here) — a real app shell that bundles the built frontend and
talks to the same API, not a Play-Store-only package. The actual APK is compiled by
[`.github/workflows/build-apk.yml`](./.github/workflows/build-apk.yml) on GitHub's own
runners, since building an Android app needs the Android SDK.

**To get the APK:** push to `claude/farm-bhade-pwa-frontend-x4ejjk` (or run the workflow
manually from the **Actions** tab → *Build Android APK* → **Run workflow**), wait for it
to finish, then open the run and download the `farm-bhade-debug-apk` artifact — it's a
zip containing `app-debug.apk`.

**To install it on a phone:** transfer the APK to the device (a chat app, cloud drive,
or USB works), tap it, and allow "install from this source" when Android asks — this is
what "sideloading" means, no Play Store involved. It's debug-signed, which is normal for
pilot testing and does not affect functionality; it just means it can't be published to
the Play Store as-is.

The API it points to is whatever `VITE_API_URL` is set to in
[`.env.production`](./.env.production) at build time (currently the Render deployment
above) — update that file and re-run the workflow to point the app at a different
backend (e.g. a VPS deployment).

## Project structure

```
src/
  assets/       static images/media
  components/   reusable UI building blocks (common/, layout/)
  constants/    app-wide constants (routes, branding, journey stages)
  context/      React context providers (auth, ...)
  hooks/        shared hooks (useAuth, useTheme, useLocalStorage, ...)
  layouts/      page shells (AuthLayout, DashboardLayout, ...)
  mocks/        realistic mock data standing in for the backend
  models/       domain types shared across features
  pages/        route-level screens, grouped by feature/role
  routes/       route configuration
  services/     mock async "API" functions, ready to swap for real calls
  theme/        design tokens + ThemeContext (light/dark mode)
  types/        shared TypeScript types
  utils/        small pure helper functions
```

## Roles

The app serves four roles, each with its own dashboard: **Farmer**, **Buyer**,
**Processor** and **Administrator**.

## Assets

`src/assets/images/farmer-hero.jpg` (and its `-sm` variant) is a licensed Adobe
Stock photo (asset ID `329042654`), used under a standard Adobe Stock license.

The marketplace product-category photos in `src/assets/images/product-*.jpg`
are also licensed Adobe Stock photos, used under a standard Adobe Stock
license:

| Category      | Asset ID    |
| ------------- | ----------- |
| Green Maize   | `369466613` |
| Wet Maize     | `449622554` |
| Dry Grain     | `221839682` |
| Dry Cobs      | `535069476` |
| Roasted Maize | `226332145` |
| Maize Flour   | `345117803` |
| Seed Maize    | `316566729` |

## Status

Built module by module. Current modules: folder structure & scaffold, theme
system, routing, authentication (mock), splash screen and the public
landing/welcome experience. Role dashboards, the marketplace, AI Crop Doctor
and the remaining screens are in progress.
