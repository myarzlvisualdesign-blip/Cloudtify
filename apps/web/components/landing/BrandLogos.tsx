/**
 * BrandLogos — wordmark-style SVG tiles for payment partners + infra
 * we integrate with. Brand artwork is trademarked, so we render clean
 * typographic wordmarks in each brand's primary color rather than
 * copying their official lock-ups. This is the standard approach for
 * partner badges and "supported methods" displays.
 */

type Tone = 'dark' | 'light'
interface LogoProps { tone?: Tone; className?: string }

interface MarkSpec {
  text: string
  color: string             // brand primary
  colorLight?: string       // override on dark surfaces if needed
  weight?: number
  italic?: boolean
  spacing?: number
  size?: number
  width?: number
  caps?: boolean
}

function Wordmark({
  spec, tone = 'dark', className = 'h-6', label,
}: LogoProps & { spec: MarkSpec; label: string }) {
  const c = tone === 'light' ? (spec.colorLight || '#FFFFFF') : spec.color
  return (
    <svg viewBox={`0 0 ${spec.width || 200} 40`} className={className} aria-label={label} role="img">
      <text
        x="0" y="29"
        fontFamily='"Plus Jakarta Sans", system-ui, sans-serif'
        fontWeight={spec.weight ?? 800}
        fontSize={spec.size ?? 24}
        fill={c}
        letterSpacing={spec.spacing ?? -0.4}
        fontStyle={spec.italic ? 'italic' : 'normal'}
        textRendering="geometricPrecision"
      >
        {spec.text}
      </text>
    </svg>
  )
}

/* ── PAYMENT ─────────────────────────────────────────────────────── */
export function GoPayLogo(p: LogoProps) {
  return <Wordmark {...p} label="GoPay" spec={{
    text: 'gopay', color: '#00AED6', weight: 800, size: 26, spacing: -0.6, width: 105,
  }} />
}
export function DanaLogo(p: LogoProps) {
  return <Wordmark {...p} label="DANA" spec={{
    text: 'DANA', color: '#118EEA', weight: 900, size: 24, spacing: 0.6, width: 88,
  }} />
}
export function OvoLogo(p: LogoProps) {
  return <Wordmark {...p} label="OVO" spec={{
    text: 'OVO', color: '#4C2A86', colorLight: '#B69CE0', weight: 900, size: 26, spacing: -0.4, width: 70,
  }} />
}
export function QrisLogo({ tone = 'dark', className = 'h-6' }: LogoProps) {
  const red = '#DA251C'  // QRIS red (Bank Indonesia)
  const ink = tone === 'light' ? '#FFFFFF' : '#141110'
  return (
    <svg viewBox="0 0 138 40" className={className} aria-label="QRIS" role="img">
      {/* Mini QR position markers — block pattern */}
      <rect x="0"  y="6"  width="9" height="9" fill={ink} rx="1.5" />
      <rect x="3"  y="9"  width="3" height="3" fill={red} />
      <rect x="0"  y="25" width="9" height="9" fill={ink} rx="1.5" />
      <rect x="3"  y="28" width="3" height="3" fill={red} />
      <rect x="20" y="14" width="7" height="7" fill={ink} rx="1.2" />
      <text x="34" y="28"
        fontFamily='"Plus Jakarta Sans", system-ui, sans-serif'
        fontWeight="900" fontSize="22" fill={ink} letterSpacing="-0.2"
        textRendering="geometricPrecision"
      >QRIS</text>
    </svg>
  )
}
export function BcaLogo(p: LogoProps) {
  return <Wordmark {...p} label="BCA" spec={{
    text: 'BCA', color: '#0064C2', weight: 900, size: 26, spacing: 0.4, width: 70,
  }} />
}
export function MandiriLogo(p: LogoProps) {
  return <Wordmark {...p} label="Mandiri" spec={{
    text: 'mandiri', color: '#003D79', colorLight: '#FFD400', weight: 700, size: 22, spacing: -0.5, width: 110,
  }} />
}
export function MidtransLogo({ tone = 'dark', className = 'h-6' }: LogoProps) {
  const blue = tone === 'light' ? '#FFFFFF' : '#0F4A8A'
  const accent = '#00C2A8'
  return (
    <svg viewBox="0 0 175 40" className={className} aria-label="Midtrans" role="img">
      {/* Concentric ring mark */}
      <circle cx="14" cy="20" r="10" fill="none" stroke={blue} strokeWidth="2.4" />
      <circle cx="14" cy="20" r="4.5" fill={accent} />
      <text x="32" y="28"
        fontFamily='"Plus Jakarta Sans", system-ui, sans-serif'
        fontWeight="800" fontSize="22" fill={blue} letterSpacing="-0.4"
        textRendering="geometricPrecision"
      >Midtrans</text>
    </svg>
  )
}

/* ── INFRA ───────────────────────────────────────────────────────── */
export function CloudflareLogo({ tone = 'dark', className = 'h-6' }: LogoProps) {
  const orange = '#F38020'
  const ink = tone === 'light' ? '#FFFFFF' : '#404041'
  return (
    <svg viewBox="0 0 195 40" className={className} aria-label="Cloudflare" role="img">
      {/* Cloud silhouette in brand orange */}
      <path
        d="M30 26c0-3.5 2.6-6.3 6-6.3h2.6c.7 0 1.2-.5 1.2-1.2 0-2.4-2-4.4-4.5-4.4-.9 0-1.7.3-2.5.7-1.6-2.6-4.5-4.4-7.9-4.4-4 0-7.4 3.2-7.4 7.3v.4c-1-.4-2-.6-3-.6-3.4 0-6.2 2.7-6.2 6.1S11.1 30 14.5 30H33c-1.8-.8-3-2.6-3-4z"
        fill={orange}
      />
      <text x="46" y="28"
        fontFamily='"Plus Jakarta Sans", system-ui, sans-serif'
        fontWeight="700" fontSize="22" fill={ink} letterSpacing="-0.4"
        textRendering="geometricPrecision"
      >Cloudflare</text>
    </svg>
  )
}
export function SupabaseLogo({ tone = 'dark', className = 'h-6' }: LogoProps) {
  const green = '#3ECF8E'
  const ink = tone === 'light' ? '#FFFFFF' : '#1F1F1F'
  return (
    <svg viewBox="0 0 195 40" className={className} aria-label="Supabase" role="img">
      {/* Lightning-style triangle pair */}
      <path d="M16 5l14 16h-9v14L7 19h9z" fill={green} />
      <text x="40" y="28"
        fontFamily='"Plus Jakarta Sans", system-ui, sans-serif'
        fontWeight="700" fontSize="22" fill={ink} letterSpacing="-0.4"
        textRendering="geometricPrecision"
      >Supabase</text>
    </svg>
  )
}
export function StripeLogo({ tone = 'dark', className = 'h-6' }: LogoProps) {
  const indigo = tone === 'light' ? '#FFFFFF' : '#635BFF'
  return (
    <svg viewBox="0 0 120 40" className={className} aria-label="Stripe" role="img">
      <text x="0" y="29"
        fontFamily='"Plus Jakarta Sans", system-ui, sans-serif'
        fontWeight="900" fontSize="28" fill={indigo} fontStyle="italic" letterSpacing="-0.8"
        textRendering="geometricPrecision"
      >stripe</text>
    </svg>
  )
}

/* ── Logo strips ─────────────────────────────────────────────────── */
export const PAYMENT_LOGOS = [
  { Component: GoPayLogo,    name: 'GoPay' },
  { Component: DanaLogo,     name: 'DANA' },
  { Component: OvoLogo,      name: 'OVO' },
  { Component: QrisLogo,     name: 'QRIS' },
  { Component: BcaLogo,      name: 'BCA' },
  { Component: MandiriLogo,  name: 'Mandiri' },
  { Component: MidtransLogo, name: 'Midtrans' },
] as const

export const INFRA_LOGOS = [
  { Component: CloudflareLogo, name: 'Cloudflare' },
  { Component: SupabaseLogo,   name: 'Supabase' },
  { Component: StripeLogo,     name: 'Stripe' },
] as const
