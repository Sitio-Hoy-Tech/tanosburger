import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Política de devoluciones — Tanos Burger',
  robots: { index: false },
}

export default function DevolucionesPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-extrabold mb-2" style={{ fontFamily: 'var(--font-display)' }}>
        Política de devoluciones
      </h1>
      <p className="text-sm mb-8" style={{ color: 'var(--color-text-muted)' }}>
        Última actualización: mayo 2026
      </p>

      <div className="flex flex-col gap-6 text-sm leading-relaxed">
        <section
          className="p-5 rounded-[var(--radius-lg)] border"
          style={{ borderColor: 'var(--color-primary)', backgroundColor: 'rgba(255,167,48,0.08)' }}
        >
          <p className="font-semibold text-base mb-1">Importante</p>
          <p>Por tratarse de productos alimenticios perecederos preparados al momento, <strong>no se aceptan devoluciones ni cambios por arrepentimiento</strong> una vez que el pedido fue preparado y/o entregado.</p>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="text-base font-bold">¿Cuándo sí aplica una devolución?</h2>
          <p>Gestionamos reembolsos o reposición sin costo en los siguientes casos:</p>
          <ul className="list-disc list-inside flex flex-col gap-1.5 mt-1" style={{ color: 'var(--color-text-muted)' }}>
            <li>El pedido llegó con un producto distinto al solicitado</li>
            <li>El pedido llegó incompleto (faltó un producto o ítem)</li>
            <li>El producto llegó en condiciones inaceptables (frío, deteriorado, sin sellar)</li>
            <li>El pago fue debitado pero el pedido no fue procesado</li>
          </ul>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="text-base font-bold">¿Cómo reclamar?</h2>
          <p>Tenés <strong>hasta 24 horas</strong> desde la recepción del pedido para contactarnos:</p>
          <ul className="list-disc list-inside flex flex-col gap-1" style={{ color: 'var(--color-text-muted)' }}>
            <li>Por WhatsApp al 3329 404361</li>
            <li>Por email a contacto@tanosburger.com.ar</li>
          </ul>
          <p className="mt-1">Incluí tu número de pedido y, si es posible, una foto del problema.</p>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="text-base font-bold">Tiempos de reembolso</h2>
          <p>Una vez validado el reclamo, el reembolso se procesa vía MercadoPago. El acreditación depende del banco emisor de tu tarjeta (generalmente entre 3 y 10 días hábiles).</p>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="text-base font-bold">Cancelaciones</h2>
          <p>Podés cancelar tu pedido <strong>dentro de los 5 minutos</strong> de haberlo confirmado, mientras esté en estado &quot;Pendiente&quot;. Pasado ese tiempo, el pedido ya puede estar en preparación y no es posible cancelarlo.</p>
          <p>Para cancelar, escribinos de inmediato por WhatsApp al 3329 404361.</p>
        </section>

        <div className="flex gap-4 mt-4">
          <Link
            href="/contacto"
            className="px-5 py-2.5 rounded-[var(--radius-md)] font-bold text-sm transition-all hover:scale-105"
            style={{ backgroundColor: 'var(--color-primary)', color: 'var(--color-text)' }}
          >
            Contactarnos
          </Link>
          <a
            href="https://wa.me/543329404361"
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 rounded-[var(--radius-md)] font-bold text-sm border transition-colors hover:bg-[var(--color-surface)]"
            style={{ borderColor: 'var(--color-border)' }}
          >
            WhatsApp
          </a>
        </div>
      </div>
    </div>
  )
}
