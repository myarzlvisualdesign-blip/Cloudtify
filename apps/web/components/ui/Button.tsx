'use client'
import Link from 'next/link'
import type { ButtonHTMLAttributes, ReactNode } from 'react'

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger'
type Size = 'sm' | 'md' | 'lg'

const base =
  'inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all duration-200 disabled:opacity-55 disabled:pointer-events-none whitespace-nowrap select-none'

const sizes: Record<Size, string> = {
  sm: 'text-[13px] px-3.5 py-2',
  md: 'text-sm px-5 py-2.5',
  lg: 'text-sm px-6 py-3.5',
}

const variants: Record<Variant, string> = {
  primary:
    'text-white hover:-translate-y-px hover:shadow-lg hover:shadow-[#1A56DB]/25',
  secondary:
    'bg-white text-[#3D3A37] border border-[#E5E2DD] hover:border-[#CCC8C1] hover:text-[#141110] hover:shadow-sm',
  ghost: 'text-[#6B6560] hover:text-[#141110] hover:bg-[#F2F0ED]',
  danger: 'text-white bg-[#EF4444] hover:bg-[#dc2626]',
}

type CommonProps = {
  variant?: Variant
  size?: Size
  children: ReactNode
  className?: string
  href?: string
}

export function Button({
  variant = 'primary',
  size = 'md',
  children,
  className = '',
  href,
  ...rest
}: CommonProps & ButtonHTMLAttributes<HTMLButtonElement>) {
  const cls = `${base} ${sizes[size]} ${variants[variant]} ${className}`
  const style =
    variant === 'primary' ? { background: 'linear-gradient(135deg, #1A56DB, #2B7FD4)' } : undefined

  if (href) {
    return (
      <Link href={href} className={cls} style={style}>
        {children}
      </Link>
    )
  }
  return (
    <button className={cls} style={style} {...rest}>
      {children}
    </button>
  )
}
