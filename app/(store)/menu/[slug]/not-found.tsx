import Link from 'next/link'

export default function ProductNotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center gap-4">
      <span className="text-6xl">🍔</span>
      <h1 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-display)' }}>
        Producto no encontrado
      </h1>
      <p style={{ color: 'var(--color-text-muted)' }} className="text-sm">
        Este producto no existe o fue removido del menú.
      </p>
      <Link
        href="/menu"
        className="mt-2 px-6 py-3 rounded-[var(--radius-md)] font-bold text-sm transition-all hover:scale-105 active:scale-95"
        style={{ backgroundColor: 'var(--color-primary)', color: 'var(--color-text)' }}
      >
        Ver todo el menú
      </Link>
    </div>
  )
}
