# Cloudtify — Deployment Guide

## Prerequisites

| Tool | Version | Purpose |
|------|---------|---------|
| Node.js | ≥ 20 | Build & run scripts |
| npm | ≥ 10 | Package manager |
| Supabase CLI | latest | DB migrations |
| EAS CLI | latest | Mobile builds |
| Wrangler | latest | Cloudflare deployment |
| `gh` CLI | latest | GitHub repo management |

## Step 1 — Environment Setup

```bash
# Clone repo
git clone https://github.com/myarzlvisualdesign-blip/Cloudtify.git
cd Cloudtify

# Install all dependencies
npm install

# Copy env file
cp .env.example .env.local
# → Fill in all values in .env.local
```

## Step 2 — Supabase Setup

```bash
# Install Supabase CLI
npm install -g supabase

# Login
supabase login

# Create new project at supabase.com first, then link
supabase link --project-ref YOUR_PROJECT_REF

# Run all migrations
supabase db push

# Generate TypeScript types (after migrations)
cd packages/database
npm run db:types
```

**Configure Supabase Dashboard:**
- Auth > URL Configuration > Site URL: `https://cloudtify.com`
- Auth > URL Configuration > Redirect URLs: `cloudtify://auth/callback, cloudtify://auth/reset-password, https://cloudtify.com/auth/callback`
- Auth > Providers > Enable Google, Apple
- Auth > Email templates > Update with Cloudtify branding
- Storage > Create bucket `cloudtify-files` (private, max file size: 2GB)
- Storage > Create bucket `cloudtify-thumbnails` (public)

## Step 3 — Cloudflare R2 Setup

```bash
# Login to Cloudflare
wrangler login

# Create R2 buckets
wrangler r2 bucket create cloudtify-files
wrangler r2 bucket create cloudtify-thumbnails

# Create API token with R2 permissions
# Dashboard → My Profile → API Tokens → Create Token
# → Template: "Edit Cloudflare Workers" + R2 permissions
```

**Configure R2 custom domain:**
- R2 > cloudtify-files > Settings > Custom Domains > `files.cloudtify.com`
- R2 > cloudtify-thumbnails > Settings > Custom Domains > `thumb.cloudtify.com`

## Step 4 — Firebase Setup

```bash
# Create project at console.firebase.google.com
# Project settings > General > Your apps > Add app (Android + iOS)
# Download google-services.json → apps/mobile/google-services.json
# Download GoogleService-Info.plist → apps/mobile/ios/GoogleService-Info.plist

# Cloud Messaging > Server key → use as FIREBASE_PRIVATE_KEY
```

## Step 5 — Midtrans Setup

```bash
# Register at midtrans.com
# Dashboard > Settings > Access Keys
# Copy Server Key and Client Key
# Set MIDTRANS_ENVIRONMENT=sandbox for testing
# Change to production when going live
```

## Step 6 — Deploy Web App (Cloudflare Pages)

```bash
# Option A: GitHub integration (recommended)
# Cloudflare Dashboard > Pages > Create project > Connect to Git
# Select Cloudtify repo, branch: main, root: apps/web
# Build command: npm run build
# Output directory: out
# Add env variables in Cloudflare Pages settings

# Option B: Manual deployment
cd apps/web
npm run build
wrangler pages deploy ./out --project-name cloudtify-web
```

## Step 7 — Build Mobile App

```bash
# Configure EAS
cd apps/mobile
eas login
eas build:configure   # Creates EAS project, updates app.json

# Build preview APK (Android, for internal testing)
eas build --platform android --profile preview

# Build production (both platforms)
eas build --platform all --profile production
```

## Step 8 — App Store Submission

```bash
# Android (Play Store internal track)
eas submit --platform android --latest

# iOS (TestFlight → App Store)
eas submit --platform ios --latest
```

## Step 9 — Supabase Edge Functions Deploy

```bash
cd packages/database

# Deploy all edge functions
supabase functions deploy upload-init
supabase functions deploy upload-complete
supabase functions deploy file-download-url
supabase functions deploy delete-file-permanent
supabase functions deploy payment-create
supabase functions deploy payment-webhook
supabase functions deploy payment-verify
supabase functions deploy delete-account
supabase functions deploy send-notification

# Set secrets for edge functions
supabase secrets set \
  R2_ACCOUNT_ID=your_account_id \
  R2_ACCESS_KEY_ID=your_key \
  R2_SECRET_ACCESS_KEY=your_secret \
  R2_BUCKET_NAME=cloudtify-files \
  MIDTRANS_SERVER_KEY=your_midtrans_key \
  FIREBASE_PROJECT_ID=cloudtify-app \
  FIREBASE_CLIENT_EMAIL=your_service_account \
  FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----..."
```

## GitHub Actions Secrets

Add these secrets to your GitHub repository (Settings > Secrets):

| Secret | Value |
|--------|-------|
| `SUPABASE_URL` | Your Supabase project URL |
| `SUPABASE_ANON_KEY` | Your Supabase anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Your Supabase service role key |
| `CLOUDFLARE_API_TOKEN` | Cloudflare API token with Pages permissions |
| `CLOUDFLARE_ACCOUNT_ID` | Your Cloudflare account ID |
| `EXPO_TOKEN` | Your Expo access token (`eas whoami --json`) |
| `EXPO_PUBLIC_SUPABASE_URL` | Same as SUPABASE_URL |
| `EXPO_PUBLIC_SUPABASE_ANON_KEY` | Same as anon key |
| `EXPO_PUBLIC_MIDTRANS_CLIENT_KEY` | Your Midtrans client key |
| `EXPO_PUBLIC_POSTHOG_KEY` | PostHog project API key |
| `EXPO_PUBLIC_R2_PUBLIC_URL` | `https://files.cloudtify.com` |
| `EXPO_PUBLIC_R2_THUMBNAIL_URL` | `https://thumb.cloudtify.com` |

## DNS Configuration

| Record | Type | Value |
|--------|------|-------|
| `cloudtify.com` | A | Cloudflare Pages IP |
| `www.cloudtify.com` | CNAME | cloudtify.com |
| `admin.cloudtify.com` | CNAME | cloudtify-admin.pages.dev |
| `files.cloudtify.com` | CNAME | (R2 custom domain) |
| `thumb.cloudtify.com` | CNAME | (R2 thumbnails domain) |

## Cost Estimate (Monthly at Launch)

| Service | Free Tier | Paid (after growth) |
|---------|-----------|---------------------|
| Supabase | Free (500 MB DB, 1 GB storage) | Pro: $25/mo |
| Cloudflare R2 | 10 GB free, 1M ops free | ~$0.015/GB + $0.0036/M ops |
| Cloudflare Pages | Free (unlimited requests) | Free |
| Firebase FCM | Free (up to 1M/month) | Free |
| Midtrans | Free (per-transaction fee) | 0.7% + Rp2000/transaction |
| EAS Build | 30 builds/month free | $99/mo unlimited |
| **Total launch** | **~$0** | **Scales with revenue** |
