/**
 * BrandLogos — minimalist SVG monograms for payment partners + infra we
 * integrate with. Designed as flat monochrome marks so they sit nicely
 * inside our muted/dark surfaces. Not exact brand artwork — these are
 * neutral text-mark approximations rendered as SVG so each tile reads as
 * "logo" not "tag".
 */

const C = '#494440' // muted ink for light bg
const W = 'rgba(255,255,255,0.75)' // muted on dark bg

type LogoProps = { tone?: 'dark' | 'light'; className?: string }

function brandColor(tone: 'dark' | 'light' = 'dark') {
  return tone === 'light' ? W : C
}

export function GoPayLogo({ tone = 'dark', className = 'h-5' }: LogoProps) {
  const c = brandColor(tone)
  return (
    <svg viewBox="0 0 160 40" className={className} aria-label="GoPay" role="img">
      <text x="0" y="28" fontFamily="Plus Jakarta Sans, sans-serif" fontWeight="800" fontSize="26" fill={c} letterSpacing="-0.4">go</text>
      <circle cx="58" cy="20" r="6.5" fill="none" stroke={c} strokeWidth="3.2" />
      <text x="72" y="28" fontFamily="Plus Jakarta Sans, sans-serif" fontWeight="800" fontSize="26" fill={c} letterSpacing="-0.4">ay</text>
    </svg>
  )
}

export function DanaLogo({ tone = 'dark', className = 'h-5' }: LogoProps) {
  const c = brandColor(tone)
  return (
    <svg viewBox="0 0 160 40" className={className} aria-label="DANA" role="img">
      <text x="0" y="28" fontFamily="Plus Jakarta Sans, sans-serif" fontWeight="800" fontSize="26" fill={c} letterSpacing="-0.2">DAN</text>
      <circle cx="76" cy="20" r="8" fill={c} />
      <circle cx="76" cy="20" r="3.2" fill={tone === 'light' ? '#0A0907' : '#FAFAF8'} />
    </svg>
  )
}

export function OvoLogo({ tone = 'dark', className = 'h-5' }: LogoProps) {
  const c = brandColor(tone)
  return (
    <svg viewBox="0 0 160 40" className={className} aria-label="OVO" role="img">
      <text x="0" y="29" fontFamily="Plus Jakarta Sans, sans-serif" fontWeight="800" fontSize="28" fill={c} letterSpacing="-0.5">OVO</text>
    </svg>
  )
}

export function QrisLogo({ tone = 'dark', className = 'h-5' }: LogoProps) {
  const c = brandColor(tone)
  return (
    <svg viewBox="0 0 160 40" className={className} aria-label="QRIS" role="img">
      <rect x="0"  y="6" width="9" height="9" fill={c} />
      <rect x="0"  y="25" width="9" height="9" fill={c} />
      <rect x="19" y="15" width="6" height="6" fill={c} />
      <text x="34" y="28" fontFamily="Plus Jakarta Sans, sans-serif" fontWeight="800" fontSize="24" fill={c} letterSpacing="-0.3">QRIS</text>
    </svg>
  )
}

export function BcaLogo({ tone = 'dark', className = 'h-5' }: LogoProps) {
  const c = brandColor(tone)
  return (
    <svg viewBox="0 0 160 40" className={className} aria-label="BCA" role="img">
      <text x="0" y="28" fontFamily="Plus Jakarta Sans, sans-serif" fontWeight="800" fontSize="26" fill={c} letterSpacing="-0.3">BCA</text>
    </svg>
  )
}

export function MandiriLogo({ tone = 'dark', className = 'h-5' }: LogoProps) {
  const c = brandColor(tone)
  return (
    <svg viewBox="0 0 200 40" className={className} aria-label="Mandiri" role="img">
      <text x="0" y="28" fontFamily="Plus Jakarta Sans, sans-serif" fontWeight="800" fontSize="22" fill={c} letterSpacing="-0.3">mandiri</text>
    </svg>
  )
}

export function CloudflareLogo({ tone = 'dark', className = 'h-5' }: LogoProps) {
  const c = brandColor(tone)
  return (
    <svg viewBox="0 0 200 40" className={className} aria-label="Cloudflare" role="img">
      <path
        d="M28 24c0-3 2-5 5-5l3 0c.6 0 1-.4 1-1 0-2-2-4-4-4-1 0-2 .3-3 1-.8-3-3.5-5-7-5-4 0-7 3-7 7l0 .5c-1-.3-2-.5-3-.5-3 0-6 3-6 6 0 3 3 6 6 6h17c-1-1-2-2.5-2-5z"
        fill={c} opacity="0.9"
      />
      <text x="48" y="28" fontFamily="Plus Jakarta Sans, sans-serif" fontWeight="700" fontSize="22" fill={c} letterSpacing="-0.4">Cloudflare</text>
    </svg>
  )
}

export function SupabaseLogo({ tone = 'dark', className = 'h-5' }: LogoProps) {
  const c = brandColor(tone)
  return (
    <svg viewBox="0 0 200 40" className={className} aria-label="Supabase" role="img">
      <path
        d="M16 4l12 14h-8v18L8 22h8z"
        fill="none" stroke={c} strokeWidth="2.4" strokeLinejoin="round"
      />
      <text x="38" y="28" fontFamily="Plus Jakarta Sans, sans-serif" fontWeight="700" fontSize="22" fill={c} letterSpacing="-0.4">Supabase</text>
    </svg>
  )
}

export function StripeLogo({ tone = 'dark', className = 'h-5' }: LogoProps) {
  const c = brandColor(tone)
  return (
    <svg viewBox="0 0 200 40" className={className} aria-label="Stripe" role="img">
      <text x="0" y="28" fontFamily="Plus Jakarta Sans, sans-serif" fontWeight="800" fontSize="26" fill={c} fontStyle="italic" letterSpacing="-0.6">stripe</text>
    </svg>
  )
}

export function MidtransLogo({ tone = 'dark', className = 'h-5' }: LogoProps) {
  const c = brandColor(tone)
  return (
    <svg viewBox="0 0 200 40" className={className} aria-label="Midtrans" role="img">
      <circle cx="16" cy="20" r="10" fill="none" stroke={c} strokeWidth="2.6" />
      <circle cx="16" cy="20" r="3" fill={c} />
      <text x="34" y="28" fontFamily="Plus Jakarta Sans, sans-serif" fontWeight="700" fontSize="22" fill={c} letterSpacing="-0.4">Midtrans</text>
    </svg>
  )
}

/** Logo strip with two tracks: payment partners + infra stack. */
export const PAYMENT_LOGOS = [
  { Component: GoPayLogo, name: 'GoPay' },
  { Component: DanaLogo, name: 'DANA' },
  { Component: OvoLogo, name: 'OVO' },
  { Component: QrisLogo, name: 'QRIS' },
  { Component: BcaLogo, name: 'BCA' },
  { Component: MandiriLogo, name: 'Mandiri' },
  { Component: MidtransLogo, name: 'Midtrans' },
] as const

export const INFRA_LOGOS = [
  { Component: CloudflareLogo, name: 'Cloudflare' },
  { Component: SupabaseLogo, name: 'Supabase' },
  { Component: StripeLogo, name: 'Stripe' },
] as const
