# Stockman

Lightweight inventory management for small producers of sellable goods (vegetables, meat, preserves, etc.). Mobile-first web app with multi-tenant support for concurrent users.

## Tech Stack

- **Frontend**: React + Vite
- **Backend**: Express (REST API)
- **Database**: PostgreSQL
- **Auth**: Supabase Auth _(not in scope for v1)_

## Folder Structure

```
stockman/
├── src/
│   ├── db/              # PostgreSQL schema, migrations, query helpers
│   ├── controllers/     # Business logic (called by routes)
│   ├── routes/          # Express route handlers (thin, delegates to controllers)
│   └── components/      # React UI components
│       └── pages/       # Page-level React views
├── server.js            # Express entry point
├── index.html           # Vite/React entry point
└── vite.config.js
```

## Domain Model

- **Tenant** — a producer account; all data is scoped to a tenant
- **User** — belongs to a Tenant; authenticated via Supabase Auth _(v2)_
- **Category** — grouping for products (e.g. Vegetables, Meat); belongs to a Tenant
- **Unit** — managed per tenant (e.g. kg, stk, kurv, bunt); belongs to a Tenant
- **Product** — a sellable item; belongs to a Category and Tenant
- **Batch** — a specific lot of a Product; has quantity, Unit, harvest date, expiry date, and status

### Batch Status
`available` | `reserved` | `sold`

## Conventions

- Every table has a `tenant_id` — never query across tenants
- Routes are thin: validate input, call a controller, return JSON
- Controllers contain all business logic; they call db helpers, not raw SQL
- `src/db/` contains one file per entity with query functions (no ORM)
- React components in `src/components/`; page-level views in `src/components/pages/`

## Non-Goals (v1)

- Authentication / Supabase Auth (added in v2)
- Barcode scanning
- E-commerce / checkout
- Reporting or analytics
- Public-facing storefront
