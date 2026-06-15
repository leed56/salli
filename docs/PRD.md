# Salli Product Requirements Document

**Product:** Salli  
**Working title:** Cash / සල්ලි / சல்லி  
**Type:** Multi-tenant SaaS for Sri Lankan SMEs  
**Platform:** Expo React Native + Expo Router -> PWA, Android, iOS  
**Owner:** Disruptive Solutions Pvt Ltd  
**Status:** Draft v1.0 for internal scoping

## 1. Vision

Sri Lankan SMEs that cross the VAT threshold need a simple way to stay compliant without learning accounting software.

Salli captures every sale and purchase, tags VAT automatically, and shows the owner one number that matters most: VAT payable this quarter.

Everything else exists to make that number trustworthy with minimum owner effort.

## 2. Success metrics

| Goal | Metric | Target |
|---|---|---:|
| Remove VAT anxiety | Active shops with ready-to-file VAT summary each quarter | >= 90% |
| Fast daily use | Median sale completion time | <= 15 seconds |
| Self-building catalogue | Stock items added by bill capture or sale flow | >= 70% |
| Retention | 60-day paying shop retention | >= 60% |
| Conversion | Free to paid conversion within 30 days | >= 15% |
| ERP upgrade | Salli shops upgrading into NEXUS ERP within 12 months | >= 5% |

## 3. Personas

### Owner

Runs a small Sri Lankan shop. Smartphone-literate but not accounting-literate. Wants VAT, stock, credit, and cash to be right without manual bookkeeping.

### Cashier / family helper

Handles sales when the owner is away. Needs fast billing and payment collection. Must not see VAT, profit, cost prices, or staff settings.

### External bookkeeper

Needs PDF/CSV exports and VAT summaries. Does not need a login in MVP.

## 4. Positioning

Salli does not try to beat existing POS products on raw POS feature count. It wins through:

1. VAT-return automation.
2. AI bill capture.
3. Mobile-first PWA and native app from one codebase.
4. Sinhala, Tamil, and English UI.
5. Upgrade path into NEXUS ERP.

## 5. MVP scope

### Must-have

- Shop onboarding: name, VAT number, quarter start, language
- Phone OTP auth
- Owner/cashier staff roles
- Home VAT meter
- New Sale flow
- Cash and credit checkout
- WhatsApp invoice sharing
- Product catalogue with on-the-fly creation
- Supplier bill photo capture
- AI extraction and owner confirmation
- Purchase recording and stock increase
- Credit book
- Supplier ledger
- Expenses
- Day close
- VAT return summary by quarter
- PDF/CSV export
- Stock list with low-stock flags
- Sinhala/Tamil/English localization
- Offline-first sales and bill-capture queue
- Subscription feature gates

### Phase 2

- Multi-branch
- Weight-scale support
- Voice sale entry
- Low-stock reorder suggestions
- Bookkeeper share links
- Push notifications

### Out of scope

- Direct IRD e-filing
- Payroll/HR
- Manufacturing/BOM costing
- Full double-entry ledger

## 6. Main routes

```txt
/                        -> Home VAT meter
/login                   -> Phone OTP auth
/onboarding              -> Shop setup
/sell                    -> New sale
/sell/cart               -> Cart/checkout
/bills                   -> Supplier bill capture
/bills/[id]/confirm      -> Confirm extracted bill
/credit                  -> Credit book
/credit/[id]             -> Customer ledger
/suppliers               -> Supplier ledger
/stock                   -> Stock list
/stock/[id]              -> Product details
/expenses                -> Expense entry/list
/dayclose                -> Cash count and profit
/vat                     -> VAT return summary
/reports                 -> Reports
/settings                -> Shop settings
/settings/staff          -> Staff accounts
```

Owner-only routes:

```txt
/bills
/vat
/reports
/settings/staff
```

## 7. Core flows

### New Sale

Home -> New Sale -> tap/search product -> cart -> cash or credit -> invoice share -> Home VAT meter updates.

### Add Bill

Home -> Add Bill -> capture image -> AI extraction -> owner confirms -> stock increases -> input VAT recorded -> VAT meter decreases.

### Credit collection

Credit book -> customer -> received payment -> balance updates -> optional WhatsApp reminder.

### Day close

Home -> Day close -> expected cash -> counted cash -> variance -> daily profit -> close day.

### VAT filing

VAT -> output VAT, input VAT, net payable -> export PDF/CSV -> owner/bookkeeper files manually.

## 8. Design principles

Premium means calm, fast, legible, and trustworthy.

Palette:

- `#020617` base background
- `#2DD4BF` VAT/compliance
- `#FBBF24` sales/cash
- `#FB7185` credit owed
- `#F1F5F9` primary text
- `#64748B` secondary text

UI principles:

- Large tap targets
- One primary action per screen
- Card-based lists
- Tabular currency figures
- Always use `Rs ` prefix
- No accounting jargon where simple wording works

## 9. Monetization

| Tier | Indicative price | Includes |
|---|---:|---|
| Free | Rs. 0 | Billing, stock, credit book, day close |
| Standard | Rs. 1,500/mo | AI bill capture, VAT return, exports |
| Pro | Rs. 3,000/mo | Staff accounts, supplier ledger, reports, Phase 2 multi-branch |

## 10. Roadmap

1. MVP months 1-3: core flows, Android/PWA, trilingual UI
2. V1.1 month 4: AI extraction refinement, PDF/CSV polish
3. V1.2 months 5-6: iOS, push notifications, vertical features
4. V2 month 7+: multi-branch, bookkeeper links, NEXUS upgrade path
