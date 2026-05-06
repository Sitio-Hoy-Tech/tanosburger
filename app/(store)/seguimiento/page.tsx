import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createServiceClient } from '@/lib/supabase/server'

export const metadata: Metadata = {
  title: 'Seguimiento de pedido — Tanos Burger',
  robots: { index: false },
}

const TENANT_ID = process.env.NEXT_PUBLIC_TENANT_ID!

const STATUS_LABELS: Record<string, { label: string; emoji: string }> = {
  pending: { label: 'Pendiente de pago', emoji: '⏳' },
  confirmed: { label: 'Confirmado — preparando tu pedido', emoji: '👨‍🍳' },
  shipped: { label: 'En camino', emoji: '🛵' },
  delivered: { label: 'Entregado', emoji: '✅' },
  cancelled: { label: 'Cancelado', emoji: '❌' },
}

function formatPrice(n: number) {
  return `$${n.toLocaleString('es-AR', { minimumFractionDigits: 0 })}`
}

export default async function SeguimientoPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>
}) {
  const { token } = await searchParams

  if (!token) notFound()

  const supabase = createServiceClient()
  const { data: order } = await supabase
    .from('orders')
    .select('id, status, total, customer_first_name, created_at, shipping_address, order_items(name, variant_name, quantity, unit_price)')
    .eq('tenant_id', TENANT_ID)
    .eq('tracking_token', token)
    .single()

  if (!order) notFound()

  const status = STATUS_LABELS[order.status] ?? { label: order.status, emoji: '📦' }
  const address = order.shipping_address as Record<string, string> | null

  return (
    <div className="max-w-xl mx-auto px-4 py-12">
      <Link
        href="/"
        className="text-sm hover:text-[var(--color-primary)] transition-colors mb-8 inline-block"
        style={{ color: 'var(--color-text-muted)' }}
      >
        ← Volver al inicio
      </Link>

      <div
        className="rounded-[var(--radius-lg)] border p-6 flex flex-col gap-6"
        style={{ borderColor: 'var(--color-border)' }}
      >
        {/* Estado */}
        <div className="flex flex-col items-center text-center gap-2 pb-4 border-b" style={{ borderColor: 'var(--color-border)' }}>
          <span className="text-5xl">{status.emoji}</span>
          <h1 className="text-2xl font-extrabold" style={{ fontFamily: 'var(--font-display)' }}>
            {status.label}
          </h1>
          <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
            Pedido del {new Date(order.created_at).toLocaleDateString('es-AR', { day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>

        {/* Items */}
        <div className="flex flex-col gap-3">
          <h2 className="font-bold text-sm">Tu pedido</h2>
          <ul className="flex flex-col gap-2">
            {(order.order_items as { name: string; variant_name: string | null; quantity: number; unit_price: number }[]).map((item, i) => (
              <li key={i} className="flex justify-between text-sm">
                <span>
                  {item.name}
                  {item.variant_name && (
                    <span style={{ color: 'var(--color-text-muted)' }}> ({item.variant_name})</span>
                  )}
                  <span style={{ color: 'var(--color-text-muted)' }}> x{item.quantity}</span>
                </span>
                <span className="font-medium">{formatPrice(Number(item.unit_price) * item.quantity)}</span>
              </li>
            ))}
          </ul>
          <div
            className="flex justify-between font-bold pt-2 border-t text-base"
            style={{ borderColor: 'var(--color-border)', color: 'var(--color-primary)' }}
          >
            <span>Total</span>
            <span>{formatPrice(Number(order.total))}</span>
          </div>
        </div>

        {/* Dirección */}
        {address && (
          <div className="flex flex-col gap-1 text-sm">
            <h2 className="font-bold">Dirección de entrega</h2>
            <p style={{ color: 'var(--color-text-muted)' }}>
              {address.address}, {address.city} ({address.postalCode})
            </p>
          </div>
        )}

        {/* CTA WhatsApp */}
        <a
          href="https://wa.me/543329404361"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full py-3 rounded-[var(--radius-md)] font-semibold text-sm transition-all hover:scale-[1.02] active:scale-[0.98]"
          style={{ backgroundColor: '#25D366', color: '#fff' }}
        >
          ¿Consultas? Escribinos por WhatsApp
        </a>
      </div>
    </div>
  )
}
