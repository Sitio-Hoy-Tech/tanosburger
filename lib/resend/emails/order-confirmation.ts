import { getResendClient } from '../client'
import { createServiceClient } from '@/lib/supabase/server'

export const sendOrderConfirmation = async (orderId: string) => {
  const client = await getResendClient()
  if (!client) return

  const supabase = createServiceClient()
  const { data: order } = await supabase
    .from('orders')
    .select('*, order_items(name, variant_name, quantity, unit_price)')
    .eq('id', orderId)
    .single()

  if (!order || !order.payer_email) return

  const trackingUrl = `${process.env.NEXT_PUBLIC_URL}/seguimiento?token=${order.tracking_token}`

  type OrderItem = { name: string; variant_name: string | null; quantity: number; unit_price: number }
  const itemsHtml = (order.order_items as OrderItem[])
    .map(
      (i) => `
    <tr>
      <td style="padding:8px">${i.name}${i.variant_name ? ` (${i.variant_name})` : ''}</td>
      <td style="padding:8px;text-align:center">x${i.quantity}</td>
      <td style="padding:8px;text-align:right">$${Number(i.unit_price).toLocaleString('es-AR')}</td>
    </tr>`
    )
    .join('')

  await client.resend.emails.send({
    from: client.from,
    to: order.payer_email,
    subject: `¡Pedido confirmado! — Tanos Burger`,
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;color:#1a1a1a">
        <div style="background:#FFA730;padding:24px;text-align:center;border-radius:8px 8px 0 0">
          <h1 style="margin:0;color:#1a1a1a;font-size:24px">¡Gracias por tu pedido!</h1>
        </div>
        <div style="padding:24px;background:#fff;border:1px solid #e5e7eb;border-top:none;border-radius:0 0 8px 8px">
          <p>Hola <strong>${order.customer_first_name ?? ''}</strong>, recibimos tu pedido y lo estamos preparando.</p>
          <table style="width:100%;border-collapse:collapse;margin:16px 0">
            <thead>
              <tr style="background:#f9f5f0">
                <th style="padding:8px;text-align:left">Producto</th>
                <th style="padding:8px;text-align:center">Cant.</th>
                <th style="padding:8px;text-align:right">Precio</th>
              </tr>
            </thead>
            <tbody>${itemsHtml}</tbody>
            <tfoot>
              ${order.shipping_cost > 0 ? `<tr><td colspan="2" style="padding:8px">Envío</td><td style="padding:8px;text-align:right">$${Number(order.shipping_cost).toLocaleString('es-AR')}</td></tr>` : ''}
              ${order.discount_amount > 0 ? `<tr><td colspan="2" style="padding:8px;color:#C80F2C">Descuento</td><td style="padding:8px;text-align:right;color:#C80F2C">-$${Number(order.discount_amount).toLocaleString('es-AR')}</td></tr>` : ''}
              <tr style="background:#f9f5f0">
                <td colspan="2" style="padding:8px"><strong>Total</strong></td>
                <td style="padding:8px;text-align:right"><strong style="color:#FFA730">$${Number(order.total).toLocaleString('es-AR')}</strong></td>
              </tr>
            </tfoot>
          </table>
          <div style="text-align:center;margin-top:24px">
            <a href="${trackingUrl}" style="display:inline-block;background:#C80F2C;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:bold">
              Seguir mi pedido →
            </a>
          </div>
          <p style="margin-top:24px;font-size:13px;color:#6b7280">¿Tenés dudas? Escribinos por <a href="https://wa.me/543329404361" style="color:#FFA730">WhatsApp</a> o a <a href="mailto:contacto@tanosburger.com.ar" style="color:#FFA730">contacto@tanosburger.com.ar</a></p>
        </div>
      </div>
    `,
  })
}
