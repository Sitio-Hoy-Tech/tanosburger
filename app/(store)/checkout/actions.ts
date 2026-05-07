'use server'

import { z } from 'zod'
import { MercadoPagoConfig, Preference } from 'mercadopago'
import { createServiceClient } from '@/lib/supabase/server'
import { getTenantConfig } from '@/lib/supabase/tenant'
import { getShippingRates } from '@/lib/envia/client'
import { revalidateTag } from 'next/cache'
import { TAGS } from '@/lib/cache-tags'

const TENANT_ID = process.env.NEXT_PUBLIC_TENANT_ID!

const buyerSchema = z.object({
  firstName: z.string().min(2).max(100),
  lastName: z.string().min(2).max(100),
  email: z.string().email(),
  phone: z.string().min(8).max(20),
  deliveryType: z.enum(['delivery', 'retiro']),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  postalCode: z.string().optional(),
})

const cartItemSchema = z.object({
  productId: z.string().uuid(),
  variantId: z.string().optional(),
  name: z.string(),
  variantName: z.string().optional(),
  price: z.number().positive(),
  quantity: z.number().int().positive(),
})

export async function quoteShipping(destination: {
  name: string
  address: string
  city: string
  state: string
  postalCode: string
}) {
  return getShippingRates(destination)
}

export async function validateCoupon(code: string, subtotal: number) {
  const supabase = createServiceClient()
  const { data: coupon } = await supabase
    .from('coupons')
    .select('*')
    .eq('tenant_id', TENANT_ID)
    .eq('code', code.toUpperCase())
    .eq('active', true)
    .single()

  if (!coupon) return { valid: false, error: 'Cupón no válido' }
  if (coupon.expires_at && new Date(coupon.expires_at) < new Date())
    return { valid: false, error: 'El cupón venció' }
  if (coupon.max_uses && coupon.uses_count >= coupon.max_uses)
    return { valid: false, error: 'El cupón ya fue usado' }
  if (subtotal < (coupon.min_amount ?? 0))
    return { valid: false, error: `Mínimo $${coupon.min_amount?.toLocaleString('es-AR')}` }

  const discount =
    coupon.type === 'percent'
      ? Math.round(subtotal * (coupon.value / 100))
      : coupon.value

  return { valid: true, discount, code: coupon.code, type: coupon.type }
}

export async function createOrder(data: {
  buyer: z.infer<typeof buyerSchema>
  items: z.infer<typeof cartItemSchema>[]
  couponCode?: string
  shippingCost?: number
  shippingCarrier?: string
}) {
  const buyer = buyerSchema.parse(data.buyer)
  const rawItems = z.array(cartItemSchema).parse(data.items)

  const supabase = createServiceClient()

  // Verificar precios server-side
  const productIds = rawItems.map((i) => i.productId)
  const { data: dbProducts, error: dbError } = await supabase
    .from('products')
    .select('id, price, product_variants(id, price_modifier)')
    .eq('tenant_id', TENANT_ID)
    .in('id', productIds)

  const priceMap = new Map(dbProducts?.map((p) => [p.id, p]) ?? [])

  const verifiedItems = rawItems.map((item) => {
    const product = priceMap.get(item.productId)
    if (!product) throw new Error(`Producto no encontrado: ${item.productId}`)

    let unitPrice = Number(product.price)
    if (item.variantId) {
      const variant = (product.product_variants as { id: string; price_modifier: number }[]).find(
        (v) => v.id === item.variantId
      )
      if (variant) unitPrice += Number(variant.price_modifier)
    }

    return { ...item, price: unitPrice }
  })

  // Calcular totales
  const subtotal = verifiedItems.reduce((acc, i) => acc + i.price * i.quantity, 0)
  let discountAmount = 0

  if (data.couponCode) {
    const { valid, discount } = await validateCoupon(data.couponCode, subtotal)
    if (valid) discountAmount = discount ?? 0
  }

  const shippingCost = data.shippingCost ?? 0
  const total = Math.max(0, subtotal - discountAmount) + shippingCost

  // Crear orden
  const { data: order, error } = await supabase
    .from('orders')
    .insert({
      tenant_id: TENANT_ID,
      status: 'pending',
      payment_status: 'pending',
      customer_first_name: buyer.firstName,
      customer_last_name: buyer.lastName,
      payer_email: buyer.email,
      customer_phone: buyer.phone,
      shipping_address:
        buyer.deliveryType === 'delivery'
          ? {
              address: buyer.address,
              city: buyer.city,
              state: buyer.state,
              postalCode: buyer.postalCode,
            }
          : null,
      shipping_carrier: data.shippingCarrier ?? null,
      shipping_cost: shippingCost,
      coupon_code: data.couponCode ?? null,
      discount_amount: discountAmount,
      total,
      currency: 'ARS',
    })
    .select('id, tracking_token')
    .single()

  if (error || !order) throw new Error('Error al crear el pedido')

  // Crear items
  await supabase.from('order_items').insert(
    verifiedItems.map((item) => ({
      tenant_id: TENANT_ID,
      order_id: order.id,
      product_id: item.productId,
      variant_id: item.variantId ?? null,
      name: item.name,
      variant_name: item.variantName ?? null,
      quantity: item.quantity,
      unit_price: item.price,
    }))
  )

  // Actualizar uso de cupón
  if (data.couponCode) {
    await supabase.rpc('increment_coupon_uses', {
      p_tenant_id: TENANT_ID,
      p_code: data.couponCode,
    })
  }

  revalidateTag('orders', 'default')
  return { orderId: order.id, trackingToken: order.tracking_token }
}

export async function createMPPreference(orderId: string) {
  const config = await getTenantConfig()

  if (!config.mp_access_token) {
    throw new Error('MercadoPago no configurado')
  }

  const mpClient = new MercadoPagoConfig({ accessToken: config.mp_access_token })
  const supabase = createServiceClient()

  const { data: order } = await supabase
    .from('orders')
    .select('*, order_items(name, variant_name, quantity, unit_price)')
    .eq('tenant_id', TENANT_ID)
    .eq('id', orderId)
    .single()

  if (!order) throw new Error('Pedido no encontrado')

  type RawOrderItem = { product_id: string | null; name: string; variant_name: string | null; quantity: number; unit_price: number }
  const items = (order.order_items as RawOrderItem[]).map((item) => ({
    id: item.product_id ?? orderId,
    title: item.variant_name ? `${item.name} — ${item.variant_name}` : item.name,
    quantity: item.quantity,
    unit_price: Number(item.unit_price),
    currency_id: 'ARS',
  }))

  if (order.shipping_cost > 0) {
    items.push({
      id: 'envio',
      title: `Envío — ${order.shipping_carrier ?? 'Envío'}`,
      quantity: 1,
      unit_price: Number(order.shipping_cost),
      currency_id: 'ARS',
    })
  }

  const preference = new Preference(mpClient)
  const result = await preference.create({
    body: {
      items,
      payer: { email: order.payer_email ?? '' },
      notification_url: `${process.env.NEXT_PUBLIC_URL}/api/webhooks/mercadopago`,
      external_reference: order.id,
      statement_descriptor: 'TANOS BURGER',
      back_urls: {
        success: `${process.env.NEXT_PUBLIC_URL}/checkout/success?order_id=${order.id}`,
        failure: `${process.env.NEXT_PUBLIC_URL}/checkout?error=pago_fallido`,
        pending: `${process.env.NEXT_PUBLIC_URL}/checkout/success?order_id=${order.id}&pending=true`,
      },
    },
  })

  return { preferenceId: result.id!, mpPublicKey: config.mp_public_key! }
}
