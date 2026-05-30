# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Cloudtify is a premium cloud storage app targeting the Indonesian/SEA market. It is a **Turbo monorepo** with three workspaces:
- `apps/mobile` — React Native + Expo SDK 52 (iOS & Android)
- `apps/web` — Next.js 15 static export → Cloudflare Pages
- `packages/types`, `packages/utils`, `packages/database` — shared libraries

## Commands

### Monorepo (run from root)
```bash
npm run dev          # Run all apps in watch mode
npm run build        # Build all packages and apps
npm run lint         # Lint all workspaces
npm run type-check   # TypeScript check all workspaces
npm run test         # Run tests (builds packages first)
npm run mobile       # Run only the mobile Expo dev server
npm run web          # Run only the Next.js dev server
npm run clean        # Remove all node_modules and build outputs
npm run db:migrate   # Push Supabase SQL migrations
npm run db:seed      # Seed database (runs migrate first)
```

### Mobile (from `apps/mobile/`)
```bash
npx expo start                    # Start Expo dev server (scan with Expo Go)
npx expo run:android              # Build and launch on Android emulator
npx expo run:ios                  # Build and launch on iOS simulator
npx eas build --profile preview   # Build distributable APK/IPA (internal)
npx eas build --profile production # Production store build
npx eas submit --platform android # Submit to Google Play (internal track)
npx eas submit --platform ios     # Submit to App Store Connect
```

### Web (from `apps/web/`)
```bash
npm run dev    # Next.js dev server at localhost:3000
npm run build  # Static export to apps/web/out/
npm run lint   # ESLint with Next.js rules
```

## Architecture

### Data Flow
```
Supabase (PostgreSQL + Auth + Edge Functions)
    ↕ RLS policies enforce per-user isolation
Mobile/Web clients → Supabase JS SDK → DB
File uploads → Edge Function (upload-init) → Cloudflare R2 (direct PUT or multipart)
File metadata → Supabase DB → files table
Signed URLs → Edge Function (file-signed-url) → R2 presigned URL
Payments → Midtrans API (via Edge Function) → webhook → subscription update
Push notifications → Firebase Cloud Messaging → Expo Notifications
```

### Mobile App Structure (`apps/mobile/app/`)
Expo Router v4 file-based routing. The full route tree:
```
index.tsx                       → redirects to /onboarding or /(tabs)/home
(tabs)/
  _layout.tsx                   → Tab bar (4 tabs: Home, Files, Search, Profile)
  home.tsx                      → Dashboard with storage overview
  files.tsx                     → File browser with infinite scroll + multi-select
  search.tsx                    → Full-text file search with category filters
  profile.tsx                   → User profile, settings, logout
auth/
  login.tsx / register.tsx      → Forms using react-hook-form + zod
  forgot-password.tsx           → Email reset flow
  verify-email.tsx              → Post-registration verification screen
onboarding/index.tsx            → 3-slide carousel with LinearGradient
preview/[id].tsx                → File preview (image native, others show icon)
share/[slug].tsx                → Public share access (password gate if protected)
subscription/upgrade.tsx        → Upgrade modal with Midtrans checkout
folders/create.tsx              → Modal to create folder (color + icon picker)
profile/notifications.tsx       → Notification list
profile/storage.tsx             → Storage breakdown by category
```

### State Management
Two Zustand stores:
- **`auth.store.ts`** — `user`, `session`, `profile`, `subscription`. Hydrated in root `_layout.tsx` by listening to `supabase.auth.onAuthStateChange`. Use the exported selectors (`useIsAuthenticated`, `useCurrentPlan`, `useIsPremium`, `useStorageGB`) rather than reading the store directly.
- **`upload.store.ts`** — Upload queue with concurrent-limit enforcement. Items move through states: `queued → uploading → done/error/cancelled`. Use `useUploadQueue`, `useActiveUploads`, `useHasActiveUploads` selectors.

TanStack Query v5 is used for all server data. Query keys are co-located with hooks in `hooks/useFiles.ts` (exported as `FILE_KEYS`). Always invalidate the correct key scope after mutations.

### Service Layer (`apps/mobile/services/`)
| File | Responsibility |
|---|---|
| `supabase/client.ts` | Supabase client with `ExpoSecureStoreAdapter` for token persistence |
| `supabase/auth.ts` | Auth methods (register, login, OAuth, password reset, delete account) |
| `supabase/files.ts` | `fileService` (CRUD, soft-delete, restore, favorites) + `folderService` (CRUD, breadcrumbs) |
| `storage/r2.ts` | Upload (single + multipart), signed URL retrieval, thumbnail URL helpers |
| `payment/midtrans.ts` | Initiate Midtrans checkout transaction |
| `analytics/index.ts` | PostHog event tracking (fire-and-forget, never throws) |

### Upload Pipeline
1. `useUpload` hook validates file (extension blocklist, MIME allowlist, plan size limit)
2. Enqueues item in upload store
3. Calls `uploadFile()` in `r2.ts` which:
   - Invokes `upload-init` Edge Function → gets presigned URL + `upload_id`
   - Uses single PUT if `< 5 MB`, chunked multipart if `≥ 5 MB` (10 MB chunks)
   - Invokes `upload-complete` Edge Function → creates DB record
4. Invalidates `FILE_KEYS.lists()` and `['storage']` query keys

### Web App (`apps/web/`)
Next.js 15 App Router, output as static export (Cloudflare Pages via `wrangler.toml`). Route groups:
- `(public)/` — `pricing`, `terms`, `privacy`, `help` pages
- `(dashboard)/` — `dashboard`, `files`, `history`, `settings` (auth required)
- `admin/` — admin panel
- `auth/login`, `auth/register` — standalone auth pages

Landing page (`app/page.tsx`) assembles 7 section components from `components/landing/`. Each section is self-contained with inline Framer Motion animations.

### Shared Packages
**`@cloudtify/types`** (`packages/types/src/`):
- `models.ts` — all DB entity interfaces
- `enums.ts` — union types: `SubscriptionPlan`, `SortField`, `SortOrder`, `FileVisibility`, etc.
- `schemas.ts` — Zod schemas for form validation (`RegisterSchema`, `LoginSchema`)
- `constants.ts` — plan limits, pricing (`PLAN_PRICE_IDR_MONTHLY/YEARLY`), upload limits
- `api.ts` — request/response shapes, `UploadQueueItem`, `AnalyticsEvent`

**`@cloudtify/utils`** (`packages/utils/src/`):
- `format.ts` — `formatBytes`, `formatIDR`, `formatFileDate`, `formatStoragePercent`, `getStorageStatus`, `getStorageStatusColor`
- `file.ts` — `getFileCategory`, `getFileCategoryIcon`, `getFileCategoryColor`, `isBlockedExtension`, `isAllowedMimeType`, `sanitizeFileName`, `truncateFileName`
- `errors.ts` — `CloudtifyError` class with Indonesian user messages; `parseSupabaseError` converts Supabase errors
- `storage.ts` / `upload.ts` — storage utility helpers

## Key Conventions

### Styling
- **Mobile**: NativeWind v4. All styles via `className`. Dark theme base color is `bg-dark-950` (`#0A0F1E`). Primary is `primary-500` (`#3B82F6`).
- **Web**: Tailwind CSS 3. Background `#FAFAF8` (warm off-white). Font: `font-display` (Plus Jakarta Sans) for headings, `font-sans` (Inter) for body.
- Prettier: 100-char lines, no semicolons, single quotes, trailing commas (ES5), Tailwind class sorting.

### Icons (Mobile)
Use `react-native-svg` inline SVGs — do **not** add emoji as icons in UI components. The pattern is:
```tsx
import Svg, { Path, Circle, ... } from 'react-native-svg'
function MyIcon({ color = '#94A3B8' }) {
  return <Svg width={20} height={20} viewBox="0 0 24 24" fill="none" strokeLinecap="round">...</Svg>
}
```

### Error Handling
Always throw `CloudtifyError` from services (or let `parseSupabaseError` convert it). Catch in UI and pass `error.message` to `toast.error()`. The `analyticsService` is fire-and-forget and must never throw.

### Form Validation (Mobile)
Use `react-hook-form` + `zodResolver` from `@hookform/resolvers/zod`. Schema lives in `@cloudtify/types/schemas`. All validation messages are in Indonesian.

### Navigation
`router.push()` for stack navigation, `router.replace()` for auth redirects (so back button doesn't loop). Modals use `options={{ presentation: 'modal' }}` or `'fullScreenModal'` declared in `app/_layout.tsx`.

## Android/iOS Build Setup

Before running `eas build`, ensure:
1. Replace `YOUR_EAS_PROJECT_ID` in `apps/mobile/app.json` with your actual EAS project ID (`eas init`)
2. Add `apps/mobile/google-services.json` (from Firebase Console) for push notifications on Android
3. Create `apps/mobile/.env` (or EAS secrets) with all `EXPO_PUBLIC_*` variables from `.env.example`
4. For iOS: update `appleId`, `ascAppId`, `appleTeamId` in `apps/mobile/eas.json` under `submit.production.ios`
5. For Android store submission: add `apps/mobile/android-service-account.json`

Build profiles in `eas.json`:
- `development` — development client, internal distribution (for physical device testing with `expo-dev-client`)
- `preview` — APK build, internal distribution (no store account needed)
- `production` — AAB/IPA for store submission, auto-increments version code

## Environment Variables

All required variables are in `.env.example`. Mobile uses `EXPO_PUBLIC_*` prefix (bundled at build time). Key groups:
- `SUPABASE_URL` / `EXPO_PUBLIC_SUPABASE_URL` — same value, different consumers
- `EXPO_PUBLIC_R2_PUBLIC_URL` — public CDN URL for serving files
- `EXPO_PUBLIC_R2_THUMBNAIL_URL` — CDN URL for thumbnails (separate R2 bucket)
- `EXPO_PUBLIC_MIDTRANS_CLIENT_KEY` — Midtrans client key (safe to expose)
- `EXPO_PUBLIC_POSTHOG_KEY` — PostHog analytics key

## Database

Migrations in `packages/database/migrations/`:
1. `001_initial_schema.sql` — all tables
2. `002_functions_triggers.sql` — PG functions and triggers (storage usage auto-update, etc.)
3. `003_rls_policies.sql` — Row-Level Security (every table is locked to `auth.uid()`)

Run via: `npm run db:migrate` (uses Supabase CLI internally).
