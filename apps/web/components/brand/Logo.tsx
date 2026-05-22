'use client'
import { useId } from 'react'

/**
 * Cloudtify canonical logo — the single source of truth used everywhere
 * (navbar, auth, dashboard, admin, footer, favicon).
 *
 * Matches the brand mark: a rounded blue-gradient "cloud" outline, optionally
 * set inside a deep-navy app tile, with the "Cloudtify" wordmark.
 *
 *   <Logo />                      full lockup (tile + wordmark), for light bg
 *   <Logo variant="mark" />       bare gradient cloud, for dark/colored bg
 *   <Logo variant="tile" />       app-icon tile only (no wordmark)
 *   <Logo wordmark="light" />     white wordmark, for dark bg
 */

type Variant = 'full' | 'mark' | 'tile'
type Wordmark = 'auto' | 'dark' | 'light'

export function Logo({
  variant = 'full',
  wordmark = 'auto',
  size = 32,
  showTile = true,
  className = '',
}: {
  variant?: Variant
  wordmark?: Wordmark
  size?: number
  showTile?: boolean
  className?: string
}) {
  const id = useId().replace(/:/g, '')
  const gradId = `ct-grad-${id}`
  const tile = variant === 'tile' || (variant === 'full' && showTile)

  const Mark = (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      aria-hidden="true"
      className="flex-shrink-0"
    >
      <defs>
        <linearGradient id={gradId} x1="8" y1="30" x2="32" y2="10" gradientUnits="userSpaceOnUse">
          <stop stopColor="#1E6FE0" />
          <stop offset="1" stopColor="#5BB8FF" />
        </linearGradient>
      </defs>

      {tile && <rect width="40" height="40" rx="11" fill="#0B1530" />}

      {/* Cloud outline — thick rounded "tube", gradient stroke */}
      <path
        d="M14.2 27.5h12.4a5.2 5.2 0 0 0 1.1-10.28 7.2 7.2 0 0 0-13.3-1.86 5.5 5.5 0 0 0-.2 12.14Z"
        fill="none"
        stroke={`url(#${gradId})`}
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* small upload arrow inside, mirrors the product */}
      <path
        d="M20 24.2v-6m-2.6 2.4 2.6-2.6 2.6 2.6"
        stroke={`url(#${gradId})`}
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )

  if (variant === 'mark' || variant === 'tile') return <span className={className}>{Mark}</span>

  const wordColor =
    wordmark === 'light' ? '#FFFFFF' : wordmark === 'dark' ? '#141110' : '#141110'

  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      {Mark}
      <span
        className="font-display font-extrabold tracking-tight leading-none"
        style={{ fontSize: size * 0.56, color: wordColor }}
      >
        Cloud<span style={{ color: '#1A56DB' }}>tify</span>
      </span>
    </span>
  )
}
