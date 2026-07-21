<p align="center">
  <strong>SousXChef</strong>
</p>

<h1 align="center">AI agents for restaurant kitchens</h1>

<p align="center">
  Inventory photo logs · labour scheduling · staff Telegram chat · demand forecasting · owner dashboard.<br />
  Built for single-location independents — not enterprise bloat.
</p>

<p align="center">
  <a href="https://sousxchef.online"><img src="https://img.shields.io/badge/Live-sousxchef.online-d4a574?style=for-the-badge" alt="Live" /></a>
  <a href="https://sou-sx-chef.vercel.app"><img src="https://img.shields.io/badge/Demo-Vercel-000000?style=for-the-badge&logo=vercel" alt="Vercel" /></a>
  <a href="https://sousxchef.online/blog"><img src="https://img.shields.io/badge/Blog-SEO-080808?style=for-the-badge" alt="Blog" /></a>
  <a href="https://calendly.com/uptisement/30min"><img src="https://img.shields.io/badge/Book-Demo-121416?style=for-the-badge" alt="Demo" /></a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16-black?logo=nextdotjs&logoColor=white" alt="Next.js" />
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/GSAP-ScrollTrigger-88CE02?logo=greensock&logoColor=white" alt="GSAP" />
  <img src="https://img.shields.io/badge/Tailwind-v4-38BDF8?logo=tailwindcss&logoColor=white" alt="Tailwind" />
  <img src="https://img.shields.io/badge/Supabase-optional-3FCF8E?logo=supabase&logoColor=white" alt="Supabase" />
</p>

---

## Live

| | |
|---|---|
| **Product** | [sousxchef.online](https://sousxchef.online) |
| **Vercel** | [sou-sx-chef.vercel.app](https://sou-sx-chef.vercel.app) |
| **Blog** | [sousxchef.online/blog](https://sousxchef.online/blog) |
| **Sitemap** | [sousxchef.online/sitemap.xml](https://sousxchef.online/sitemap.xml) |
| **Book 10 min** | [Calendly](https://calendly.com/uptisement/30min) |

---

## Why it exists

Owners still run inventory on clipboards and labour on Sunday gut feel. Staff ping “are we out of X?” in group chat mid-service.

SousXChef turns that chaos into agents:

| Agent | Job |
|---|---|
| Inventory | Photo → counts + waste alerts |
| Labour | Busy-pattern staffing suggestions |
| Chat | Staff Telegram / WhatsApp-style answers |
| Forecast | Cover hints for ordering |
| Dashboard | Live KPIs for the owner |

---

## Landing (shipped)

Cinematic **GSAP pin + video scrub** walkthrough (`showcase.mp4`) → CTA → agents → proof → pricing.

**Pricing on-page:** Line \$149 · Pass \$349 · House custom  

**Tokens:** Ink `#080808` · Steel `#121416` · Ember `#d4a574`  
**Type:** Cormorant Garamond · Outfit · Space Mono

---

## App routes

| Path | Description |
|---|---|
| `/` | Immersive scroll landing |
| `/blog` | SEO content (JSON posts + daily agent) |
| `/login` `/signup` | Auth (Supabase when configured) |
| `/onboarding` | Kitchen questionnaire |
| `/dashboard/*` | Inventory · schedule · chat · forecast · settings |

**Demo mode:** works with zero secrets — data in `localStorage` (`sousxchef-demo-v1`).

---

## Quick start

```bash
git clone https://github.com/adil-044/SouSxChef.git
cd SouSxChef
npm install
npm run dev
```

Open `/` → **Get started** or `/login` → **Continue in demo mode**.

### Optional env

Copy `.env.example` → `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
TELEGRAM_BOT_TOKEN=
TELEGRAM_BOT_USERNAME=SousXChefBot
TELEGRAM_WEBHOOK_SECRET=
NEXT_PUBLIC_APP_URL=https://sousxchef.online
```

Schema: [`supabase/migrations/001_init.sql`](supabase/migrations/001_init.sql)

---

## SEO agent

Daily restaurant-genre posts via `seo-agent/` (OpenRouter free models → `content/blog/*.json`).

---

## Author

**Adil (Dean)** — Ottawa / Hamilton  
Next.js + GSAP product builder. Open to freelance landing pages & SaaS MVPs.

- [@adil-044](https://github.com/adil-044)
- [HireReady](https://github.com/adil-044/resume-ats) — ATS resume optimizer
- [calendly.com/uptisement/30min](https://calendly.com/uptisement/30min)

---

## License

Source available for portfolio review. Commercial use — ask first.
