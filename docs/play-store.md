# Cloudtify — Play Store (Android) Submission Guide

## Pre-submission Checklist

### Google Play Console
- [ ] Google Play Developer Account ($25 one-time)
- [ ] App created in Play Console
- [ ] Package name `com.cloudtify.app` confirmed
- [ ] Service account created for EAS Submit

### Store Listing

**Title**: Cloudtify — Cloud Storage Indonesia (max 50 chars)

**Short description** (max 80 chars):
`Cloud storage gratis 15 GB. Bayar pakai GoPay, DANA, QRIS. Murah & cepat.`

**Full description** (max 4000 chars):
```
☁️ Cloudtify — Cloud Storage Premium untuk Indonesia

Simpan semua file kamu di cloud dengan aman dan mudah. Cloudtify hadir dengan tampilan 
modern, harga terjangkau, dan dukungan metode pembayaran Indonesia.

GRATIS SELAMANYA:
✓ 15 GB storage gratis, tanpa kartu kredit
✓ Upload foto, video, dan dokumen
✓ Buat folder dan kelola file
✓ Bagikan file via link

PREMIUM MULAI Rp15.000/BULAN:
✓ Hingga 2 TB storage
✓ Tanpa iklan
✓ Password & tanggal kadaluarsa untuk link berbagi
✓ Upload file hingga 2 GB
✓ Prioritas server & kecepatan lebih tinggi

METODE PEMBAYARAN INDONESIA:
💚 GoPay | 🔵 DANA | 🟣 OVO | 🔴 ShopeePay | QRIS | Transfer Bank

KEAMANAN TERJAMIN:
🔒 Enkripsi end-to-end untuk file tersimpan
🔒 Link berbagi bisa diproteksi password
🔒 Hapus akun dan data kapan saja

Unduh sekarang dan mulai simpan file kamu secara gratis!
```

### Graphic Assets Required
- **Icon**: 512×512 PNG (no alpha, no rounded corners — Google handles rounding)
- **Feature Graphic**: 1024×500 PNG/JPG
- **Screenshots** (min 2, max 8 per type):
  - Phone: 16:9 or 9:16
  - 7-inch tablet (optional but recommended)
  - 10-inch tablet (optional)

### Content Rating
Fill out content rating questionnaire:
- Category: **Productivity**
- No violence, sexual content, or hate speech
- Users can upload files (flag this; Google may require review)
- Report abuse feature: YES → include URL

**Expected rating: Everyone (E)**

### Target Audience
- Primary: Indonesia (ID)
- Minimum Android version: 8.0 (API 26)
- Target SDK: 34

### In-App Purchases (Google Play Billing)
| Product ID | Type | Description |
|-----------|------|-------------|
| `cloudtify_plus_monthly` | Auto-recurring | Cloudtify Plus Bulanan |
| `cloudtify_pro_monthly` | Auto-recurring | Cloudtify Pro Bulanan |
| `cloudtify_ultra_monthly` | Auto-recurring | Cloudtify Ultra Bulanan |

**Subscription setup:**
- Base plans with monthly billing period
- Grace period: 3 days
- Hold period: 30 days
- Pause option: enabled

### Data Safety Section (Required)
**Data collected:**
| Type | Shared | Encrypted | Required | Purpose |
|------|--------|-----------|----------|---------|
| Name | No | Yes | Yes | Account management |
| Email | No | Yes | Yes | Account management |
| Files | No | Yes | Yes | Core functionality |
| App interactions | No | N/A | No | Analytics |
| Crash logs | No | N/A | No | App improvement |
| Device ID | No | N/A | No | Analytics |

**Data NOT collected:** Financial info, precise location, contacts, SMS.

### App Signing
- Use Google Play App Signing (recommended)
- Upload key created during EAS build
- Keep the upload keystore backed up securely

### Release Tracks
1. **Internal Testing** → APK from `eas build --profile preview`
2. **Closed Testing (Alpha)** → Limited invitees, 2-week period
3. **Open Testing (Beta)** → Public, 2-week period
4. **Production** → Full release

### Common Play Store Policies to Follow
1. **Billing Policy** — Google Play Billing required for in-app digital goods
2. **Permissions** — Only request permissions needed for current use
3. **Malware Policy** — App must not download executable code
4. **User Data Policy** — Privacy policy must match data safety section
5. **Developer Distribution Agreement** — Review once per year for changes

### Pre-launch Report
Google Play automatically runs your APK through:
- Firebase Test Lab (device compatibility)
- Accessibility checker
- Security scan

Fix any critical issues before production release.
