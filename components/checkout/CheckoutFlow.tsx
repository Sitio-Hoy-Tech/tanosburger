'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useRouter } from 'next/navigation'
import { useCartStore } from '@/store/cart'
import { createOrder, createMPPreference, quoteShipping, validateCoupon } from '@/app/(store)/checkout/actions'
import { trackEvent } from '@/lib/umami'
import dynamic from 'next/dynamic'

const PaymentBrick = dynamic(() => import('@/components/checkout/PaymentBrick'), { ssr: false })

function formatPrice(n: number) {
  return `$${n.toLocaleString('es-AR', { minimumFractionDigits: 0 })}`
}

const schema = z.object({
  firstName: z.string().min(2, 'Nombre requerido'),
  lastName: z.string().min(2, 'Apellido requerido'),
  email: z.string().email('Email inválido'),
  phone: z.string().min(8, 'Teléfono inválido'),
  deliveryType: z.enum(['delivery', 'retiro']),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  postalCode: z.string().optional(),
})

type FormData = z.infer<typeof schema>

interface ShippingRate {
  carrier: string
  service: string
  serviceDescription: string
  days: number
  totalPrice: number
}

export default function CheckoutFlow() {
  const { items, coupon, discount, applyCoupon, clearCart } = useCartStore()
  const router = useRouter()
  const [step, setStep] = useState<'datos' | 'envio' | 'pago' | 'exito'>('datos')
  const [shippingRates, setShippingRates] = useState<ShippingRate[]>([])
  const [selectedRate, setSelectedRate] = useState<ShippingRate | null>(null)
  const [quotingShipping, setQuotingShipping] = useState(false)
  const [couponInput, setCouponInput] = useState('')
  const [couponError, setCouponError] = useState('')
  const [couponLoading, setCouponLoading] = useState(false)
  const [orderId, setOrderId] = useState<string | null>(null)
  const [preferenceId, setPreferenceId] = useState<string | null>(null)
  const [mpPublicKey, setMpPublicKey] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const subtotal = items.reduce((acc, i) => acc + i.price * i.quantity, 0)
  const shippingCost = selectedRate?.totalPrice ?? 0
  const total = Math.max(0, subtotal - discount) + shippingCost

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { deliveryType: 'delivery' },
  })

  const deliveryType = watch('deliveryType')

  if (items.length === 0 && step !== 'exito') {
    return (
      <div className="text-center py-20">
        <p className="text-xl font-bold mb-4" style={{ fontFamily: 'var(--font-display)' }}>
          Tu carrito está vacío
        </p>
        <Link
          href="/menu"
          className="px-6 py-3 rounded-[var(--radius-md)] font-bold inline-block transition-all hover:scale-105"
          style={{ backgroundColor: 'var(--color-primary)', color: 'var(--color-text)' }}
        >
          Ver menú
        </Link>
      </div>
    )
  }

  async function handleCoupon() {
    setCouponLoading(true)
    setCouponError('')
    const result = await validateCoupon(couponInput, subtotal)
    if (result.valid && result.discount) {
      applyCoupon(couponInput.toUpperCase(), result.discount)
      trackEvent('coupon_applied', { coupon: couponInput.toUpperCase(), discount: result.discount })
    } else {
      setCouponError(result.error ?? 'Cupón inválido')
    }
    setCouponLoading(false)
  }

  async function onSubmitDatos(data: FormData) {
    trackEvent('checkout_started', { delivery_type: data.deliveryType, items: items.length, subtotal })
    if (data.deliveryType === 'retiro') {
      setStep('pago')
      await confirmOrder(data)
      return
    }

    setQuotingShipping(true)
    const rates = await quoteShipping({
      name: `${data.firstName} ${data.lastName}`,
      address: data.address ?? '',
      city: data.city ?? '',
      state: data.state ?? '',
      postalCode: data.postalCode ?? '',
    })
    setShippingRates(rates)
    setQuotingShipping(false)
    setStep('envio')
  }

  async function confirmOrder(data: FormData) {
    setSubmitting(true)
    setError('')
    try {
      const { orderId: oid } = await createOrder({
        buyer: data,
        items: items.map((i) => ({
          productId: i.productId,
          variantId: i.variantId,
          name: i.name,
          variantName: i.variantName,
          price: i.price,
          quantity: i.quantity,
        })),
        couponCode: coupon ?? undefined,
        shippingCost: selectedRate?.totalPrice,
        shippingCarrier: selectedRate?.carrier,
      })

      const { preferenceId: pid, mpPublicKey: pk } = await createMPPreference(oid)
      setOrderId(oid)
      setPreferenceId(pid)
      setMpPublicKey(pk)
      setStep('pago')
    } catch {
      setError('Hubo un error al crear tu pedido. Intentá de nuevo.')
    } finally {
      setSubmitting(false)
    }
  }

  function handlePaymentSuccess() {
    clearCart()
    router.push(`/checkout/success?order_id=${orderId}`)
  }

  // Progreso
  const steps = ['datos', 'envio', 'pago']
  const currentIdx = steps.indexOf(step)

  return (
    <div className="flex flex-col gap-8">
      {/* Stepper */}
      {step !== 'exito' && (
        <div className="flex items-center gap-2">
          {['Datos', deliveryType === 'retiro' ? null : 'Envío', 'Pago']
            .filter(Boolean)
            .map((label, i) => (
              <div key={label} className="flex items-center gap-2">
                {i > 0 && <div className="w-8 h-px" style={{ backgroundColor: 'var(--color-border)' }} />}
                <div className="flex items-center gap-1.5">
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                    style={{
                      backgroundColor: i <= currentIdx ? 'var(--color-primary)' : 'var(--color-surface)',
                      color: i <= currentIdx ? 'var(--color-text)' : 'var(--color-text-muted)',
                    }}
                  >
                    {i + 1}
                  </div>
                  <span className="text-sm font-medium hidden sm:block">{label}</span>
                </div>
              </div>
            ))}
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Formulario / Paso activo */}
        <div className="flex-1">
          {/* Paso 1: Datos */}
          {step === 'datos' && (
            <form onSubmit={handleSubmit(onSubmitDatos)} className="flex flex-col gap-5">
              <div className="grid grid-cols-2 gap-4">
                <Field label="Nombre" error={errors.firstName?.message}>
                  <input {...register('firstName')} placeholder="Juan" className={inputClass} />
                </Field>
                <Field label="Apellido" error={errors.lastName?.message}>
                  <input {...register('lastName')} placeholder="García" className={inputClass} />
                </Field>
              </div>
              <Field label="Email" error={errors.email?.message}>
                <input {...register('email')} type="email" placeholder="juan@mail.com" className={inputClass} />
              </Field>
              <Field label="Teléfono" error={errors.phone?.message}>
                <input {...register('phone')} placeholder="11 1234 5678" className={inputClass} />
              </Field>

              <fieldset className="flex gap-3">
                <legend className="text-sm font-semibold mb-2 block w-full">Tipo de entrega</legend>
                {[
                  { value: 'delivery', label: '🛵 Delivery a domicilio' },
                  { value: 'retiro', label: '🏪 Retiro en local' },
                ].map((opt) => (
                  <label
                    key={opt.value}
                    className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-[var(--radius-md)] border cursor-pointer text-sm font-medium transition-all ${
                      deliveryType === opt.value
                        ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/10'
                        : 'border-[var(--color-border)]'
                    }`}
                  >
                    <input type="radio" value={opt.value} {...register('deliveryType')} className="sr-only" />
                    {opt.label}
                  </label>
                ))}
              </fieldset>

              {deliveryType === 'delivery' && (
                <div className="flex flex-col gap-4">
                  <Field label="Dirección" error={errors.address?.message}>
                    <input {...register('address')} placeholder="Av. San Martín 1234" className={inputClass} />
                  </Field>
                  <div className="grid grid-cols-2 gap-4">
                    <Field label="Ciudad" error={errors.city?.message}>
                      <input {...register('city')} placeholder="Zárate" className={inputClass} />
                    </Field>
                    <Field label="Código postal" error={errors.postalCode?.message}>
                      <input {...register('postalCode')} placeholder="2800" className={inputClass} />
                    </Field>
                  </div>
                  <Field label="Provincia" error={errors.state?.message}>
                    <input {...register('state')} placeholder="Buenos Aires" className={inputClass} />
                  </Field>
                </div>
              )}

              <button
                type="submit"
                disabled={quotingShipping}
                className="w-full py-3.5 rounded-[var(--radius-md)] font-bold text-sm transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60"
                style={{ backgroundColor: 'var(--color-secondary)', color: '#fff' }}
              >
                {quotingShipping ? 'Calculando envío...' : deliveryType === 'retiro' ? 'Ir al pago' : 'Continuar'}
              </button>
            </form>
          )}

          {/* Paso 2: Envío */}
          {step === 'envio' && (
            <div className="flex flex-col gap-5">
              <h2 className="text-xl font-bold" style={{ fontFamily: 'var(--font-display)' }}>
                Elegí el envío
              </h2>

              {shippingRates.length === 0 ? (
                <div
                  className="p-4 rounded-[var(--radius-md)] border"
                  style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-surface)' }}
                >
                  <p className="font-semibold text-sm">Coordinar envío</p>
                  <p className="text-sm mt-1" style={{ color: 'var(--color-text-muted)' }}>
                    Te contactaremos por WhatsApp para coordinar la entrega.
                  </p>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {shippingRates.map((rate, i) => (
                    <label
                      key={i}
                      className={`flex items-center justify-between p-4 rounded-[var(--radius-md)] border cursor-pointer transition-all ${
                        selectedRate?.service === rate.service
                          ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/10'
                          : 'border-[var(--color-border)]'
                      }`}
                    >
                      <input
                        type="radio"
                        name="shipping"
                        className="sr-only"
                        onChange={() => setSelectedRate(rate)}
                        checked={selectedRate?.service === rate.service}
                      />
                      <div>
                        <p className="font-semibold text-sm">{rate.serviceDescription || rate.service}</p>
                        <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-muted)' }}>
                          {rate.days} días hábiles
                        </p>
                      </div>
                      <span className="font-bold" style={{ color: 'var(--color-primary)' }}>
                        {formatPrice(rate.totalPrice)}
                      </span>
                    </label>
                  ))}
                </div>
              )}

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setStep('datos')}
                  className="px-5 py-3 rounded-[var(--radius-md)] font-semibold text-sm border transition-colors"
                  style={{ borderColor: 'var(--color-border)' }}
                >
                  Atrás
                </button>
                <button
                  type="button"
                  disabled={shippingRates.length > 0 && !selectedRate}
                  onClick={async () => {
                    // Necesitamos el form data — lo guardamos antes
                    setStep('pago')
                  }}
                  className="flex-1 py-3 rounded-[var(--radius-md)] font-bold text-sm transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60"
                  style={{ backgroundColor: 'var(--color-secondary)', color: '#fff' }}
                >
                  Ir al pago
                </button>
              </div>
            </div>
          )}

          {/* Paso 3: Pago */}
          {step === 'pago' && preferenceId && mpPublicKey && (
            <div className="flex flex-col gap-5">
              <h2 className="text-xl font-bold" style={{ fontFamily: 'var(--font-display)' }}>
                Pago seguro
              </h2>
              <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                🔒 Procesado por MercadoPago. Tanos Burger nunca accede a tus datos de tarjeta.
              </p>
              <PaymentBrick
                preferenceId={preferenceId}
                amount={total}
                mpPublicKey={mpPublicKey}
                onSuccess={handlePaymentSuccess}
                onError={() => setError('El pago no pudo procesarse. Intentá de nuevo.')}
              />
              {error && (
                <p className="text-sm font-medium" style={{ color: 'var(--color-secondary)' }}>{error}</p>
              )}
            </div>
          )}

          {step === 'pago' && submitting && (
            <div className="flex flex-col gap-3 py-4">
              <div className="skeleton h-12 rounded-[var(--radius-md)]" />
              <div className="skeleton h-12 rounded-[var(--radius-md)]" />
            </div>
          )}

          {error && step === 'datos' && (
            <p className="text-sm font-medium mt-2" style={{ color: 'var(--color-secondary)' }}>{error}</p>
          )}
        </div>

        {/* Resumen */}
        <aside className="lg:w-72 shrink-0">
          <div
            className="rounded-[var(--radius-lg)] border p-5 flex flex-col gap-4 sticky top-24"
            style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-surface)' }}
          >
            <h2 className="font-bold text-base" style={{ fontFamily: 'var(--font-display)' }}>
              Resumen
            </h2>
            <ul className="flex flex-col gap-3">
              {items.map((item) => (
                <li key={item.id} className="flex justify-between text-sm gap-2">
                  <span className="truncate">
                    {item.name}
                    {item.variantName && <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}> ({item.variantName})</span>}
                    <span style={{ color: 'var(--color-text-muted)' }}> x{item.quantity}</span>
                  </span>
                  <span className="shrink-0 font-medium">{formatPrice(item.price * item.quantity)}</span>
                </li>
              ))}
            </ul>

            {/* Cupón */}
            <div className="flex flex-col gap-2">
              {!coupon ? (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                    placeholder="Cupón"
                    className={`${inputClass} flex-1 text-xs py-2`}
                  />
                  <button
                    type="button"
                    onClick={handleCoupon}
                    disabled={couponLoading || !couponInput}
                    className="px-3 py-2 rounded-[var(--radius-md)] text-xs font-semibold border transition-colors disabled:opacity-50"
                    style={{ borderColor: 'var(--color-border)' }}
                  >
                    {couponLoading ? '...' : 'Aplicar'}
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-between text-xs font-medium" style={{ color: 'var(--color-secondary)' }}>
                  <span>Cupón {coupon} aplicado</span>
                  <span>-{formatPrice(discount)}</span>
                </div>
              )}
              {couponError && <p className="text-xs" style={{ color: 'var(--color-secondary)' }}>{couponError}</p>}
            </div>

            <div
              className="flex flex-col gap-1.5 pt-3 border-t text-sm"
              style={{ borderColor: 'var(--color-border)' }}
            >
              <div className="flex justify-between">
                <span style={{ color: 'var(--color-text-muted)' }}>Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between" style={{ color: 'var(--color-secondary)' }}>
                  <span>Descuento</span>
                  <span>-{formatPrice(discount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span style={{ color: 'var(--color-text-muted)' }}>Envío</span>
                <span>{selectedRate ? formatPrice(shippingCost) : '—'}</span>
              </div>
              <div className="flex justify-between font-bold text-base pt-1 border-t" style={{ borderColor: 'var(--color-border)' }}>
                <span>Total</span>
                <span style={{ color: 'var(--color-primary)' }}>{formatPrice(total)}</span>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}

const inputClass =
  'w-full px-3 py-2.5 rounded-[var(--radius-md)] border text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-colors'

function Field({
  label,
  error,
  children,
}: {
  label: string
  error?: string
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-semibold">{label}</label>
      {children}
      {error && <p className="text-xs" style={{ color: 'var(--color-secondary)' }}>{error}</p>}
    </div>
  )
}
