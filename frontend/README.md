# Frontend (Vue 3 + TypeScript + Vite)

This document explains how to run the frontend locally, configure environment variables, build for production, preview the build, and run Storybook.

---

## Prerequisites

- Node.js 18+ and npm
- Modern browser (Chrome, Firefox, Safari, or Edge)

---

## 1) Install dependencies

From the frontend directory:

- npm install

If you encounter permission or lock issues, try:

- rm -rf node_modules package-lock.json
- npm install

---

## 2) Configure environment variables

Vite exposes variables that start with VITE_. Create .env files in the frontend directory as needed:

- .env — loaded in all modes
- .env.development — loaded when running the dev server
- .env.production — loaded when building for production
- .env.local — local-only overrides (not committed); also supports mode-specific variants like .env.development.local

Common variables:

- VITE_API_BASE_URL: Base URL of your backend API.
  - Example (local dev): VITE_API_BASE_URL=http://localhost:3000
  - Example (production): VITE_API_BASE_URL=https://api.example.com

Notes:

- Only variables prefixed with VITE_ are exposed to the browser.
- If you change .env values, restart the dev server to ensure they take effect.

Example .env.development:
