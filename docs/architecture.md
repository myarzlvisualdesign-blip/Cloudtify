# Cloudtify — Technical Architecture

## Overview

Cloudtify is a cloud storage platform built for the Southeast Asian (primarily Indonesian) market. The system uses a modern serverless-first architecture optimized for low cost at startup and horizontal scaling as the user base grows.

```
┌────────────────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                                   │
│   ┌──────────────────────┐        ┌───────────────────────────────┐   │
│   │  React Native + Expo │        │  Next.js (Cloudflare Pages)   │   │
│   │  (iOS + Android)     │        │  Landing + Admin Dashboard     │   │
│   └──────────┬───────────┘        └──────────────┬────────────────┘   │
└──────────────┼──────────────────────────────────┼────────────────────┘
               │                                  │
               │ HTTPS / WSS                       │ HTTPS
               ▼                                  ▼
┌──────────────────────────────────────────────────────────────────────┐
│                         BACKEND LAYER                                │
│                                                                      │
│    ┌────────────────────────────────────────────────────────────┐   │
│    │                 Supabase (Managed Postgres)                 │   │
│    │  ┌──────────┐ ┌──────────┐ ┌─────────────┐ ┌──────────┐  │   │
│    │  │   Auth   │ │  PostgREST│ │Edge Functions│ │ Realtime │  │   │
│    │  │ (GoTrue) │ │  (RLS)   │ │ (Deno/TS)   │ │ (PubSub) │  │   │
│    │  └──────────┘ └──────────┘ └─────────────┘ └──────────┘  │   │
│    └────────────────────────────────────────────────────────────┘   │
│                                                                      │
│    ┌─────────────────────┐    ┌─────────────────────────────────┐   │
│    │   Cloudflare R2     │    │   Firebase Cloud Messaging      │   │
│    │  (Object Storage)   │    │   (Push Notifications)          │   │
│    │  - User files       │    └─────────────────────────────────┘   │
│    │  - Thumbnails       │                                          │
│    │  - Avatars          │    ┌─────────────────────────────────┐   │
│    └─────────────────────┘    │   Midtrans Payment Gateway      │   │
│                               │   (DANA, GoPay, OVO, QRIS, VA)  │   │
│                               └─────────────────────────────────┘   │
└──────────────────────────────────────────────────────────────────────┘
```

## Data Flow: File Upload

```
Mobile App                   Supabase Edge Fn          Cloudflare R2
    │                               │                        │
    │ 1. POST /upload-init           │                        │
    │  {name, mime, size, folder}   │                        │
    │──────────────────────────────►│                        │
    │                               │ 2. Validate quota      │
    │                               │ 3. Create upload row   │
    │                               │ 4. Generate signed URL │
    │                               │──────────────────────►│
    │                               │◄──────────────────────│
    │◄──────────────────────────────│                        │
    │ {upload_id, upload_url, r2_key}                        │
    │                               │                        │
    │ 5. PUT file data directly to R2                        │
    │──────────────────────────────────────────────────────►│
    │◄──────────────────────────────────────────────────────│
    │ 200 OK                        │                        │
    │                               │                        │
    │ 6. POST /upload-complete       │                        │
    │  {upload_id}                  │                        │
    │──────────────────────────────►│                        │
    │                               │ 7. Create files record │
    │                               │ 8. Queue thumbnail gen │
    │                               │ 9. Update storage_usage│
    │◄──────────────────────────────│                        │
    │ {file_id}                     │                        │
```

## What Lives Where

| Data | Storage | Reason |
|------|---------|--------|
| File binary | Cloudflare R2 | Cheap, fast CDN globally |
| Thumbnails | Cloudflare R2 (separate bucket) | Separate CDN URL, cacheable |
| File metadata | Supabase PostgreSQL | Queryable, RLS-protected |
| User profiles | Supabase PostgreSQL | Auth-linked, RLS |
| Auth sessions | Supabase (GoTrue) | Managed auth |
| Upload progress | Supabase PostgreSQL | Resumable tracking |
| Share links | Supabase PostgreSQL | DB-enforced access control |
| Payments/invoices | Supabase PostgreSQL | Audit trail |
| Push tokens | Supabase PostgreSQL | Linked to user devices |

## Supabase Edge Functions

| Function | Purpose |
|---------|---------|
| `upload-init` | Validate quota, create upload row, return signed URL |
| `upload-chunk-url` | Return pre-signed URL for multipart chunk |
| `upload-multipart-complete` | Complete multipart upload in R2 |
| `upload-complete` | Finalize upload, create files record, trigger thumbnail |
| `file-download-url` | Generate time-limited signed download URL |
| `delete-file-permanent` | Delete from both R2 and DB |
| `payment-create` | Create Midtrans transaction, return snap token |
| `payment-webhook` | Handle Midtrans webhook, activate subscription |
| `payment-verify` | Poll payment status for client |
| `delete-account` | Full account deletion GDPR flow |
| `generate-thumbnail` | Background: convert image/video to WebP thumbnail |
| `send-notification` | Trigger FCM push to user devices |

## Security Model

1. **Authentication**: Supabase JWT, 1-hour access token, 7-day refresh token
2. **Authorization**: PostgreSQL RLS on every table — no row accessible without ownership
3. **File Access**: Never expose direct R2 URL to clients — always use signed URLs via Edge Function
4. **Admin Access**: `raw_app_meta_data.role = 'admin'` in auth.users, checked by `is_admin()` DB function
5. **Upload Validation**: MIME type + file extension checked server-side before R2 key is created
6. **Share Links**: Access controlled by DB (status=active, not expired, password matches)
7. **Rate Limiting**: Implement via Upstash Redis in Edge Functions (upload, auth, share access)

## Scaling Considerations

- **Phase 1 (0–10k users)**: Free Supabase + Cloudflare R2. Estimated infra cost: ~$20-50/month
- **Phase 2 (10k–100k)**: Supabase Pro ($25/mo), R2 scales automatically, add Upstash Redis for rate limiting
- **Phase 3 (100k+)**: Consider read replicas, CDN-level caching, dedicated thumbnail generation workers
