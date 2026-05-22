import type { ReactNode } from 'react'

/** Surface card — warm white, hairline border, soft hover lift (optional). */
export function Card({
  children,
  className = '',
  hover = false,
  as: Tag = 'div',
}: {
  children: ReactNode
  className?: string
  hover?: boolean
  as?: 'div' | 'section' | 'article'
}) {
  return (
    <Tag
      className={`bg-white rounded-2xl border border-[#E5E2DD] ${
        hover
          ? 'transition-all duration-200 hover:border-[#C2D0F8] hover:shadow-[0_8px_24px_rgba(20,17,16,0.07)]'
          : ''
      } ${className}`}
    >
      {children}
    </Tag>
  )
}

/** Section heading used across dashboard + admin. */
export function SectionTitle({
  eyebrow,
  title,
  desc,
  className = '',
}: {
  eyebrow?: string
  title: string
  desc?: string
  className?: string
}) {
  return (
    <div className={className}>
      {eyebrow && (
        <p className="text-[#1A56DB] text-xs font-semibold tracking-widest uppercase mb-2">
          {eyebrow}
        </p>
      )}
      <h2 className="font-display font-extrabold text-[#141110] text-xl md:text-2xl tracking-tight">
        {title}
      </h2>
      {desc && <p className="text-[#6B6560] text-sm mt-1">{desc}</p>}
    </div>
  )
}
