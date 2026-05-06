import type { Metadata } from 'next'
import ContactForm from './ContactForm'

export const metadata: Metadata = {
  title: 'Contacto — Tanos Burger',
  description: 'Contactanos por WhatsApp, email o dejanos tu mensaje. Te respondemos a la brevedad.',
  openGraph: {
    title: 'Contacto — Tanos Burger',
    description: 'Contactanos por WhatsApp, email o dejanos tu mensaje. Te respondemos a la brevedad.',
  },
}

export default function ContactoPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1
        className="text-4xl font-extrabold mb-2"
        style={{ fontFamily: 'var(--font-display)' }}
      >
        Contacto
      </h1>
      <p className="text-base mb-10" style={{ color: 'var(--color-text-muted)' }}>
        ¿Tenés alguna consulta, sugerencia o problema con tu pedido? Escribinos.
      </p>

      <div className="flex flex-col lg:flex-row gap-10">
        {/* Formulario */}
        <div className="flex-1">
          <ContactForm />
        </div>

        {/* Info de contacto */}
        <aside className="lg:w-64 shrink-0 flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--color-text-muted)' }}>
              WhatsApp
            </p>
            <a
              href="https://wa.me/543329404361"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-sm hover:text-[var(--color-primary)] transition-colors"
            >
              3329 404361
            </a>
            <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
              Respondemos rápido de lunes a domingo
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--color-text-muted)' }}>
              Email
            </p>
            <a
              href="mailto:contacto@tanosburger.com.ar"
              className="font-semibold text-sm hover:text-[var(--color-primary)] transition-colors break-all"
            >
              contacto@tanosburger.com.ar
            </a>
          </div>

          <div className="flex flex-col gap-2">
            <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--color-text-muted)' }}>
              Instagram
            </p>
            <a
              href="https://instagram.com/tanosburgers"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-sm hover:text-[var(--color-primary)] transition-colors"
            >
              @tanosburgers
            </a>
          </div>

          <a
            href="https://wa.me/543329404361"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-3 rounded-[var(--radius-md)] font-bold text-sm transition-all hover:scale-105 active:scale-95 mt-2"
            style={{ backgroundColor: '#25D366', color: '#fff' }}
          >
            Escribir por WhatsApp
          </a>
        </aside>
      </div>
    </div>
  )
}
