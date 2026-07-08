# Farm Bhade — From Seed to Market

Farm Bhade is an AI-powered digital maize ecosystem for Uganda, guiding farmers from
planning through growing, harvesting, storage, selling and processing — with a
trusted marketplace, AI Crop Doctor, live market prices and weather forecasts.

This repository contains the **frontend only** — a production-ready Progressive
Web App built with React, TypeScript and Tailwind CSS. Backend integration is
mocked and designed to be swapped in later without restructuring the app.

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
