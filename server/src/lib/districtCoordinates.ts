// Approximate district-center coordinates for Uganda's maize-growing districts,
// used to query the Open-Meteo weather API. Kept in sync with the frontend's
// src/mocks/districts.ts list.
export const DISTRICT_COORDINATES: Record<string, { lat: number; lon: number }> = {
  Kapchorwa: { lat: 1.4019, lon: 34.4514 },
  Kasese: { lat: 0.1833, lon: 30.0833 },
  Masindi: { lat: 1.6743, lon: 31.715 },
  Iganga: { lat: 0.6073, lon: 33.4686 },
  Mayuge: { lat: 0.4653, lon: 33.4747 },
  Mubende: { lat: 0.5636, lon: 31.3908 },
  Kiboga: { lat: 0.9167, lon: 31.7667 },
  Luwero: { lat: 0.85, lon: 32.4833 },
  Kayunga: { lat: 0.7167, lon: 32.9 },
  Mukono: { lat: 0.3533, lon: 32.7553 },
  Jinja: { lat: 0.4478, lon: 33.2026 },
  Mbale: { lat: 1.0827, lon: 34.175 },
  Ntungamo: { lat: -0.8833, lon: 30.2667 },
  Kamwenge: { lat: 0.3667, lon: 30.4667 },
  Kibaale: { lat: 0.8, lon: 31.0667 },
  Nakaseke: { lat: 1.15, lon: 32.2333 },
  Bugiri: { lat: 0.5833, lon: 33.7667 },
  Serere: { lat: 1.5, lon: 33.55 },
  Lira: { lat: 2.235, lon: 32.9098 },
  Gulu: { lat: 2.7746, lon: 32.2989 },
  Kitgum: { lat: 3.2833, lon: 32.8833 },
}

// Kampala as a sane fallback center-point for any district not in the table above.
export const UGANDA_FALLBACK_COORDINATES = { lat: 0.3476, lon: 32.5825 }
