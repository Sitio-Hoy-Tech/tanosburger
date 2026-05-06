import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Sobre nosotros — Tanos Burger',
  description: 'Conocé la historia de Tanos Burger. Hamburguesas artesanales con ingredientes frescos, entrega rápida y precio accesible.',
  openGraph: {
    title: 'Sobre nosotros — Tanos Burger',
    description: 'Conocé la historia de Tanos Burger. Hamburguesas artesanales con ingredientes frescos, entrega rápida y precio accesible.',
    images: [{ url: '/hamburguesa-2.jpg', width: 1200, height: 630 }],
  },
}

const valores = [
  { emoji: '🍔', title: 'Calidad real', desc: 'Medallones de carne vacuna frescos, pan artesanal y ingredientes de primera.' },
  { emoji: '⚡', title: 'Rapidez', desc: 'Sabemos que el hambre no espera. Cada pedido sale en tiempo récord.' },
  { emoji: '💰', title: 'Precio accesible', desc: 'Hamburguesas de calidad no tienen que costar una fortuna.' },
]

export default function NosotrosPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero */}
      <div className="flex flex-col lg:flex-row gap-10 items-center mb-16">
        <div className="flex-1">
          <p
            className="text-sm font-semibold uppercase tracking-widest mb-3"
            style={{ color: 'var(--color-primary)' }}
          >
            Nuestra historia
          </p>
          <h1
            className="text-4xl sm:text-5xl font-extrabold leading-tight mb-5"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Tanos Burger
          </h1>
          <p className="text-base leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>
            Nacimos con una idea simple: hacer hamburguesas de verdad, con ingredientes frescos y sin vueltas. Nada de congelado, nada de genérico. Cada medallón se prepara al momento para que llegue a tu puerta (o a tus manos) en su mejor versión.
          </p>
          <p className="text-base leading-relaxed mt-4" style={{ color: 'var(--color-text-muted)' }}>
            Delivery rápido en la zona o retiro directo en el local. Pagás como quieras y recibís lo que prometemos.
          </p>
          <div className="flex gap-4 mt-8">
            <Link
              href="/menu"
              className="px-6 py-3 rounded-[var(--radius-md)] font-bold text-sm transition-all hover:scale-105 active:scale-95"
              style={{ backgroundColor: 'var(--color-primary)', color: 'var(--color-text)' }}
            >
              Ver menú
            </Link>
            <a
              href="https://wa.me/543329404361"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 rounded-[var(--radius-md)] font-bold text-sm border transition-all hover:bg-[var(--color-surface)]"
              style={{ borderColor: 'var(--color-border)' }}
            >
              Contactarnos
            </a>
          </div>
        </div>
        <div className="w-full lg:w-80 shrink-0">
          <div className="aspect-square relative rounded-[var(--radius-xl)] overflow-hidden">
            <Image
              src="/hamburguesa-2.jpg"
              alt="Hamburguesa Tanos Burger"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 320px"
              priority
            />
          </div>
        </div>
      </div>

      {/* Valores */}
      <section>
        <h2
          className="text-2xl font-extrabold mb-8 text-center"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          Lo que nos mueve
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {valores.map((v) => (
            <div
              key={v.title}
              className="flex flex-col items-center text-center gap-3 p-6 rounded-[var(--radius-lg)] border"
              style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-surface)' }}
            >
              <span className="text-4xl" aria-hidden="true">{v.emoji}</span>
              <h3 className="font-bold text-base" style={{ fontFamily: 'var(--font-display)' }}>
                {v.title}
              </h3>
              <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
                {v.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA final */}
      <section
        className="mt-16 p-8 rounded-[var(--radius-xl)] text-center"
        style={{ backgroundColor: 'var(--color-primary)' }}
      >
        <h2
          className="text-2xl font-extrabold mb-2"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          ¿Se te hizo agua la boca?
        </h2>
        <p className="mb-6 text-sm">Pedí ahora y en minutos está en tu puerta.</p>
        <Link
          href="/menu"
          className="inline-block px-8 py-3.5 rounded-[var(--radius-md)] font-bold text-sm bg-[var(--color-text)] text-white transition-all hover:scale-105 active:scale-95"
        >
          Pedir ahora
        </Link>
      </section>
    </div>
  )
}
