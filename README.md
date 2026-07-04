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

## Status

Built module by module. Current modules: folder structure & scaffold, theme
system, routing, authentication (mock), splash screen and the public
landing/welcome experience. Role dashboards, the marketplace, AI Crop Doctor
and the remaining screens are in progress.
