# SousXChef SaaS backend

Multi-tenant restaurant ops platform (Phase 2A).

## Model

- **Organization** — billing + admin boundary (Line $149 / Pass $349 / House)
- **Restaurant** — one location (ICP unit). Inventory, labour, chat, forecast, Telegram scoped here
- **Membership** — `owner | manager | staff` on org
- Platform onboards **many restaurants**; GTM still sells single-location

```
auth.users
  └─ memberships ── organizations ── subscriptions
                         │
                         └─ restaurants ── inventory_* / schedules / messages / forecast / telegram_links
                                          └─ audit_events
```

## Migrations

Apply in Supabase SQL editor (order):

1. `supabase/migrations/001_init.sql`
2. `supabase/migrations/002_saas_multitenant.sql`

Key RPC:

- `onboard_restaurant(...)` — org + restaurant + owner membership + trial sub + telegram link + optional SKU seed
- `add_restaurant_location(org, ...)` — managers+ add another kitchen

## API

All live routes need Supabase session cookie except:

- `GET /api/health`
- `POST /api/telegram/webhook` (secret header + service role)

Tenant header: `x-restaurant-id: <uuid>` (falls back to `profiles.active_restaurant_id`).

| Method | Path | Notes |
|---|---|---|
| GET | `/api/health` | Config flags (no secrets) |
| POST | `/api/onboarding` | First kitchen |
| GET/POST | `/api/restaurants` | List / add location |
| GET/PATCH | `/api/restaurants/[id]` | Detail / update / `setActive` |
| GET/POST | `/api/inventory` | Items |
| POST | `/api/inventory/logs` | Photo log (`aiCount: null` stub) |
| GET/POST | `/api/schedule` | Labour slots |
| GET/POST | `/api/chat` | Persist + answer from **that** kitchen inventory |
| GET/POST | `/api/forecast` | Cover hints |
| GET/POST | `/api/telegram/link` | Mint / read link code |
| POST | `/api/telegram/webhook` | Bind `/start link_xxx` → Q&A |
| POST | `/api/billing/checkout` | Stub until Stripe keys |
| GET | `/api/billing/status` | Subscription row |

Demo mode: missing Supabase env → seed answers, no DB writes required.

## Telegram (token later)

1. BotFather → `TELEGRAM_BOT_TOKEN` + `NEXT_PUBLIC_TELEGRAM_BOT_USERNAME`
2. Set `TELEGRAM_WEBHOOK_SECRET` (required in production)
3. `setWebhook` to `https://sousxchef.online/api/telegram/webhook` with same secret
4. Owner: Settings → mint link → staff `/start link_…`

## Roles

| Action | owner | manager | staff |
|---|---|---|---|
| Onboard / billing | yes | — | — |
| Add location / mint Telegram | yes | yes | — |
| Inventory / schedule / chat / forecast | yes | yes | read+chat (RLS access) |

## Out of this phase

Live Stripe Checkout, OpenRouter vision counts, WhatsApp, queue workers.
