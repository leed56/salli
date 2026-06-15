# Salli Implementation Plan

## Build principle

Build the trust engine first: auth, tenant, role security, subscriptions, and the Home VAT meter. Then build daily workflows around it.

## Current repo state

The repository starts empty. This plan seeds the product and technical direction before Expo source code is added.

## Phase 0: Repository foundation

Deliverables:

- README
- PRD
- Architecture document
- Backlog
- First GitHub issues
- Initial Expo client scaffold

## Phase 1: Expo app foundation

Goal: create the app shell and navigation foundation.

Tasks:

1. Create `expo-client/` using Expo + TypeScript.
2. Add Expo Router.
3. Add NativeWind.
4. Add Salli theme tokens.
5. Add route groups and protected route placeholders.
6. Add responsive layout helpers.
7. Add trilingual i18n setup.

Core routes:

```txt
/
/login
/onboarding
/sell
/bills
/credit
/suppliers
/stock
/expenses
/dayclose
/vat
/reports
/settings
/settings/staff
```

## Phase 2: Supabase foundation

Goal: enable secure multi-tenant SaaS behavior.

Tasks:

1. Create Supabase project.
2. Add `.env.example` for Expo public keys.
3. Add Supabase client.
4. Add phone OTP login.
5. Add tenant creation.
6. Add tenant membership and roles.
7. Add subscriptions and entitlements.
8. Add RLS policies.

Do not proceed to production features until tenant isolation and role rules are verified.

## Phase 3: Premium Home VAT meter

Goal: build the product's emotional center.

Home must show:

- VAT payable this quarter
- Output VAT
- Input VAT
- Today sales
- Today cash
- Credit outstanding
- Sync status
- Subscription status
- New Sale button
- Add Bill button

Design requirement:

The VAT payable number must be the largest and most trusted element on the screen.

## Phase 4: Product catalogue and stock

Goal: support selling and bill capture.

Tasks:

1. Add products table.
2. Add stock list.
3. Add low-stock flags.
4. Add product create/edit.
5. Add cost price visibility only for owner.
6. Add sell price visibility for owner/cashier.

## Phase 5: New Sale flow

Goal: achieve <= 15 seconds median sale completion.

Tasks:

1. Product search/chips.
2. Quantity increments.
3. Cart drawer/sheet.
4. Cash checkout.
5. Credit checkout.
6. Sale item VAT calculation.
7. Stock reduction.
8. WhatsApp invoice share.
9. Offline local write.
10. Sync queue processing.

## Phase 6: Supplier bill capture

Goal: unlock the paid Standard plan value.

Tasks:

1. Camera capture.
2. Image compression.
3. Upload to Supabase Storage.
4. Call `extract-bill` Edge Function.
5. Save extraction as draft.
6. Confirm screen.
7. Product matching.
8. Create new products if needed.
9. Increase stock.
10. Record input VAT.

Rules:

- AI output is never auto-saved silently.
- Owner confirmation is mandatory.
- VAT is calculated/validated deterministically.

## Phase 7: Credit, suppliers, expenses, and day close

Goal: complete the daily business loop.

Tasks:

1. Customer credit balances.
2. Payment recording.
3. WhatsApp reminders.
4. Supplier payables.
5. Supplier payment marking.
6. Expense entry.
7. Cash drawer close.
8. Daily profit visible only to owner.

## Phase 8: VAT return and exports

Goal: make Salli filing-ready.

Tasks:

1. Quarter calculation.
2. Output VAT aggregation.
3. Input VAT aggregation.
4. Net payable calculation.
5. Past periods.
6. PDF export.
7. CSV export.
8. Bookkeeper-ready report format.

## Phase 9: PWA and Android preview

Goal: field test with real shops.

Tasks:

1. PWA manifest.
2. App shell caching.
3. Offline launch.
4. Add to Home Screen prompt after first completed sale.
5. EAS preview profile.
6. Android APK.
7. Field test with 3-5 shops.

## Phase 10: Production hardening

Tasks:

1. RLS audit.
2. Subscription bypass audit.
3. Offline sync tests.
4. Real-device camera tests.
5. Sinhala/Tamil layout testing.
6. Low-connectivity tests.
7. Error monitoring.
8. Backup/export strategy.
9. Android AAB.
10. PWA production deployment.

## Suggested first branch

```bash
git checkout -b feature/salli-foundation
```

## First implementation slice

```txt
1. Expo Router app shell
2. NativeWind setup
3. Salli theme tokens
4. Supabase client
5. Phone OTP login
6. Tenant onboarding
7. Subscription entitlement helper
8. Home VAT meter placeholder
```
