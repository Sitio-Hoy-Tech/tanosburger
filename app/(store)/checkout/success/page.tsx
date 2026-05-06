import Link from 'next/link'
import { createServiceClient } from '@/lib/supabase/server'
import PurchaseTracker from '@/components/checkout/PurchaseTracker'

const TENANT_ID = process.env.NEXT_PUBLIC_TENANT_ID!

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ order_id?: string; pending?: string }>
}) {
  const { order_id, pending } = await searchParams

  let trackingToken: string | null = null

  if (order_id) {
    const supabase = createServiceClient()
    const { data } = await supabase
      .from('orders')
      .select('tracking_token')
      .eq('id', order_id)
      .eq('tenant_id', TENANT_ID)
      .single()
    trackingToken = data?.tracking_token ?? null
  }

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center gap-6">
      {order_id && !pending && <PurchaseTracker orderId={order_id} />}
      <div className="text-6xl">{pending ? '⏳' : '🎉'}</div>
      <h1 className="text-3xl font-extrabold" style={{ fontFamily: 'var(--font-display)' }}>
        {pending ? '¡Pago en proceso!' : '¡Pedido confirmado!'}
      </h1>
      <p className="text-base max-w-md" style={{ color: 'var(--color-text-muted)' }}>
        {pending
          ? 'Tu pago está siendo procesado. Te avisamos por email cuando se confirme.'
          : 'Recibimos tu pedido y lo estamos preparando. Te enviamos un email de confirmación.'}
      </p>

      <div className="flex flex-col sm:flex-row gap-3">
        {trackingToken && (
          <Link
            href={`/seguimiento?token=${trackingToken}`}
            className="px-6 py-3 rounded-[var(--radius-md)] font-bold text-sm transition-all hover:scale-105"
            style={{ backgroundColor: 'var(--color-primary)', color: 'var(--color-text)' }}
          >
            Seguir mi pedido
          </Link>
        )}
        <Link
          href="/menu"
          className="px-6 py-3 rounded-[var(--radius-md)] font-bold text-sm border transition-colors hover:bg-[var(--color-surface)]"
          style={{ borderColor: 'var(--color-border)' }}
        >
          Volver al menú
        </Link>
      </div>

      <a
        href="https://wa.me/543329404361"
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm underline"
        style={{ color: 'var(--color-text-muted)' }}
      >
        ¿Dudas? Escribinos por WhatsApp
      </a>
    </div>
  )
}
