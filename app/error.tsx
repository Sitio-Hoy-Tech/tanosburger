'use client'

export default function ErrorPage({
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <main className="min-h-screen flex items-center justify-center p-8 text-center">
      <div>
        <h1 className="text-2xl font-bold mb-2" style={{ fontFamily: 'var(--font-display)' }}>
          Algo salió mal
        </h1>
        <p className="text-[var(--color-text-muted)] mb-6">Hubo un error inesperado. Podés intentar de nuevo.</p>
        <button
          type="button"
          onClick={reset}
          className="px-6 py-3 rounded-[var(--radius-md)] font-semibold transition-colors"
          style={{ backgroundColor: 'var(--color-primary)', color: 'var(--color-text)' }}
        >
          Intentar de nuevo
        </button>
      </div>
    </main>
  )
}
