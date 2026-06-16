# Salli Current Status

## Completed foundation

- Product README
- PRD
- Architecture plan
- Implementation plan
- Backlog
- Expo client package scaffold
- Expo app config
- TypeScript config
- NativeWind config
- Root Expo Router layout
- Premium Home VAT meter shell
- Placeholder screens for major MVP routes
- Subscription entitlement helper
- Session state scaffold
- Feature gate scaffold
- Auth gate scaffold
- Currency helper
- Supabase client shell
- Phone login UI scaffold
- Shop setup UI scaffold
- Tenant setup API scaffold
- Product type and repository scaffold
- New Sale cart shell
- Checkout cash/credit shell
- Stock list and quick-add shell
- Local SQLite schema scaffold
- Local SQLite initializer
- Sync queue types
- Sync queue enqueue helper
- VAT summary calculator
- VAT repository scaffold
- Bill draft model
- Premium supplier bill capture UI
- Premium supplier bill confirm UI
- Demo bill extraction data
- Local purchase and purchase item tables
- Confirmed bill local save scaffold
- Confirmed bill sync queue scaffold
- Confirmed bill stock increase scaffold
- Local product repository
- Stock screen local database read
- Stock screen local product add with sync queue
- Supabase core schema migration
- Supabase initial RLS migration

## Still needed next

1. Local run with `npm install` and `npm run typecheck`.
2. Persist checkout to local SQLite first, then sync.
3. Build VAT summary screen UI from local sales, purchases, and expenses.
4. Replace remaining demo sale products with tenant/local product query.
5. Build customer credit selection flow.
6. Add real bill image capture and Edge Function extraction.
7. Add route placeholders that were blocked by connector filters.
8. Add CI typecheck workflow after dependency versions are pinned.

## Known limitation

Some GitHub file writes were blocked by connector safety filters even though the intended files were normal app scaffolding. Those files can be added later with shorter wording or from a local clone.
