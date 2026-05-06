import Link from 'next/link'
import Image from 'next/image'
import CartButton from '@/components/cart/CartButton'
import MobileMenu from '@/components/layout/MobileMenu'

const navLinks = [
  { href: '/menu', label: 'Menú' },
  { href: '/nosotros', label: 'Nosotros' },
  { href: '/contacto', label: 'Contacto' },
]

export default function Header() {
  return (
    <header
      className="sticky top-0 z-50 w-full border-b"
      style={{
        backgroundColor: 'rgba(255,255,255,0.95)',
        backdropFilter: 'blur(8px)',
        borderColor: 'var(--color-border)',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-[72px]">

          {/* Mobile: hamburger izquierda */}
          <div className="md:hidden">
            <MobileMenu links={navLinks} />
          </div>

          {/* Logo — centrado mobile, izquierda desktop */}
          <Link
            href="/"
            className="absolute left-1/2 -translate-x-1/2 md:static md:translate-x-0 flex items-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] rounded-[var(--radius-sm)]"
            aria-label="Tanos Burger — inicio"
          >
            <Image
              src="/logo.png"
              alt="Tanos Burger"
              width={120}
              height={40}
              priority
              className="h-9 w-auto md:h-10 object-contain"
            />
          </Link>

          {/* Nav desktop */}
          <nav className="hidden md:flex items-center gap-8" aria-label="Navegación principal">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium transition-colors hover:text-[var(--color-primary)] focus:outline-none focus-visible:text-[var(--color-primary)]"
                style={{ color: 'var(--color-text)' }}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Carrito */}
          <CartButton />
        </div>
      </div>
    </header>
  )
}
