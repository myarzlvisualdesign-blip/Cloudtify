# Cloudtify — App Store (iOS) Submission Guide

## Pre-submission Checklist

### Apple Developer Account
- [ ] Enrolled in Apple Developer Program ($99/year)
- [ ] Bundle ID `com.cloudtify.app` registered in App Store Connect
- [ ] App created in App Store Connect
- [ ] Distribution certificate created
- [ ] Provisioning profile created

### App Information (App Store Connect)
- **Name**: Cloudtify — Cloud Storage
- **Subtitle**: Simpan, Bagikan, Kelola File
- **Category**: Productivity
- **Secondary Category**: Utilities
- **Age Rating**: 4+
- **Price**: Free (with In-App Purchases)

### App Description (Indonesian)
```
Cloudtify adalah aplikasi cloud storage modern yang dibuat khusus untuk Indonesia.

FITUR UTAMA:
• 15 GB gratis selamanya, tanpa kartu kredit
• Upload foto, video, dan dokumen dengan mudah
• Buat folder dan kelola file dengan rapi
• Bagikan file via link dengan proteksi password
• Recycle bin 30 hari — file yang terhapus bisa dipulihkan
• Dark mode premium yang elegan
• Mendukung GoPay, DANA, OVO, ShopeePay, dan QRIS

PAKET PREMIUM:
• Plus: 100 GB, Rp15.000/bulan
• Pro: 500 GB, Rp35.000/bulan  
• Ultra: 2 TB, Rp75.000/bulan

Semua pembayaran diproses dengan aman via Midtrans, terdaftar dan diawasi OJK.
```

### Screenshots Required
- 6.7" iPhone (1290×2796): Mandatory
- 5.5" iPhone (1242×2208): Mandatory
- 12.9" iPad (2048×2732): Required if supporting iPad

### Keywords
`cloud storage, penyimpanan, file manager, backup, sharing, upload, foto, dokumen, Indonesia`

### Privacy Policy URL
`https://cloudtify.com/privacy`

### Support URL  
`https://cloudtify.com/help`

### In-App Purchases (IAP)
| Product ID | Type | Display Name | Price |
|-----------|------|-------------|-------|
| `cloudtify_plus_monthly` | Auto-renewable | Cloudtify Plus Bulanan | IDR 15,000 |
| `cloudtify_pro_monthly` | Auto-renewable | Cloudtify Pro Bulanan | IDR 35,000 |
| `cloudtify_ultra_monthly` | Auto-renewable | Cloudtify Ultra Bulanan | IDR 75,000 |

**IAP Configuration:**
- Review notes must explain: "This is a cloud storage subscription. Cancel anytime in App Store settings."
- Subscription Group: "Cloudtify Storage Plans"
- Include upgrade/downgrade paths between tiers

### App Review Notes
```
Test Account:
Email: appreviewer@cloudtify.com
Password: Review@2025!

Additional Notes:
- App requires internet connection for all features
- Free plan provides 15 GB storage without payment
- Premium plans can be purchased via standard IAP
- Payment gateway (Midtrans) is only for web purchases; iOS uses Apple IAP
```

### Privacy Labels (App Privacy)
| Data Type | Collected | Used For |
|-----------|-----------|----------|
| Name | Yes | Account, App Functionality |
| Email | Yes | Account, App Functionality |
| Photos/Videos | Yes | App Functionality only |
| Identifiers (Device ID) | Yes | Analytics (not linked to identity) |
| Usage Data | Yes | Analytics (aggregated, not linked) |
| Crash Data | Yes | App Functionality |

**Data NOT collected:**
- Precise location
- Browsing history
- Search history
- Financial info (handled by Apple IAP)

### Required Capabilities
```
Background Modes: remote-notification, fetch
Associated Domains: applinks:cloudtify.com
Push Notifications: YES
```

### Common Rejection Reasons to Avoid
1. **2.1 Performance** — Ensure no crashes on common flows
2. **3.1.1 IAP** — Use Apple IAP for digital subscriptions, not external payment for digital goods on iOS
3. **5.1.1 Privacy** — Info.plist must have all NSUsageDescription keys
4. **4.0 Design** — Must feel native on iOS, smooth animations
5. **1.1 Objectionable Content** — Content moderation/report system must be functional

### Subscription Terms (Required for IAP)
Display this before purchase confirmation:
```
Langganan Cloudtify akan otomatis diperbarui kecuali dibatalkan minimal 24 jam sebelum 
akhir periode saat ini. Akun kamu akan ditagih dalam waktu 24 jam sebelum akhir periode 
saat ini. Kamu dapat mengelola dan membatalkan langganan dengan masuk ke Pengaturan > 
iTunes & App Store > Apple ID > Lihat Apple ID > Langganan setelah pembelian.
```
