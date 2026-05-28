/**
 * BrandLogos — wordmark-style SVG marks for partners we integrate with.
 * Clean typography only (no attempt to recreate exact brand artwork), so
 * they read as proper logos at any size and sit nicely on light or dark
 * surfaces. Each logo is rendered with its real wordmark style in our
 * brand font.
 */

type Tone = 'dark' | 'light'
interface LogoProps { tone?: Tone; className?: string }

function color(tone: Tone = 'dark') {
  return tone === 'light' ? 'rgba(255,255,255,0.85)' : '#2E2A26'
}

/** Reusable wordmark renderer with consistent font + alignment. */
function Wordmark({
  text,
  tone = 'dark',
  className = 'h-5',
  weight = 800,
  italic = false,
  spacing = -0.4,
  size = 26,
  width = 200,
  label,
}: LogoProps & {
  text: string | React.ReactNode
  weight?: number
  italic?: boolean
  spacing?: number
  size?: number
  width?: number
  label: string
}) {
  const c = color(tone)
  return (
    <svg viewBox={`0 0 ${width} 40`} className={className} aria-label={label} role="img">
      <text
        x="0"
        y="28"
        fontFamily='"Plus Jakarta Sans", system-ui, sans-serif'
        fontWeight={weight}
        fontSize={size}
        fill={c}
        letterSpacing={spacing}
        fontStyle={italic ? 'italic' : 'normal'}
      >
        {text}
      </text>
    </svg>
  )
}

export function GoPayLogo(p: LogoProps) {
  return <Wordmark {...p} text="gopay" weight={800} spacing={-0.6} size={26} width={110} label="GoPay" />
}
export function DanaLogo(p: LogoProps) {
  return <Wordmark {...p} text="DANA" weight={900} spacing={0.6} size={24} width={88} label="DANA" />
}
export function OvoLogo(p: LogoProps) {
  return <Wordmark {...p} text="OVO" weight={900} spacing={-0.4} size={26} width={70} label="OVO" />
}
export function QrisLogo({ tone = 'dark', className = 'h-5' }: LogoProps) {
  const c = color(tone)
  return (
    <svg viewBox="0 0 140 40" className={className} aria-label="QRIS" role="img">
      {/* Mini QR position marker */}
      <rect x="0"  y="6"  width="9" height="9" fill={c} rx="1.5" />
      <rect x="0"  y="25" width="9" height="9" fill={c} rx="1.5" />
      <rect x="19" y="15" width="6" height="6" fill={c} rx="1" />
      <text
        x="34" y="28"
        fontFamily='"Plus Jakarta Sans", system-ui, sans-serif'
        fontWeight="900" fontSize="22" fill={c} letterSpacing="-0.2"
      >QRIS</text>
    </svg>
  )
}
export function BcaLogo(p: LogoProps) {
  return <Wordmark {...p} text="BCA" weight={900} spacing={0.4} size={26} width={70} label="BCA" />
}
export function MandiriLogo(p: LogoProps) {
  return <Wordmark {...p} text="mandiri" weight={700} spacing={-0.5} size={22} width={110} label="Mandiri" />
}
export function MidtransLogo({ tone = 'dark', className = 'h-5' }: LogoProps) {
  const c = color(tone)
  return (
    <svg viewBox="0 0 180 40" className={className} aria-label="Midtrans" role="img">
      <circle cx="14" cy="20" r="9" fill="none" stroke={c} strokeWidth="2.4" />
      <circle cx="14" cy="20" r="3" fill={c} />
      <text
        x="30" y="28"
        fontFamily='"Plus Jakarta Sans", system-ui, sans-serif'
        fontWeight="700" fontSize="22" fill={c} letterSpacing="-0.4"
      >Midtrans</text>
    </svg>
  )
}

export function CloudflareLogo({ tone = 'dark', className = 'h-5' }: LogoProps) {
  const c = color(tone)
  return (
    <svg viewBox="0 0 200 40" className={className} aria-label="Cloudflare" role="img">
      {/* Cloud silhouette */}
      <path
        d="M27 24c0-3.5 2.5-6 6-6h2.6c.7 0 1.2-.5 1.2-1.2 0-2.4-2-4.3-4.5-4.3-.9 0-1.7.3-2.5.7C28.9 10.8 26 9 22.5 9c-4 0-7.3 3.2-7.3 7.3v.4c-1-.4-2-.6-3-.6-3.4 0-6.2 2.7-6.2 6 0 3.4 2.8 6.1 6.2 6.1H30c-1.8-.8-3-2.6-3-4.7z"
        fill={c} opacity="0.85"
      />
      <text
        x="45" y="28"
        fontFamily='"Plus Jakarta Sans", system-ui, sans-serif'
        fontWeight="700" fontSize="22" fill={c} letterSpacing="-0.4"
      >Cloudflare</text>
    </svg>
  )
}
export function SupabaseLogo({ tone = 'dark', className = 'h-5' }: LogoProps) {
  const c = color(tone)
  return (
    <svg viewBox="0 0 200 40" className={className} aria-label="Supabase" role="img">
      <path d="M16 5l14 16h-9v14L7 19h9z" fill={c} opacity="0.9" />
      <text
        x="40" y="28"
        fontFamily='"Plus Jakarta Sans", system-ui, sans-serif'
        fontWeight="700" fontSize="22" fill={c} letterSpacing="-0.4"
      >Supabase</text>
    </svg>
  )
}
export function StripeLogo({ tone = 'dark', className = 'h-5' }: LogoProps) {
  return <Wordmark {...{ tone, className }} text="stripe" weight={900} italic spacing={-0.8} size={26} width={120} label="Stripe" />
}

/** Logo strips. */
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
