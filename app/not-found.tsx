import Link from 'next/link'

export default function NotFoundPage() {
  return (
    <main className="min-h-screen flex items-center justify-center p-8 text-center">
      <div>
        <p className="text-6xl mb-4">🍔</p>
        <h1 className="text-2xl font-bold mb-2" style={{ fontFamily: 'var(--font-display)' }}>
          Página no encontrada
        </h1>
        <p className="text-[var(--color-text-muted)] mb-6">
          El contenido que buscás no existe o fue movido.
        </p>
        <Link
          href="/"
          className="px-6 py-3 rounded-[var(--radius-md)] font-semibold transition-colors inline-block"
          style={{ backgroundColor: 'var(--color-primary)', color: 'var(--color-text)' }}
        >
          Volver al inicio
        </Link>
      </div>
    </main>
  )
}
