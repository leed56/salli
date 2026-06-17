# Salli — Build Roadmap (Phases & Sprints)

Companion to `docs/PRD.md`, `docs/ARCHITECTURE.md`, and `docs/MARKET_EXPANSION_STRATEGY.md`.
This is the execution plan: phases broken into sprints, each with a goal, scope, and
acceptance criteria. Status reflects what is actually shipped to the live app.

Status legend: ✅ done · 🟡 in progress / partial · ⬜ not started

Note: sprints are scoped by deliverable, not by calendar time. Sequence is the
recommendation; sprints within a phase can be reordered by priority.

---

## Phase 0 — Foundation & Stabilization  ✅

Goal: a real, runnable, deployable app on a real backend.

### Sprint 0.1 — Dev environment & deploy  ✅
- Expo SDK 56 deps pinned + lockfile; NativeWind v4 wired; Metro `.wasm` support.
- Runs on localhost web; static export deploys to Vercel (`vercel.json`, cleanUrls).
- Acceptance: `npm run typecheck` clean; public URL serves the app. ✅

### Sprint 0.2 — Supabase backend  ✅
- Project provisioned; migrations `001` (schema), `002` (RLS) applied; keys wired to Vercel + local.
- Acceptance: tables + RLS live; client connects. ✅

### Sprint 0.3 — Auth & onboarding  ✅
- Email/password auth; `SessionSync` bridges session → `appSession` (+ `hydrated` guard).
- `create_tenant_with_owner` RPC (`003`) fixes the onboarding RLS deadlock.
- Acceptance: sign in → create shop → membership/plan loaded; RLS isolation verified. ✅

---

## Phase 1 — Retail Core, Premium  🟡

Goal: a grocery/general shop can run its whole day on Salli, with VAT always correct.

### Sprint 1.1 — Catalogue & stock  ✅
- `/stock` add/list products (opening stock), per-tenant RLS.
- Acceptance: products persist; visible in New Sale. ✅

### Sprint 1.2 — Billing (sales) + output VAT + stock out  ✅
- `/sell` + `/sell/cart`; `record_sale` RPC (`004`) persists sale + items, decrements stock.
- VAT meter (`/vat`) reads output VAT from sales.
- Acceptance: sale persists; stock decrements; VAT meter reflects output VAT. ✅

### Sprint 1.3 — Supplier bills + input VAT + stock in  ✅
- `/bills` manual entry; `record_purchase` RPC (`005`) persists confirmed purchase,
  increments stock, matches/creates products (self-building catalogue).
- Acceptance: net payable = output − input; stock increases; new products created. ✅

### Sprint 1.4 — Customers & credit book  ✅
- `/customers` add/list; credit sales tie to a customer and raise balance (`record_sale` `006`);
  `/credit` records collections.
- Acceptance: credit sale → balance up; collect → balance down; "Credit due" tile reflects. ✅

### Sprint 1.5 — Day close  ✅
- `/dayclose`: today's cash/credit summary; counted cash → over/short variance in `cash_drawer_logs`.
- Acceptance: balanced / over / short computed and logged. ✅

### Sprint 1.6 — Live owner cockpit (home v1)  ✅
- `/` shows real VAT payable, today's sales, product/low-stock counts, credit due.
- Acceptance: dashboard reflects live shop data, not placeholders. ✅

### Sprint 1.7 — Expenses + claimable expense VAT  ✅
- `/expenses`: capture expenses (category, amount, VAT-claimable toggle); feeds the VAT meter's expense-VAT slot.
- Acceptance: expense VAT reduces net payable; expenses listed. ✅

### Sprint 1.8 — Reports (owner)  ✅  (pro-gated)
- `/reports`: quarter sales (cash/credit), output/input/expense/net VAT, gross profit (COGS via product cost), purchases, expenses, credit outstanding.
- Acceptance: period summary matches underlying records. ✅

### Sprint 1.9 — Configurable VAT engine  ⬜
- `vat_rate_history` + `tax_categories` (fabric exclusion, zero-rated, financial services); VAT on/off per tenant.
- Acceptance: rate/category changes reflected without code changes; non-VAT shops supported.

### Sprint 1.10 — Supplier ledger  ✅
- `/suppliers`: add suppliers, balances, record payments; supplier bills can link a supplier and "pay later" to raise the balance (`record_purchase` `007`).
- Acceptance: supplier outstanding tracked and settleable (mirror of credit book). ✅

### Sprint 1.11 — Subscription gating & roles polish  🟡
- Enforce plan feature gates + cashier role in UI (RLS already partial). Plans: free/standard/pro.
- Acceptance: cashier cannot see cost/profit/VAT-return/reports; gates match plan.

### Sprint 1.12 — AI supplier-bill capture  ⬜
- Camera capture → Supabase Edge Function → Claude vision → strict JSON draft → owner confirm → `record_purchase`.
- Acceptance: photo of a bill produces an editable draft; confirm persists it.

### Sprint 1.13 — Trilingual i18n  ⬜
- Wire `i18next` (already a dependency); Sinhala/Tamil/English; language stored on tenant/profile.
- Acceptance: full UI switchable across all three languages.

### Sprint 1.14 — WhatsApp receipts & sharing  ⬜
- Share bill/quote/payment reminder via WhatsApp (deep link first, Business API later).
- Acceptance: one-tap send of a receipt summary.

### Sprint 1.15 — Print & scan  ⬜
- Thermal (ESC/POS) receipts + barcode/QR scan for fast billing.
- Acceptance: print a receipt; scan a barcode to add to cart.

### Sprint 1.16 — Offline-first sync  ⬜
- Local SQLite (native) write-through + sync queue processor with UUID IDs reconciling to Postgres; conflict rule last-write-wins with financial-field flagging.
- Acceptance: sales/bills/credit/day-close work offline and reconcile when online.

### Sprint 1.17 — PWA & packaging  ⬜
- Installable PWA (manifest, icons, app-shell cache, offline launch); Android AAB + iOS via EAS.
- Acceptance: installable PWA; signed Android build; TestFlight build.

---

## Phase 2 — Multi-Vertical "Business Modes"  ⬜

Goal: one codebase reshapes per vertical via `tenants.business_mode` + `business_config`.

### Sprint 2.1 — Business-mode engine  ⬜
- `business_mode` enum + `business_config` jsonb; config-driven terminology/fields/dashboards.
### Sprint 2.2 — Textile / apparel  ⬜
- `product_variants` (size/color), bolts/meters, fabric VAT exclusion, variant analytics.
### Sprint 2.3 — Distributor / dealer / wholesale  ⬜
- `price_lists` + `customer_price_tier`, credit limits, rep order-taking, aging cockpit.
### Sprint 2.4 — Multi-branch  ⬜
- `branches`, `stock_by_branch`, `stock_transfers`; consolidated multi-branch cockpit.
### Sprint 2.5 — Hardware / pharmacy / restaurant / services  ⬜
- Quotations/delivery notes; batch/expiry; menu/tables/KOT; appointments/commission (as prioritized).

---

## Phase 3 — Vehicle Sales Module (flagship)  ⬜

### Sprint 3.1 — Catalog & inventory  ⬜
- `vehicle_models` master catalog + `vehicle_inventory` (VIN, status, CIF/landed cost, asking price, days-in-stock, media/grade).
### Sprint 3.2 — Import duty calculator  ⬜
- Versioned `import_duty_rules`; CIF/cc/kW/fuel/age/FX → excise/VAT/levies/landed cost/margin; import pipeline + quota tracking.
### Sprint 3.3 — Curated price sheets + price watch  ⬜
- `vehicle_price_observations` time-series; market band (min/median/max + freshness); my-price vs market.
### Sprint 3.4 — Vehicle owner cockpit  ⬜
- Hot Movers carousel, price-watch tiles, stock health, pipeline, money, alerts.
### Sprint 3.5 — Dealer CRM-lite  ⬜
- `leads`/`bookings`/`quotations`; WhatsApp lead capture; trade-in valuation; leasing hooks.

---

## Phase 4 — Intelligence  ⬜

### Sprint 4.1 — Price ingestion  ⬜
- Edge Functions + cron to pull ikman/riyasewana/distributor feeds into `vehicle_price_observations`.
### Sprint 4.2 — Fast-moving index  ⬜
- `vehicle_movement_metrics` from internal + market signals; ranked board by price band.
### Sprint 4.3 — AI extraction & demand signals  ⬜
- Reuse Claude vision for listing/screenshot extraction; demand/price-momentum signals; customer reminders.

---

## Phase 5 — Scale  ⬜

### Sprint 5.1 — Accountant portal & exports  ⬜
- VAT return prep + PDF/CSV exports; read-only accountant access.
### Sprint 5.2 — Integrations marketplace  ⬜
- Payments, leasing partners, e-invoicing.
### Sprint 5.3 — Analytics warehouse  ⬜
- Nightly rollups feeding cockpits; heavy aggregates off-device.

---

## Current snapshot

Done: Phase 0 (all), Phase 1 sprints 1.1–1.8 (catalogue, sales+stock-out, bills+stock-in,
customers/credit, day close, live cockpit, expenses+expense VAT, owner reports, supplier ledger).
The full retail money + VAT (output − input − expense) + inventory + customer/supplier ledgers
run end-to-end on the live app against the real Supabase backend.

Recommended next: 1.9 Configurable VAT →
1.11 gating/roles, then the premium layers (1.12 AI capture, 1.13 i18n, 1.14 WhatsApp,
1.15 print/scan, 1.16 offline, 1.17 packaging) to complete a premium MVP before Phase 2+.
