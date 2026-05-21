# ☁️ Cloudtify

> **Premium Cloud Storage for Southeast Asia** — More affordable, faster, and cleaner than the rest.

[![GitHub license](https://img.shields.io/github/license/myarzlvisualdesign-blip/Cloudtify)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue)](https://typescriptlang.org)
[![Expo SDK](https://img.shields.io/badge/Expo-52-black)](https://expo.dev)
[![Supabase](https://img.shields.io/badge/Supabase-Pro-green)](https://supabase.com)

---

## What is Cloudtify?

Cloudtify is a production-ready cloud storage mobile application built for the Southeast Asian market — particularly Indonesia. Think of it as a modern, affordable, and privacy-respecting alternative to existing cloud storage services.

**Key differentiators:**
- 🇮🇩 Built for Indonesia — supports GoPay, DANA, OVO, ShopeePay, QRIS, VA
- 💰 Competitive pricing with freemium model
- ⚡ Fast upload/download via Cloudflare R2 CDN
- 🎨 Premium, minimal UI — zero clutter
- 🔒 Security-first architecture
- 📱 Native iOS & Android via React Native + Expo

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Mobile | React Native + Expo SDK 52 + TypeScript |
| Routing | Expo Router v4 |
| Styling | NativeWind v4 (Tailwind for RN) |
| State | Zustand + React Query v5 |
| Validation | Zod + React Hook Form |
| Backend | Supabase (Auth + DB + Edge Functions) |
| Database | PostgreSQL (via Supabase) |
| Storage | Cloudflare R2 |
| Payment | Midtrans (web) + Google Play Billing + Apple IAP |
| Push | Firebase Cloud Messaging |
| Analytics | PostHog |
| Web | Next.js 15 + Cloudflare Pages |
| CI/CD | GitHub Actions + EAS Build |

---

## Monorepo Structure

```
cloudtify/
├── apps/
│   ├── mobile/          # React Native + Expo app (iOS + Android)
│   └── web/             # Next.js — Admin Dashboard + Landing Page
├── packages/
│   ├── database/        # SQL migrations, RLS policies, seed data
│   ├── types/           # Shared TypeScript types & Zod schemas
│   └── utils/           # Shared utility functions
├── docs/                # Architecture, API, deployment documentation
└── .github/workflows/   # GitHub Actions CI/CD
```

---

## Quick Start

### Prerequisites

- Node.js >= 20
- npm >= 10
- Expo CLI (`npm i -g expo-cli eas-cli`)
- Supabase CLI (`npm i -g supabase`)
- A Supabase project (Pro recommended)
- A Cloudflare account with R2 enabled
- A Midtrans account (sandbox for dev)

### 1. Clone & Install

```bash
git clone https://github.com/myarzlvisualdesign-blip/Cloudtify.git
cd Cloudtify
npm install
```

### 2. Configure Environment

```bash
cp .env.example .env.local
# Fill in all values in .env.local
```

### 3. Setup Database

```bash
cd packages/database
supabase login
supabase link --project-ref YOUR_PROJECT_REF
npm run db:migrate
npm run db:seed
```

### 4. Run Mobile App

```bash
cd apps/mobile
npx expo start
```

### 5. Run Web App

```bash
cd apps/web
npm run dev
```

---

## Plans & Pricing

| Plan | Storage | Price/month | Price/year |
|------|---------|-------------|------------|
| **Free** | 15 GB | Rp 0 | Rp 0 |
| **Plus** | 100 GB | Rp 15.000 | Rp 120.000 |
| **Pro** | 500 GB | Rp 35.000 | Rp 280.000 |
| **Ultra** | 2 TB | Rp 75.000 | Rp 600.000 |

---

## Roadmap

- **Phase 1 (MVP):** Auth, Upload, Files, Folders, Subscription, Sharing
- **Phase 2:** Recycle Bin, Thumbnails, Referral, Push Notifications, Admin Analytics
- **Phase 3:** Collaboration, Desktop Sync, AI Features, Smart Upload

---

## Documentation

- [Architecture Overview](docs/architecture.md)
- [API Reference](docs/api.md)
- [Database Schema](docs/database.md)
- [Deployment Guide](docs/deployment.md)
- [App Store Submission](docs/app-store.md)
- [Play Store Submission](docs/play-store.md)
- [Security Checklist](docs/security.md)
- [QA Checklist](docs/qa.md)
- [Cost Strategy](docs/cost-strategy.md)

---

## License

MIT License — see [LICENSE](LICENSE) for details.

---

Built with ❤️ for Indonesia 🇮🇩
