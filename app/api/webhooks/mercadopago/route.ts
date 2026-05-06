import { MercadoPagoConfig, Payment } from 'mercadopago'
import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { getTenantConfig } from '@/lib/supabase/tenant'
import { revalidateTag } from 'next/cache'
import { TAGS } from '@/lib/cache-tags'
import { sendOrderConfirmation } from '@/lib/resend/emails/order-confirmation'

const STATUS_MAP: Record<string, string> = {
  approved: 'confirmed',
  pending: 'pending',
  in_process: 'pending',
  rejected: 'cancelled',
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  const body = await req.json()

  if (body.type !== 'payment') {
    return NextResponse.json({ received: true })
  }

  const TENANT_ID = process.env.NEXT_PUBLIC_TENANT_ID!
  const config = await getTenantConfig()
  const mpClient = new MercadoPagoConfig({ accessToken: config.mp_access_token! })

  const payment = new Payment(mpClient)
  const paymentData = await payment.get({ id: body.data.id })
  const orderId = paymentData.external_reference

  if (!orderId) {
    return NextResponse.json({ error: 'Sin referencia' }, { status: 400 })
  }

  const supabase = createServiceClient()

  await supabase.from('payment_events').insert({
    tenant_id: TENANT_ID,
    order_id: orderId,
    provider: 'mercadopago',
    provider_event_id: String(paymentData.id),
    status: paymentData.status,
    payload: paymentData as unknown as Record<string, unknown>,
  })

  await supabase
    .from('orders')
    .update({
      payment_status: paymentData.status,
      status: STATUS_MAP[paymentData.status!] ?? 'pending',
      mp_payment_id: String(paymentData.id),
      updated_at: new Date().toISOString(),
    })
    .eq('id', orderId)
    .eq('tenant_id', TENANT_ID)

  if (paymentData.status === 'approved') {
    await sendOrderConfirmation(orderId)
  }

  revalidateTag(TAGS.ORDER(orderId), 'default')
  revalidateTag(TAGS.ORDERS, 'default')

  return NextResponse.json({ received: true })
}
