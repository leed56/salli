# Salli — Sri Lanka Market Expansion & Premiumization Strategy

From "VAT meter for shops" to a world-class, multi-vertical business operating system for every type of Sri Lankan business owner — grocery & multi-branch retail, textile, dealers & distributors, services, and a flagship premium Vehicle Sales module.

Status: Strategy proposal (v1). Companion to docs/PRD.md, docs/ARCHITECTURE.md, docs/IMPLEMENTATION_PLAN.md.
All market figures below are grounded in public sources (cited inline) and are point-in-time; the app must treat them as live, updatable data, never hardcoded.

## 1. Executive summary

Salli today is positioned narrowly as a VAT-payable meter. That is a strong wedge, but VAT is a feature, not the product. Only businesses above the LKR 60 million/year VAT registration threshold are even VAT-registered, so a VAT-only product excludes the majority of SL micro/small shops while under-serving larger dealers who need far more than VAT.

The strategic move: keep VAT as the trust hook (it's the scary, high-stakes thing owners fear getting wrong at 18%), but reposition Salli as the business control center: one premium app where any owner — from a corner grocery to a luxury vehicle dealer — runs sales, stock, credit, suppliers, cash, staff, and sees the whole business from their phone.

The differentiated, defensible bets:

- Vertical "Business Modes" — the app reshapes itself for grocery, textile, distributor/dealer, hardware, pharmacy, restaurant, services, and vehicle sales.
- A premium Vehicle Sales module with live brand-new price intelligence, a fast-moving model index, an import cost/duty calculator, and an owner mobile cockpit.
- Owner-grade mobile experience — a genuinely premium, fast, offline-first, multilingual (Sinhala/Tamil/English) app that feels like a flagship consumer product, not utilitarian POS software.

## 2. Market research findings (Sri Lanka, 2025–2026)

### 2.1 Tax / VAT environment (the trust hook)
- Standard VAT is 18% since 1 Jan 2024 (up from 15%); most previously-exempt items are now taxable.
- VAT registration threshold: ~LKR 60M/year turnover (~USD 185k). Implication: most micro shops are not VAT-registered, so a VAT-only product has a small TAM. Serve non-VAT businesses too and upsell VAT as they grow.
- Fabrics are notably excluded from the standard 18% treatment — relevant to the textile vertical.
- VAT on non-resident digital services from 1 Oct 2025 — relevant to our SaaS billing and dealers importing digital services.

Product takeaway: the VAT engine must be configurable (rate history, category exemptions e.g. fabric, zero-rated items, financial services), period-aware (quarterly), and must gracefully serve businesses with VAT off.

### 2.2 Vehicle market (the premium opportunity)
- Sri Lanka lifted its ~5-year vehicle import ban in early 2025 (commercial vehicles from 1 Feb 2025, then phased).
- Excise duties of 200%–300% on imported vehicles by engine capacity / kW. Prices are extreme and volatile (FX + duty driven), so a price-intelligence and duty-calculator tool is genuinely valuable.
- Registered importers vs. individuals: registered importers can import at volume; non-registered individuals are limited to one vehicle per 12 months; L/C-only, Usance L/Cs banned.
- Strong demand for Chinese EVs, notably BYD. Most vehicles are imported (Japan, India, China) — no major local manufacturing.

The "fast-moving" set the owner explicitly wants tracked: Defender, Land Cruiser, BMW, Mercedes, Range Rover, Discovery, + Chinese new vehicles (BYD etc.). Public data sources already exist (ikman.lk, riyasewana.com) — Salli's value is aggregating, ranking, and pushing it to the owner's phone as a movement/price index.

### 2.3 Competitive landscape
- Lanka POS (lankabill.lk): "#1 POS, 24,000+ users", desktop-first, dated UX, no VAT-confidence/vehicle depth.
- SmartBillPos: cloud POS with business modes; generic, not mobile-premium, no vehicle vertical.
- Omnis / POSLK / PiCS / BIZY.LK: commodity cloud POS; no AI/premium mobile/VAT-confidence/vehicle module.
- hSenid / PeoplesHR: enterprise/HR; not SME POS.

Market signals to copy fast (table stakes): offline mode, WhatsApp receipts/bills, thermal-printer & barcode support, one-glance LKR pricing, no-card trial, bank-transfer activation.

Where we win: mobile-first owner cockpit; built-in VAT confidence; true multi-vertical business modes incl. a vehicle/dealer module; AI (bill capture, price intelligence, demand signals); premium design + performance as a brand.

## 3. Repositioning: the product thesis

Salli is the business control center for Sri Lankan owners. Whatever you sell — rice, sarees, cement, medicine, or a Land Cruiser — Salli runs your counter, your stock, your money, your people, and shows you the whole business from your phone, with VAT always under control.

Three pillars: Run it (sell, buy, stock, credit, cash, staff), See it (owner cockpit), Grow it (intelligence). VAT becomes one tile in "See it", not the whole product.

## 4. Vertical strategy — "Business Modes"

A single config-driven engine that reshapes terminology, fields, billing flow, and dashboards per vertical.

| Mode | Core entities | Special needs | Premium hooks |
| --- | --- | --- | --- |
| Grocery / Mini-mart / Multi-shop | Products, barcodes, batches | Fast barcode billing, weight items, multi-branch transfer, low-stock | Multi-branch cockpit, supplier bill AI, reorder suggestions |
| Textile / Apparel | Variants (size/color), bolts/meters | Fabric VAT exclusion, variant matrix, season/markdown | Variant analytics, fast-moving SKUs, festival demand |
| Dealer / Distributor / Wholesale | Price tiers, routes, reps, credit limits | B2B credit terms, rep order-taking, route accounting, returns | Outstanding/aging cockpit, rep performance, target tracking |
| Hardware / Building materials | Units, bulk, delivery | Quotations, delivery notes, partial deliveries | Quote->invoice, project/customer ledgers |
| Pharmacy | Batches, expiry | Expiry alerts, schedule control | Expiry/loss cockpit |
| Restaurant / Café | Menu, tables, KOT | Table/KOT flow, modifiers | Daypart sales, item mix |
| Salon / Services | Services, appointments | Booking, staff commission | Staff revenue, repeat-customer reminders |
| Vehicle Sales (flagship) | Vehicles (VIN), variants, leads, bookings, leasing, imports | Price intelligence, duty calc, lead pipeline, L/C tracking | Owner cockpit of fast-movers & market prices |

Implementation: a `business_mode` on the tenant drives a feature/field/terminology config (JSON-driven UI + rule packs), so verticals ship without forking the app.

## 5. Flagship: Premium Vehicle Sales Module

- 5.1 Vehicle catalog & inventory: master model catalog (make -> model -> variant -> year -> body -> fuel -> cc/kW), dealer stock by VIN with status/cost/landed cost/asking price/days-in-stock, media + condition grade.
- 5.2 Live brand-new price intelligence: aggregate public listings + dealer pricing + distributor RRP; time-series per model; market band (min/median/max with sample size + freshness); my-price vs market delta. Start with curated weekly sheets, then feeds/scrapers, then AI extraction.
- 5.3 Fast-moving index: rank movement from internal (velocity, days-to-sell, leads, conversion) + market (listing turnover, search interest, price momentum) signals; Hot Movers leaderboard by price band.
- 5.4 Import cost & duty calculator: inputs CIF/cc/kW/fuel/age/FX -> excise, VAT, levies, landed cost, suggested margin/retail; versioned duty-rule table; import pipeline tracking (L/C -> shipped -> port -> cleared -> showroom) with quota awareness.
- 5.5 Sales pipeline (dealer CRM-lite): leads -> test drive -> quote -> booking/advance -> leasing -> delivery -> after-sale; WhatsApp-native; trade-in valuation.
- 5.6 Vehicle owner cockpit: Hot Movers carousel, brand-new price watch tiles, stock health (aging, tied-up capital), pipeline, money (receivables, margin, VAT), alerts.

## 6. Owner mobile experience — "world-class premium"

One-glance cockpit per vertical; motion & polish (Reanimated, haptics, skeletons, dark theme #020617 with teal/amber); offline-first instant reads + optimistic UI; trilingual Sinhala/Tamil/English; WhatsApp-native; print/scan (thermal + barcode/QR + camera); role-aware (owner vs cashier/rep, enforced via RLS); accessibility (large targets, big numbers, sun-readable).

## 7. Data model extensions (relative to current Supabase schema)

Add: `tenants.business_mode` (enum) + `business_config` jsonb; branches/`stock_by_branch`/`stock_transfers`; `product_variants`/`product_attributes`; vehicle vertical tables (`vehicle_models`, `vehicle_inventory`, `vehicle_price_observations`, `vehicle_movement_metrics`, `import_duty_rules`, `vehicle_imports`); `leads`/`bookings`/`quotations`; pricing tiers (`price_lists`, `customer_price_tier`); VAT engine (`vat_rate_history`, `tax_categories`). Multi-tenant RLS must extend to every new table (reuse `is_tenant_member` / `is_tenant_owner`).

## 8. Architecture & technical plan

Config-driven verticals (one codebase). Offline-first everywhere (SQLite + sync queue needs an actual processor and UUID local IDs reconciling with Postgres). Price/intel services as Supabase Edge Functions + scheduled jobs; reuse Claude vision for listing/bill extraction. Notifications: push + WhatsApp Business API. Printing/hardware: ESC/POS + barcode/QR. Analytics warehouse: nightly rollups for the cockpit. Foundational fixes first (auth->session, route guard, onboarding RLS, NativeWind v4, pin deps, restore native screens).

## 9. Monetization

Tiered, LKR-priced, no-card trial, bank-transfer activation, premium-anchored:

| Tier | Audience | Includes |
| --- | --- | --- |
| Free / Starter | Micro shops (non-VAT) | Billing, stock, credit book, WhatsApp receipts, 1 branch |
| Standard | Growing SMEs (approaching/at VAT threshold) | + VAT engine & returns, supplier-bill AI, exports, supplier ledger |
| Pro | Multi-branch retail, distributors | + multi-branch, price tiers, staff accounts, reports, profit/cost views |
| Vehicle / Dealer (premium) | Vehicle dealers, importers | + Vehicle module, price intelligence, fast-moving index, duty calculator, import/L-C tracking, CRM-lite. Highest ARPU |

Add-ons: extra branches, extra users, price-intelligence refresh frequency, WhatsApp volume.

## 10. Phased roadmap (summary)

- Phase 0 — Stabilize foundation.
- Phase 1 — Retail core, premium (grocery/general end-to-end, trilingual, WhatsApp, thermal print, owner cockpit v1, configurable VAT, supplier-bill AI).
- Phase 2 — Multi-vertical modes (textile, distributor/dealer, multi-branch).
- Phase 3 — Vehicle module (catalog/VIN, duty calculator, curated price sheets, vehicle cockpit, leads/bookings).
- Phase 4 — Intelligence (live price ingestion + fast-moving index, demand signals, AI price extraction, trade-in, leasing hooks).
- Phase 5 — Scale (accountant portal/exports, marketplace integrations, analytics warehouse, more verticals).

See `docs/ROADMAP.md` for the detailed sprint breakdown and current build status.

## 11. Risks & compliance

Price data accuracy/legality (respect ToS; prefer partner feeds + curated sheets; always show source + freshness). Regulatory volatility (duties/VAT change via gazette -> versioned rule tables). VAT correctness (test coverage for the VAT engine + categories). FX exposure (store currency + FX on observations). Data privacy / RLS (tenant isolation on every table). Scope discipline (config-driven verticals; resist per-customer code).

## 12. Success metrics (KPIs)

Activation (onboarding + first bill). Engagement (cockpit opens, bills/day, WhatsApp sends). VAT value (tenants with VAT enabled; on-time quarter summaries). Vehicle tier (dealers onboarded, price-watch models, fast-mover board opens, leads->delivery conversion). Commercial (paid conversion by tier; Vehicle/Dealer ARPU; retention vs incumbents).

## Appendix A — Sources

VAT 18% & exemptions (HKTDC, IRD, GlobalVATCompliance, vatcalc). Vehicle imports/duties/regulations (BBC, LankaBIZ, Daily Mirror, EconomyNext gazette 2421/04). Indicative vehicle prices (ikman.lk, riyasewana.com, srilanka-promotions.com). Competitive landscape (lankabill.lk, smartbillpos.com, hSenid). All figures are point-in-time and must be implemented as live, updatable data within the product.
