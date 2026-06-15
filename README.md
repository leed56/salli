# Salli

Salli is a subscription-based, multi-tenant SaaS app for Sri Lankan SMEs that combines billing, stock, credit ledger, supplier ledger, expenses, day close, and VAT-return automation.

The product is mobile-first and built around one promise:

> Capture every sale and every purchase, tag VAT correctly, and always show the owner the VAT payable this quarter.

## Product focus

Salli is not just another POS system. It competes on VAT confidence for non-accountant shop owners.

Core users:

- Shop owner: sees VAT, profit, stock, credit, and reports.
- Cashier/family helper: can bill and collect payments, but cannot see profit, cost prices, VAT returns, or staff settings.
- External bookkeeper/accountant: receives exports, not necessarily a login in MVP.

## Platform

- Expo + React Native + TypeScript
- Expo Router
- Responsive PWA from the same codebase
- Android/iOS via EAS Build
- Supabase for Postgres, Auth, Storage, RLS, Edge Functions
- Local-first/offline-first billing using SQLite sync queue
- Claude vision through a Supabase Edge Function for supplier bill extraction

## Primary app directory

The implementation should focus on:

```txt
expo-client/
```

Do not prioritize a separate web/admin app unless explicitly needed.

## MVP pillars

1. Phone OTP onboarding and tenant/shop setup
2. Owner/cashier roles with strict access control
3. Premium Home screen with live VAT meter
4. Fast New Sale flow
5. AI supplier bill capture and confirmation
6. Self-building product catalogue
7. Credit book and supplier ledger
8. Stock list with low-stock flags
9. Day close
10. VAT return summary with PDF/CSV export
11. Sinhala, Tamil, and English UI
12. Offline-first operation
13. Subscription feature gates

## Documentation

- [Product Requirements Document](docs/PRD.md)
- [Implementation Plan](docs/IMPLEMENTATION_PLAN.md)
- [Architecture](docs/ARCHITECTURE.md)
- [Backlog](docs/BACKLOG.md)

## Current stage

Planning and foundation setup.

Next build target: Expo app shell, Supabase auth, tenant onboarding, subscription entitlements, and premium Home VAT meter.
