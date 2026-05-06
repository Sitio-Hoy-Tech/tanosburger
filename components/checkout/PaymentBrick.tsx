'use client'

import { useEffect, useRef, useState } from 'react'
import { initMercadoPago, Payment } from '@mercadopago/sdk-react'

interface Props {
  preferenceId: string
  amount: number
  mpPublicKey: string
  onSuccess: (paymentId: string) => void
  onError: (error: unknown) => void
}

function PaymentSkeleton() {
  return (
    <div className="flex flex-col gap-3 py-4">
      <div className="skeleton h-12 rounded-[var(--radius-md)]" />
      <div className="skeleton h-12 rounded-[var(--radius-md)]" />
      <div className="skeleton h-12 rounded-[var(--radius-md)]" />
    </div>
  )
}

export default function PaymentBrick({ preferenceId, amount, mpPublicKey, onSuccess, onError }: Props) {
  const initialized = useRef(false)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (initialized.current) return
    initialized.current = true
    initMercadoPago(mpPublicKey, { locale: 'es-AR' })
    // Schedule state update after mount to avoid synchronous setState in effect
    const id = setTimeout(() => setReady(true), 0)
    return () => clearTimeout(id)
  }, [mpPublicKey])

  if (!ready) return <PaymentSkeleton />

  return (
    <Payment
      initialization={{ amount, preferenceId, payer: { email: '' } }}
      customization={{
        visual: {
          style: { theme: 'default' },
          hideFormTitle: true,
        },
        paymentMethods: {
          creditCard: 'all',
          debitCard: 'all',
          mercadoPago: 'all',
          atm: 'all',
          ticket: 'all',
        },
      }}
      onSubmit={async ({ formData }) => {
        const res = await fetch('/api/checkout/payment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ formData }),
        })
        const { paymentId, status } = await res.json()
        if (status === 'approved' || status === 'in_process') onSuccess(paymentId)
        else onError(new Error(`Pago rechazado: ${status}`))
      }}
      onError={onError}
    />
  )
}
