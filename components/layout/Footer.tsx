import Link from 'next/link'
import Image from 'next/image'

const year = new Date().getFullYear()

const links = {
  menu: [
    { href: '/menu', label: 'Ver menú' },
    { href: '/nosotros', label: 'Sobre nosotros' },
    { href: '/contacto', label: 'Contacto' },
  ],
  legal: [
    { href: '/terminos', label: 'Términos y condiciones' },
    { href: '/privacidad', label: 'Política de privacidad' },
    { href: '/devoluciones', label: 'Política de devoluciones' },
  ],
}

export default function Footer() {
  return (
    <footer
      className="border-t mt-auto"
      style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-surface)' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

          {/* Marca */}
          <div className="flex flex-col gap-4">
            <Image
              src="/logo.png"
              alt="Tanos Burger"
              width={120}
              height={40}
              className="h-9 w-auto object-contain"
            />
            <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
              Rápido. Rico. Accesible.
            </p>
            <a
              href="https://instagram.com/tanosburgers"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium hover:text-[var(--color-primary)] transition-colors"
              style={{ color: 'var(--color-text-muted)' }}
            >
              @tanosburgers
            </a>
          </div>

          {/* Links */}
          <div className="flex flex-col gap-3">
            <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--color-text-muted)' }}>
              Navegación
            </p>
            {links.menu.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="text-sm hover:text-[var(--color-primary)] transition-colors"
                style={{ color: 'var(--color-text)' }}
              >
                {l.label}
              </Link>
            ))}
          </div>

          {/* Contacto + legal */}
          <div className="flex flex-col gap-3">
            <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--color-text-muted)' }}>
              Contacto
            </p>
            <a
              href="https://wa.me/543329404361"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm hover:text-[var(--color-primary)] transition-colors"
              style={{ color: 'var(--color-text)' }}
            >
              WhatsApp: 3329 404361
            </a>
            <a
              href="mailto:contacto@tanosburger.com.ar"
              className="text-sm hover:text-[var(--color-primary)] transition-colors"
              style={{ color: 'var(--color-text)' }}
            >
              contacto@tanosburger.com.ar
            </a>
            <div className="flex flex-col gap-2 mt-2">
              {links.legal.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="text-xs hover:text-[var(--color-primary)] transition-colors"
                  style={{ color: 'var(--color-text-muted)' }}
                >
                  {l.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div
          className="mt-10 pt-6 border-t flex flex-col sm:flex-row items-center justify-between gap-3 text-xs"
          style={{ borderColor: 'var(--color-border)', color: 'var(--color-text-muted)' }}
        >
          <span>© {year} Tanos Burger. Todos los derechos reservados.</span>
          <a
            href="https://sitiohoy.com.ar"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 opacity-50 hover:opacity-100 transition-opacity"
          >
            <span>Desarrollado por</span>
            <Image
              src="/logo-sitiohoy.png"
              alt="SitioHoy"
              width={72}
              height={24}
              className="h-5 w-auto object-contain"
            />
          </a>
        </div>
      </div>
    </footer>
  )
}
