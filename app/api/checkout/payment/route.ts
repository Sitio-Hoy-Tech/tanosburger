import { MercadoPagoConfig, Payment } from 'mercadopago'
import { NextRequest, NextResponse } from 'next/server'
import { getTenantConfig } from '@/lib/supabase/tenant'
import { revalidateTag } from 'next/cache'
import { TAGS } from '@/lib/cache-tags'

export async function POST(req: NextRequest): Promise<NextResponse> {
  const config = await getTenantConfig()
  const mpClient = new MercadoPagoConfig({ accessToken: config.mp_access_token! })

  const { formData } = await req.json()
  const payment = new Payment(mpClient)

  const result = await payment.create({
    body: { ...formData },
    requestOptions: { idempotencyKey: formData.external_reference ?? crypto.randomUUID() },
  })

  if (result.status === 'approved') {
    revalidateTag(TAGS.ORDER(result.external_reference!), 'default')
    revalidateTag(TAGS.ORDERS, 'default')
  }

  return NextResponse.json({
    paymentId: result.id,
    status: result.status,
    statusDetail: result.status_detail,
  })
}
