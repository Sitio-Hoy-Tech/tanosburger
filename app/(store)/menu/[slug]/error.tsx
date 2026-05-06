'use client'

import Link from 'next/link'

export default function ProductError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center gap-4">
      <span className="text-5xl">⚠️</span>
      <h2 className="text-xl font-bold" style={{ fontFamily: 'var(--font-display)' }}>
        Algo salió mal
      </h2>
      <div className="flex gap-3">
        <button
          type="button"
          onClick={reset}
          className="px-5 py-2.5 rounded-[var(--radius-md)] font-semibold text-sm transition-colors"
          style={{ backgroundColor: 'var(--color-primary)', color: 'var(--color-text)' }}
        >
          Reintentar
        </button>
        <Link
          href="/menu"
          className="px-5 py-2.5 rounded-[var(--radius-md)] font-semibold text-sm border transition-colors"
          style={{ borderColor: 'var(--color-border)' }}
        >
          Volver al menú
        </Link>
      </div>
    </div>
  )
}
