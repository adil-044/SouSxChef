# SousXChef

AI agents for restaurant kitchens — inventory, labor, Telegram chat, forecasting, and an owner dashboard.

**Live:** [sousxchef.online](https://sousxchef.online) · [sou-sx-chef.vercel.app](https://sou-sx-chef.vercel.app)

## Stack

- Next.js 16 (App Router) + TypeScript + Tailwind v4
- GSAP ScrollTrigger cinematic landing
- Supabase Auth/Postgres (optional — **Demo mode** without keys)
- Telegram Bot webhook (`/api/telegram/webhook`)

## App routes

| Path | Description |
|------|-------------|
| `/` | Immersive scroll landing |
| `/login` `/signup` | Auth UI (Supabase when configured) |
| `/onboarding` | Multi-step kitchen questionnaire |
| `/dashboard` | Owner home + KPIs |
| `/dashboard/inventory` | SKU table + count log |
| `/dashboard/schedule` | Weekly labor grid |
| `/dashboard/chat` | Staff / agent thread |
| `/dashboard/forecast` | Cover hints |
| `/dashboard/settings` | Telegram link |

## Local demo (no secrets)

```bash
npm install
npm run dev
```

1. Open `/` → **Get started** or `/login` → **Continue in demo mode**
2. Complete onboarding → dashboard
3. Data persists in `localStorage` (`sousxchef-demo-v1`)

## Environment

Copy `.env.example` → `.env.local` when ready:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
TELEGRAM_BOT_TOKEN=
TELEGRAM_BOT_USERNAME=SousXChefBot
TELEGRAM_WEBHOOK_SECRET=
NEXT_PUBLIC_APP_URL=https://sousxchef.online
```

SQL schema: [`supabase/migrations/001_init.sql`](supabase/migrations/001_init.sql)

### Telegram webhook (later)

```bash
curl "https://api.telegram.org/bot$TELEGRAM_BOT_TOKEN/setWebhook?url=$NEXT_PUBLIC_APP_URL/api/telegram/webhook&secret_token=$TELEGRAM_WEBHOOK_SECRET"
```

## Design

Ink `#080808` · Steel `#121416` · Ember `#d4a574`  
Fonts: Cormorant Garamond · Outfit · Space Mono
