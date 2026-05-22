'use client'
import { type InputHTMLAttributes, type ReactNode, useState } from 'react'

/** Labelled text field with optional leading icon + password reveal. */
export function Field({
  label,
  icon,
  hint,
  error,
  type = 'text',
  className = '',
  ...rest
}: {
  label?: string
  icon?: ReactNode
  hint?: ReactNode
  error?: string
} & InputHTMLAttributes<HTMLInputElement>) {
  const [reveal, setReveal] = useState(false)
  const isPassword = type === 'password'
  const inputType = isPassword ? (reveal ? 'text' : 'password') : type

  return (
    <div className={className}>
      {(label || hint) && (
        <div className="flex items-center justify-between mb-2">
          {label && <label className="text-[#141110] text-sm font-semibold">{label}</label>}
          {hint}
        </div>
      )}
      <div className="relative">
        {icon && (
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A8A29E] pointer-events-none">
            {icon}
          </span>
        )}
        <input
          type={inputType}
          className={`w-full bg-white border rounded-xl py-3.5 text-sm text-[#141110] placeholder-[#C2BDB8]
            focus:outline-none focus:ring-2 transition-all
            ${icon ? 'pl-11' : 'pl-4'} ${isPassword ? 'pr-12' : 'pr-4'}
            ${error ? 'border-[#EF4444] focus:border-[#EF4444] focus:ring-[#EF4444]/10' : 'border-[#E5E2DD] focus:border-[#1A56DB]/60 focus:ring-[#1A56DB]/10'}`}
          {...rest}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setReveal((v) => !v)}
            tabIndex={-1}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-[#A8A29E] hover:text-[#6B6560] transition-colors"
            aria-label={reveal ? 'Sembunyikan' : 'Tampilkan'}
          >
            {reveal ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" /><line x1="1" y1="1" x2="23" y2="23" /></svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
            )}
          </button>
        )}
      </div>
      {error && <p className="text-[#EF4444] text-xs mt-1.5 font-medium">{error}</p>}
    </div>
  )
}
