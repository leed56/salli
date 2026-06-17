-- Per-shop VAT configuration.
--
-- Not every Sri Lankan shop is VAT-registered (registration threshold ~LKR 60M/yr),
-- so VAT must be switchable per tenant, and the standard rate has changed over time
-- (15% -> 18%). Store both on the tenant; the app computes VAT at this rate and
-- hides VAT entirely when disabled.

alter table tenants add column if not exists vat_enabled boolean not null default true;
alter table tenants add column if not exists vat_rate numeric(5, 4) not null default 0.18;
