# Salli MVP Backlog

## P0: Foundation

- Create Expo app in `expo-client/`
- Configure Expo Router
- Configure NativeWind
- Add Salli theme tokens
- Add app route placeholders
- Add Supabase client
- Add `.env.example`
- Add phone OTP auth
- Add tenant onboarding
- Add owner/cashier role model
- Add subscription entitlement helper

## P0: Supabase schema

- `tenants`
- `tenant_members`
- `subscriptions`
- `products`
- `customers`
- `suppliers`
- `sales`
- `sale_items`
- `purchases`
- `purchase_items`
- `expenses`
- `cash_drawer_logs`
- `vat_periods`

## P0: Security

- RLS on every tenant table
- Owner access policies
- Cashier restricted policies
- Block cashier from cost price
- Block cashier from profit
- Block cashier from VAT return
- Block cashier from reports
- Block cashier from staff settings
- Server-side feature gate for AI extraction
- Server-side feature gate for exports

## P1: Home

- VAT payable this quarter
- Output VAT
- Input VAT
- Today sales
- Today cash
- Credit outstanding
- Sync status
- Subscription status
- New Sale action
- Add Bill action

## P1: New Sale

- Product search
- Product chips
- Quantity controls
- Cart drawer/sheet
- Cash checkout
- Credit checkout
- VAT calculation
- Stock deduction
- Invoice share
- Local offline write
- Sync queue entry

## P1: Stock

- Stock list
- Add product
- Edit product
- Low-stock flag
- Barcode field
- VAT inclusive flag
- Cost price owner-only

## P1: Bill capture

- Camera capture
- Image compression
- Storage upload
- Purchase draft
- Claude extraction Edge Function
- Strict JSON parsing
- Confidence/warning display
- Confirm screen
- VAT validation
- Product matching
- Missing product creation
- Stock increase
- Input VAT recording

## P1: VAT return

- Current quarter selector
- Output VAT aggregation
- Input VAT aggregation
- Net payable
- Past quarters
- Transaction drilldown
- PDF export
- CSV export
- Ready-to-file wording

## P2: Operating workflows

- Credit book
- Customer ledger
- Payment received
- WhatsApp reminder
- Supplier ledger
- Mark supplier paid
- Expense entry
- Day close
- Cash variance
- Daily profit owner-only

## P2: Localization

- English strings
- Sinhala strings
- Tamil strings
- Runtime language switch
- Currency formatting with `Rs ` prefix
- Mixed-script product name handling

## P2: PWA and release

- Manifest
- Icons
- Maskable icon
- Service worker/app shell cache
- Offline launch
- Add to Home Screen prompt
- EAS preview APK
- Android AAB later
- iOS TestFlight after validation
