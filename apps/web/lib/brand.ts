/**
 * Cloudtify — Brand & Design Tokens (single source of truth)
 * Art direction: "Warm Precision" — warm paper light surfaces, deep-navy ink,
 * one confident electric-blue accent. No generic SaaS purple gradients.
 */

export const brand = {
  // Core ink + paper
  ink: '#141110', // near-black warm
  ink2: '#3D3A37',
  paper: '#FAFAF8', // warm off-white background
  paper2: '#F2F0ED',
  surface: '#FFFFFF',

  // Warm grays (borders / muted text)
  border: '#E5E2DD',
  border2: '#CCC8C1',
  muted: '#6B6560',
  muted2: '#A8A29E',

  // Brand blue — the single accent
  blue: '#1A56DB',
  blueDeep: '#0F2D8A',
  blueLight: '#2B7FD4',
  blueSky: '#5BB8FF',
  blueDim: '#EBF0FF',

  // Brand navy (logo tile / dark panels)
  navy: '#0B1530',
  navy2: '#0B1C4D',
  panel: '#111014', // near-black dashboard sidebar

  // Functional
  success: '#22C55E',
  warning: '#F59E0B',
  danger: '#EF4444',

  // Signature gradients
  gradient: 'linear-gradient(135deg, #1A56DB, #2B7FD4)',
  gradientDeep: 'linear-gradient(160deg, #0F2D8A 0%, #1A56DB 55%, #2B7FD4 100%)',
  gradientCloud: 'linear-gradient(135deg, #2563EB 0%, #5BB8FF 100%)',
} as const

/** Plan accent colors used consistently across app + admin */
export const planColor: Record<string, { bg: string; fg: string; label: string }> = {
  free: { bg: '#F2F0ED', fg: '#6B6560', label: 'Free' },
  plus: { bg: '#EBF0FF', fg: '#1A56DB', label: 'Plus' },
  pro: { bg: '#F3E8FF', fg: '#7C3AED', label: 'Pro' },
  ultra: { bg: '#FEF3C7', fg: '#B45309', label: 'Ultra' },
}
