# AGENTS.md

## Cursor Cloud specific instructions

### What this project is
Salli is an Expo (React Native + TypeScript, Expo Router) app. The single app lives in
`expo-client/`. The development/test surface in Cloud is the **localhost browser** (Expo
web / PWA); native Android (AAB) and iOS packaging and Vercel web deploy are future targets.
See `README.md` and `docs/` for product/architecture context.

### Running the app (web, the primary dev surface)
- Dev server: from `expo-client/`, run `npm run web` (i.e. `npx expo start --web --port 8081`).
  Open `http://localhost:8081`. Use `--clear` after dependency or babel/metro config changes.
- Typecheck (there is no separate lint or test script): `cd expo-client && npm run typecheck`.

### Non-obvious caveats (important)
- The repo is committed in a partial "Phase 0" state (see `docs/STATUS.md`). Two build-config
  pieces are required for the web target to compile and are already in the repo:
  - `babel.config.js` uses `nativewind/babel` as a **preset** (NativeWind v4), not a plugin.
  - `metro.config.js` registers the `.wasm` asset extension so `expo-sqlite`'s web build
    (`wa-sqlite.wasm`) resolves. Without it, web bundling fails because Expo Router's
    `require.context` pulls every route (including the SQLite-backed `app/vat/index.tsx`).
- **Browser-safe vs native-only routes:** Most screens under `app/` are browser-safe demo
  screens built from `src/components/web/WebDemoShell.tsx` (pure inline styles) — e.g. Home
  (`app/index.tsx`), `bills`, `credit`, `reports`, `customers`, `expenses`, `dayclose`,
  `suppliers`, `settings`, `staff`. Routes such as `app/vat`, `app/sell`, `app/stock`,
  `app/login`, `app/onboarding` are native-first (use `expo-sqlite`, NativeWind `className`,
  `AuthGate`/Supabase) and may error or render blank on web until the documented Phase 0
  foundational work lands. Demonstrate web functionality via the browser-safe screens
  (e.g. Home -> Add supplier bill -> Review bill).
- **Env file:** the Supabase client (`src/lib/supabaseClient.ts`) is imported by the
  native/auth routes. Create `expo-client/.env` from `.env.example` (it is git-ignored).
  Placeholder values (e.g. `EXPO_PUBLIC_SUPABASE_URL=https://placeholder.supabase.co`) are
  enough for the browser-safe flows; real `EXPO_PUBLIC_SUPABASE_URL` / `EXPO_PUBLIC_SUPABASE_ANON_KEY`
  are only needed to exercise actual phone-OTP auth and Supabase-backed data.
- **Dependencies:** many `package.json` entries are pinned to `latest`. `package-lock.json`
  is committed to keep installs reproducible; prefer `npx expo install <pkg>` when adding deps
  so versions stay compatible with the installed Expo SDK.
