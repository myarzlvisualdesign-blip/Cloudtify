# Cloudtify — Cost Strategy & Monetization

## Infrastructure Cost Drivers

### What Drives Cost Up
1. **Bandwidth** — Downloading 1 GB = ~$0.015 from R2. Free users who download heavily cost money.
2. **Storage** — Each GB stored in R2 = ~$0.015/month. Free users using 15 GB = $0.225/month each.
3. **Requests** — Each R2 operation (upload/download/list) costs. Mass thumbnail generation is expensive.
4. **Supabase** — DB rows, storage, Edge Function CPU time, auth operations.

### How We Control Costs

| Mechanism | Impact |
|-----------|--------|
| Strict quotas per plan | Prevents storage abuse |
| Download speed limiting for free users | Reduces bandwidth cost |
| Chunked upload with validation | Catches abusers early |
| Thumbnail generation only for images/videos | Avoid processing every file |
| 30-day trash (not permanent storage) | Soft limit on trash bandwidth |
| Ads on free plan | Partial revenue from free users |
| Referral bonus cap (50 GB max) | Limits bonus storage |
| Rate limiting on upload API | Prevents mass upload abuse |

## Unit Economics (Estimates)

### Cost per Active User per Month
| Plan | Storage Used (avg) | Bandwidth (avg) | Infra Cost |
|------|--------------------|-----------------|------------|
| Free | 3 GB | 5 GB | ~$0.12 |
| Plus | 20 GB | 10 GB | ~$0.45 |
| Pro  | 80 GB | 20 GB | ~$1.50 |
| Ultra | 300 GB | 50 GB | ~$5.25 |

### Revenue per User per Month
| Plan | Revenue IDR | Revenue USD |
|------|------------|-------------|
| Free | 0 | 0 |
| Plus | Rp15,000 | ~$0.99 |
| Pro  | Rp35,000 | ~$2.30 |
| Ultra| Rp75,000 | ~$4.99 |

### Margin
- Plus: ~55% gross margin
- Pro: ~35% gross margin
- Ultra: ~5-10% gross margin (heavy users)
- Free: negative (subsidized by paid users)

**Target: 10% free-to-paid conversion = sustainable unit economics**

## Pricing Strategy

### Anchor Pricing
- Show Ultra first to make Pro look like a bargain
- "Most Popular" badge on Pro to direct conversion
- Yearly plan shows monthly equivalent (looks cheaper)

### Conversion Levers
1. **Storage limit notification** — Push when user hits 80% free quota
2. **Feature gates** — Try to share with password → "Upgrade to Plus"
3. **Upload size gate** — Try to upload 60 MB → "Upgrade to Plus (max 200 MB)"
4. **Ad experience** — Free users see non-intrusive banner ads (PostHog measures ad impact on conversion)
5. **Referral rewards** — Bonus 5 GB per referral (up to 50 GB max) — keeps users engaged

### Yearly Plan Incentive
| Plan | Monthly × 12 | Yearly | Saving |
|------|-------------|--------|--------|
| Plus | Rp180,000 | Rp120,000 | 33% |
| Pro  | Rp420,000 | Rp280,000 | 33% |
| Ultra| Rp900,000 | Rp600,000 | 33% |

**Goal: 30% of paid users choose yearly plan** — improves LTV and reduces churn.

## Anti-Abuse Rules

| Rule | Limit |
|------|-------|
| Max upload per day (free) | 20 files |
| Max upload per day (plus) | 50 files |
| Max concurrent uploads | 3 |
| Max share links (free) | 3 |
| Upload API rate limit | 100 req/hour/user |
| Download speed (free) | 5 Mbps |
| Signup rate per IP | 5/hour |
| Password reset rate | 3/hour |

## Growth Economics

### Referral Program
- User A invites User B → both get +5 GB
- User A can earn max 50 GB via referrals (10 successful referrals)
- Cost: 5 GB × 2 × $0.015 = $0.15 per successful referral pair
- LTV of referred user (if converts to paid): much higher than $0.15

### Key Metrics to Track
- DAU/MAU ratio (engagement)
- Free → Paid conversion rate (target: 10%)
- Monthly churn rate (target: <5%)
- Average Revenue Per User (ARPU)
- Cost Per Acquisition (CPA) via referral
- Storage utilization rate
- Bandwidth per active user

## Break-even Calculation

Assuming 10,000 users with 10% conversion:
- 9,000 free users × $0.12/mo = $1,080 cost
- 900 paid users (avg $1.50/mo revenue, $0.70 cost) = $720 net revenue
- Total net: -$360/month (still in growth phase)

At 5% conversion improvement (15% total):
- 8,500 free × $0.12 = $1,020 cost
- 1,500 paid × $0.80 net = $1,200
- Net: +$180/month **BREAK EVEN AT ~15,000 USERS**
