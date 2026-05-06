import Image from 'next/image'
import Link from 'next/link'

export default function Hero() {
  return (
    <section className="relative w-full h-[92vh] min-h-[500px] max-h-[900px] overflow-hidden">
      {/* Imagen de fondo */}
      <Image
        src="/hamburguesa-1.jpg"
        alt="Hamburguesa Tanos Burger"
        fill
        priority
        sizes="100vw"
        className="object-cover object-center"
      />

      {/* Overlay gradiente desde abajo */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.1) 100%)',
        }}
        aria-hidden="true"
      />

      {/* Contenido */}
      <div className="absolute inset-0 flex flex-col justify-end px-5 pb-12 sm:px-10 sm:pb-16 max-w-4xl">
        <p
          className="text-sm font-semibold uppercase tracking-widest mb-3"
          style={{ color: 'var(--color-primary)' }}
        >
          Delivery · Retiro en local
        </p>
        <h1
          className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white leading-tight mb-4"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          Las mejores{' '}
          <span style={{ color: 'var(--color-primary)' }}>hamburguesas</span>{' '}
          te esperan
        </h1>
        <p className="text-base sm:text-lg text-white/80 mb-8 max-w-xl">
          Ingredientes frescos, sabor único y precio accesible. Pagá con tarjeta o efectivo.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/menu"
            className="inline-flex items-center justify-center px-7 py-3.5 rounded-[var(--radius-md)] font-bold text-sm transition-all hover:scale-105 active:scale-95 focus:outline-none focus-visible:ring-4 focus-visible:ring-[var(--color-primary)]/50"
            style={{ backgroundColor: 'var(--color-primary)', color: 'var(--color-text)' }}
          >
            Ver menú
          </Link>
          <a
            href="https://wa.me/543329404361"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center px-7 py-3.5 rounded-[var(--radius-md)] font-bold text-sm border-2 border-white text-white transition-all hover:bg-white/10 active:scale-95 focus:outline-none focus-visible:ring-4 focus-visible:ring-white/50"
          >
            Pedir por WhatsApp
          </a>
        </div>
      </div>
    </section>
  )
}
