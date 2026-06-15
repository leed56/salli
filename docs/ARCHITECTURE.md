# Salli Architecture

## Architecture summary

Salli is an Expo-first multi-tenant SaaS application.

```txt
Expo app / PWA
  -> local SQLite cache and sync queue
  -> Supabase Auth, Postgres, Storage, Edge Functions
  -> Claude API through secure Edge Function only
```

The app must work offline for sales, bill capture queueing, credit, and day close.

## Frontend

- Expo
- React Native
- TypeScript
- Expo Router
- NativeWind
- TanStack React Query
- Zustand
- expo-sqlite
- expo-camera
- expo-image-manipulator
- expo-sharing
- i18next/react-i18next

## Backend

- Supabase Auth for phone OTP
- Supabase Postgres for relational data
- Supabase RLS for tenant and role security
- Supabase Storage for bill photos
- Supabase Edge Functions for AI extraction and protected server tasks

## AI boundary

The mobile app must never call Claude directly.

```txt
App -> Supabase Edge Function -> Claude API -> strict JSON -> App confirm screen
```

AI extracts supplier bill data only. Salli calculates VAT deterministically.

## Recommended app structure

```txt
expo-client/
  app/
    _layout.tsx
    index.tsx
    login.tsx
    onboarding.tsx
    sell/
    bills/
    credit/
    suppliers/
    stock/
    expenses/
    dayclose/
    vat/
    reports/
    settings/

  src/
    components/
      ui/
      home/
      sell/
      bills/
      vat/
      stock/
      credit/
    features/
      auth/
      onboarding/
      sell/
      bills/
      vat/
      stock/
      credit/
      suppliers/
      expenses/
      subscriptions/
      sync/
    db/
      local/
      sync/
    lib/
    stores/
    constants/
    locales/

  supabase/
    migrations/
    functions/
      extract-bill/
```

## Core tables

```txt
tenants
profiles
tenant_members
plans
subscriptions
subscription_events
products
customers
suppliers
sales
sale_items
purchases
purchase_items
expenses
cash_drawer_logs
vat_periods
sync_queue_events
```

Every business table must include:

```txt
tenant_id
created_at
updated_at
created_by
```

## Role model

### Owner

Full access inside their tenant.

### Cashier

Allowed:

- Create sales
- Read product names and sell prices
- Use cart/checkout
- Record credit collection if enabled

Denied:

- Cost prices
- Profit
- VAT return
- Purchase totals
- Supplier balances unless explicitly allowed
- Reports
- Staff/settings access

This must be enforced in RLS, not only in UI route guards.

## Subscription model

Plans:

```txt
free
standard
pro
```

Statuses:

```txt
trial
active
past_due
cancelled
```

Feature gates:

```txt
billing
stock
credit_book
day_close
ai_bill_capture
vat_return
exports
staff_accounts
supplier_ledger
reports
profit_view
multi_branch
```

Server-side checks are required for:

- AI bill extraction
- PDF/CSV export
- staff invitation
- report generation

## Offline-first sync

Local writes should be created immediately in SQLite and added to a sync queue.

Initial conflict rule:

```txt
last-write-wins per row, but flag conflict if important financial fields changed remotely and locally
```

Critical offline flows:

- New Sale
- Cart checkout
- Bill capture queue
- Credit collection
- Day close

## VAT calculation principle

AI and UI should never be the source of truth for VAT calculations.

Use deterministic app/backend calculations:

```txt
output VAT = VAT from confirmed sale items
input VAT = VAT from confirmed purchase items and eligible expenses
net payable = output VAT - input VAT
```

A purchase extraction must remain a draft until owner confirmation.

## PWA requirements

- Dark app shell
- Installable manifest
- 192px and 512px icons
- maskable icon support
- app shell cache
- offline launch
- secure HTTPS deployment
- Add to Home Screen prompt after first completed sale, not during onboarding

## Production release targets

1. Android preview APK
2. PWA on Vercel
3. Android AAB for Google Play
4. iOS TestFlight after MVP validation
