# Cloudtify — Product Roadmap

## Phase 1 — MVP (0–30 Days) ✅

**Goal**: Launch with enough features to acquire first 1,000 users and first 50 paying customers.

### Mobile App
- [x] Splash screen + onboarding (3 slides)
- [x] Register / Login / Forgot password
- [x] Email + Google + Apple OAuth
- [x] Home dashboard (storage bar, recent files, quick actions)
- [x] File list (list view, sort, filter)
- [x] Folder creation and navigation
- [x] Breadcrumb navigation
- [x] File upload (single + multi, chunked for large files)
- [x] Upload progress + cancel
- [x] Soft delete (move to trash)
- [x] Rename file/folder
- [x] Share file via link (basic)
- [x] Storage usage screen
- [x] Subscription/upgrade screen
- [x] Midtrans payment integration
- [x] Profile screen
- [x] Logout / logout all devices

### Backend
- [x] Supabase schema + RLS
- [x] Edge Functions (upload flow)
- [x] Cloudflare R2 integration
- [x] Subscription activation webhook (Midtrans)
- [x] Storage usage sync (DB trigger)

### Web
- [x] Landing page (hero, features, pricing, FAQ, CTA)
- [x] Admin dashboard (users, basic stats)

---

## Phase 2 — Growth (30–90 Days)

**Goal**: Increase retention, add features that drive upgrade, reach 5,000 users.

### Mobile App
- [ ] Recycle bin screen (view + restore + empty)
- [ ] Image thumbnail in file list
- [ ] Video preview (in-app streaming)
- [ ] PDF preview
- [ ] Share link with password (Plus)
- [ ] Share link with expiry date (Pro)
- [ ] Link statistics (access count, last accessed)
- [ ] Referral program (invite + bonus storage)
- [ ] Push notifications (upload done, storage warning, promo)
- [ ] Search (full-text, filter by type)
- [ ] Bulk file actions (multi-select move/delete)
- [ ] Favorite files quick access
- [ ] Storage breakdown chart (by category)
- [ ] Settings screen (notification prefs, change password, delete account)
- [ ] Dark/light mode toggle

### Backend
- [ ] Thumbnail generation (Edge Function + R2)
- [ ] FCM push notification sender
- [ ] Referral bonus storage credit
- [ ] Usage milestone notifications
- [ ] Scheduled trash purge (Supabase pg_cron)
- [ ] Share link access analytics

### Admin Panel
- [ ] Revenue chart (MRR, new subs, churned)
- [ ] Storage analytics (total used, avg per plan)
- [ ] Report moderation queue
- [ ] Coupon creation and management
- [ ] Feature flag management
- [ ] Announcement broadcast

### Web/Landing
- [ ] Privacy Policy page
- [ ] Terms & Conditions page
- [ ] Help Center / FAQ page
- [ ] Download page (app store badges)
- [ ] Blog (SEO)

---

## Phase 3 — Scale (90–180 Days)

**Goal**: Enterprise features, 50,000 users, $5,000 MRR.

### Mobile App
- [ ] Private Vault (Ultra — local biometric unlock + encrypted folder)
- [ ] Google Drive import
- [ ] Collaboration (share folder with team)
- [ ] Offline access (download for offline)
- [ ] Advanced media player
- [ ] Document preview (DOCX, XLSX via WebView)
- [ ] Smart folders (auto-organize by type/date)
- [ ] OCR search in documents

### Backend
- [ ] AI-powered duplicate detection
- [ ] Auto-tagging (image content detection)
- [ ] Desktop sync agent (Cloudtify Desktop)
- [ ] API for third-party integrations
- [ ] Advanced abuse detection (ML-based)
- [ ] CSAM detection integration

### Business
- [ ] Team/Business plan
- [ ] White-label B2B offering
- [ ] SEA expansion (Malaysia, Philippines, Vietnam)
- [ ] Annual plan discount campaigns
- [ ] Influencer/affiliate program
