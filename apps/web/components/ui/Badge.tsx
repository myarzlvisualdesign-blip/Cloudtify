import type { ReactNode } from 'react'
import { planColor } from '../../lib/brand'

type Tone = 'neutral' | 'blue' | 'green' | 'amber' | 'red' | 'purple'

const tones: Record<Tone, string> = {
  neutral: 'bg-[#F2F0ED] text-[#6B6560]',
  blue: 'bg-[#EBF0FF] text-[#1A56DB]',
  green: 'bg-emerald-50 text-emerald-700',
  amber: 'bg-amber-50 text-amber-700',
  red: 'bg-red-50 text-red-600',
  purple: 'bg-purple-50 text-purple-700',
}

export function Badge({
  children,
  tone = 'neutral',
  className = '',
}: {
  children: ReactNode
  tone?: Tone
  className?: string
}) {
  return (
    <span
      className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${tones[tone]} ${className}`}
    >
      {children}
    </span>
  )
}

/** Plan pill (free/plus/pro/ultra) with consistent brand colors. */
export function PlanBadge({ plan, className = '' }: { plan: string; className?: string }) {
  const p = planColor[plan?.toLowerCase()] ?? planColor.free
  return (
    <span
      className={`inline-flex items-center text-xs font-bold px-2.5 py-1 rounded-full ${className}`}
      style={{ background: p.bg, color: p.fg }}
    >
      {p.label}
    </span>
  )
}
