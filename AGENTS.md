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

### Vercel (web deploy)
- `vercel.json` (repo root) drives the deploy: it builds the static Expo web export
  (`expo-client/dist`) and sets `cleanUrls: true` (needed so nested routes such as
  `/bills/confirm`, exported as `bills/confirm.html`, resolve on direct load/refresh).
- Linked project: `nexuserp/salli`. Deploy with the CLI: production = `npx vercel deploy --prod
  --scope nexuserp` (public domain `salli-eight.vercel.app`); omit `--prod` for a preview.
- **Preview deployments are gated by Vercel Deployment Protection (HTTP 401)** unless you're a
  logged-in team member; disable it in Project Settings -> Deployment Protection to share
  preview/PR links publicly. The production alias is public.
- A `VERCEL_TOKEN` is needed for non-interactive CLI deploys; pass it via `--token`.
- **Build-time env (`EXPO_PUBLIC_*`):** Expo inlines these into the web bundle only when
  referenced **statically** (`process.env.EXPO_PUBLIC_FOO`); dynamic `process.env[key]` access
  is NOT replaced and is empty on web. The Vercel project must have
  `EXPO_PUBLIC_SUPABASE_URL` / `EXPO_PUBLIC_SUPABASE_ANON_KEY` set (placeholders are fine for
  rendering; real values needed for auth). After changing these, redeploy with `--force` so the
  static export is rebuilt (values bake in at export time, and Vercel may otherwise reuse a cache).

### Supabase backend
- Migrations live in `supabase/migrations/` and must be applied in order: `001` (schema),
  `002` (RLS), `003` (onboarding RPC). The app's `EXPO_PUBLIC_SUPABASE_URL`/`ANON_KEY` point at
  the project; the same values must be set in the Vercel project env.
- Applying migrations from this VM: connect via the Supabase **pooler** (host
  `*.pooler.supabase.com`, port `6543`). The direct host (`db.<ref>.supabase.co:5432`) is
  IPv6-only and unreachable from the VM. There is no `psql`; use Node `pg`.
- Onboarding goes through the `create_tenant_with_owner()` SECURITY DEFINER RPC (migration 003),
  not direct table inserts — the base RLS only allows existing owners to write, which deadlocks
  first-time setup.
- Auth: `SessionSync` (root layout) bridges any Supabase session into `appSession`, so it is
  auth-method agnostic. Note the project may have the **phone provider disabled** and **email
  confirmation on** by default; enable the phone provider + an SMS provider (or email auth) for
  real login through the UI.

### Known gotchas
- NativeWind on the **dev server** can show a brief unstyled first paint (FOUC) that a refresh
  fixes; the static export (`npx expo export`) inlines the CSS so production is styled on first load.
