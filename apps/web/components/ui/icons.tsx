/**
 * Cloudtify icon set — bespoke DUOTONE style.
 * Each glyph = a soft tinted fill (currentColor @ ~0.2) + a crisp outline,
 * so icons stay branded yet still inherit their context color (sidebar,
 * accent tiles, white-on-dark, etc.). Control glyphs (arrow/check/plus/more)
 * stay mono for clarity.
 */
import type { ReactNode, SVGProps } from 'react'

type P = SVGProps<SVGSVGElement> & { size?: number }

function Svg({ size = 18, children, ...p }: P & { children: ReactNode }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...p}
    >
      {children}
    </svg>
  )
}

const F = 'currentColor' // fill color
const fo = 0.2 // fill opacity for the duotone layer

export const Icon = {
  grid: (p: P) => (
    <Svg {...p}>
      <rect x="3" y="3" width="7.5" height="7.5" rx="2" fill={F} fillOpacity={fo} stroke="none" />
      <rect x="13.5" y="13.5" width="7.5" height="7.5" rx="2" fill={F} fillOpacity={fo} stroke="none" />
      <rect x="13.5" y="3" width="7.5" height="7.5" rx="2" />
      <rect x="3" y="13.5" width="7.5" height="7.5" rx="2" />
    </Svg>
  ),
  folder: (p: P) => (
    <Svg {...p}>
      <path d="M3 7a2 2 0 0 1 2-2h3.3l1.7 2H19a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" fill={F} fillOpacity={fo} stroke="none" />
      <path d="M3 7a2 2 0 0 1 2-2h3.3l1.7 2H19a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    </Svg>
  ),
  chart: (p: P) => (
    <Svg {...p}>
      <rect x="3.5" y="12" width="4.2" height="8.5" rx="1.3" fill={F} fillOpacity={fo} />
      <rect x="9.9" y="8" width="4.2" height="12.5" rx="1.3" fill={F} fillOpacity={fo} />
      <rect x="16.3" y="4" width="4.2" height="16.5" rx="1.3" />
    </Svg>
  ),
  trend: (p: P) => (
    <Svg {...p}>
      <path d="M3.5 16 8 11l4 4 8.5-8.5V20H3.5z" fill={F} fillOpacity={0.16} stroke="none" />
      <polyline points="3.5 16 8 11 12 15 20 7" />
      <polyline points="15 7 20.5 7 20.5 12.5" />
    </Svg>
  ),
  gear: (p: P) => (
    <Svg {...p}>
      <circle cx="12" cy="12" r="3.3" fill={F} fillOpacity={fo} stroke="none" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
      <circle cx="12" cy="12" r="3.3" />
    </Svg>
  ),
  users: (p: P) => (
    <Svg {...p}>
      <circle cx="9" cy="8" r="3.3" fill={F} fillOpacity={fo} stroke="none" />
      <path d="M2.6 20a6.4 6.4 0 0 1 12.8 0z" fill={F} fillOpacity={fo} stroke="none" />
      <circle cx="9" cy="8" r="3.3" />
      <path d="M2.6 20a6.4 6.4 0 0 1 12.8 0" />
      <path d="M16 5a3.3 3.3 0 0 1 0 6.2M17.5 20a6.4 6.4 0 0 0-2.8-5.2" />
    </Svg>
  ),
  card: (p: P) => (
    <Svg {...p}>
      <rect x="2.5" y="5" width="19" height="14" rx="2.6" fill={F} fillOpacity={fo} stroke="none" />
      <rect x="2.5" y="5" width="19" height="14" rx="2.6" />
      <line x1="2.5" y1="9.7" x2="21.5" y2="9.7" />
      <line x1="6" y1="14.5" x2="10" y2="14.5" />
    </Svg>
  ),
  bell: (p: P) => (
    <Svg {...p}>
      <path d="M6 9.5a6 6 0 0 1 12 0c0 5.5 2.3 7 2.3 7H3.7S6 15 6 9.5Z" fill={F} fillOpacity={fo} stroke="none" />
      <path d="M6 9.5a6 6 0 0 1 12 0c0 5.5 2.3 7 2.3 7H3.7S6 15 6 9.5Z" />
      <path d="M10.1 20a2 2 0 0 0 3.8 0" />
    </Svg>
  ),
  logout: (p: P) => (
    <Svg {...p}>
      <path d="M4 4a1 1 0 0 1 1-1h6v18H5a1 1 0 0 1-1-1z" fill={F} fillOpacity={fo} stroke="none" />
      <path d="M11 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h6" />
      <polyline points="16 8 21 12 16 16" />
      <line x1="21" y1="12" x2="10" y2="12" />
    </Svg>
  ),
  home: (p: P) => (
    <Svg {...p}>
      <path d="M5 10.5 12 5l7 5.5V20a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1z" fill={F} fillOpacity={fo} stroke="none" />
      <path d="M3.2 11 12 4l8.8 7" />
      <path d="M5 10v9a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-9" />
      <path d="M10 21v-5a2 2 0 0 1 4 0v5" />
    </Svg>
  ),
  search: (p: P) => (
    <Svg {...p}>
      <circle cx="11" cy="11" r="7" fill={F} fillOpacity={0.18} stroke="none" />
      <circle cx="11" cy="11" r="7" />
      <line x1="20.5" y1="20.5" x2="16.4" y2="16.4" strokeWidth="2" />
    </Svg>
  ),
  upload: (p: P) => (
    <Svg {...p}>
      <path d="M3.5 14v4.5a2 2 0 0 0 2 2h13a2 2 0 0 0 2-2V14" fill={F} fillOpacity={fo} stroke="none" />
      <path d="M3.5 14v4.5a2 2 0 0 0 2 2h13a2 2 0 0 0 2-2V14" />
      <path d="M12 3.5v11" />
      <polyline points="7.5 8 12 3.5 16.5 8" />
    </Svg>
  ),
  download: (p: P) => (
    <Svg {...p}>
      <path d="M3.5 14v4.5a2 2 0 0 0 2 2h13a2 2 0 0 0 2-2V14" fill={F} fillOpacity={fo} stroke="none" />
      <path d="M3.5 14v4.5a2 2 0 0 0 2 2h13a2 2 0 0 0 2-2V14" />
      <path d="M12 3.5v11" />
      <polyline points="7.5 10 12 14.5 16.5 10" />
    </Svg>
  ),
  share: (p: P) => (
    <Svg {...p}>
      <circle cx="18" cy="5" r="3" fill={F} fillOpacity={fo} stroke="none" />
      <circle cx="18" cy="19" r="3" fill={F} fillOpacity={fo} stroke="none" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="5" r="3" />
      <circle cx="18" cy="19" r="3" />
      <line x1="8.6" y1="13.5" x2="15.4" y2="17.5" />
      <line x1="15.4" y1="6.5" x2="8.6" y2="10.5" />
    </Svg>
  ),
  image: (p: P) => (
    <Svg {...p}>
      <rect x="3" y="3" width="18" height="18" rx="3.5" fill={F} fillOpacity={0.18} stroke="none" />
      <rect x="3" y="3" width="18" height="18" rx="3.5" />
      <circle cx="8.5" cy="8.5" r="1.6" fill={F} stroke="none" />
      <path d="m21 15-4.5-4.5L6 21" />
    </Svg>
  ),
  video: (p: P) => (
    <Svg {...p}>
      <rect x="2" y="5" width="14" height="14" rx="3.2" fill={F} fillOpacity={0.18} stroke="none" />
      <rect x="2" y="5" width="14" height="14" rx="3.2" />
      <path d="m16 10 5.5-3v10L16 14z" fill={F} fillOpacity={fo} />
    </Svg>
  ),
  file: (p: P) => (
    <Svg {...p}>
      <path d="M6 3h7l5 5v11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z" fill={F} fillOpacity={0.18} stroke="none" />
      <path d="M6 3h7l5 5v11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z" />
      <path d="M13 3v5h5" />
    </Svg>
  ),
  flag: (p: P) => (
    <Svg {...p}>
      <path d="M5 4h13l-2.7 4L18 12H5z" fill={F} fillOpacity={fo} stroke="none" />
      <path d="M5 21V4" />
      <path d="M5 4h13l-2.7 4L18 12H5" />
    </Svg>
  ),
  shield: (p: P) => (
    <Svg {...p}>
      <path d="M12 3 20 6v6c0 5-4 8-8 9-4-1-8-4-8-9V6z" fill={F} fillOpacity={0.18} stroke="none" />
      <path d="M12 3 20 6v6c0 5-4 8-8 9-4-1-8-4-8-9V6z" />
      <path d="m9 12 2 2 4-4" />
    </Svg>
  ),
  database: (p: P) => (
    <Svg {...p}>
      <path d="M5 6c0 1.66 3.13 3 7 3s7-1.34 7-3v12c0 1.66-3.13 3-7 3s-7-1.34-7-3z" fill={F} fillOpacity={0.16} stroke="none" />
      <ellipse cx="12" cy="6" rx="7" ry="3" fill={F} fillOpacity={fo} />
      <ellipse cx="12" cy="6" rx="7" ry="3" />
      <path d="M19 12c0 1.66-3.13 3-7 3s-7-1.34-7-3" />
      <path d="M5 6v12c0 1.66 3.13 3 7 3s7-1.34 7-3V6" />
    </Svg>
  ),
  clock: (p: P) => (
    <Svg {...p}>
      <circle cx="12" cy="12" r="9" fill={F} fillOpacity={0.18} stroke="none" />
      <circle cx="12" cy="12" r="9" />
      <polyline points="12 7 12 12 16 14" />
    </Svg>
  ),
  /* ── mono control glyphs ──────────────────────────────── */
  plus: (p: P) => (
    <Svg {...p}><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></Svg>
  ),
  check: (p: P) => (
    <Svg {...p}><polyline points="20 6 9 17 4 12" /></Svg>
  ),
  arrowRight: (p: P) => (
    <Svg {...p}><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></Svg>
  ),
  more: (p: P) => (
    <Svg {...p}><circle cx="12" cy="12" r="1.4" fill={F} stroke="none" /><circle cx="19" cy="12" r="1.4" fill={F} stroke="none" /><circle cx="5" cy="12" r="1.4" fill={F} stroke="none" /></Svg>
  ),
  google: ({ size = 18 }: P) => (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
  ),
}

export type IconKey = keyof typeof Icon
