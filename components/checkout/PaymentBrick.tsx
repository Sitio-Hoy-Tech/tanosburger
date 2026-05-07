'use client'

import { useEffect, useRef } from 'react'
import { initMercadoPago, Payment } from '@mercadopago/sdk-react'

interface Props {
  preferenceId: string
  amount: number
  mpPublicKey: string
  onSuccess: (paymentId: string) => void
  onError: (error: unknown) => void
}

export default function PaymentBrick({ preferenceId, amount, mpPublicKey, onSuccess, onError }: Props) {
  const initialized = useRef(false)

  useEffect(() => {
    if (initialized.current) return
    initialized.current = true
    initMercadoPago(mpPublicKey, { locale: 'es-AR' })
  }, [mpPublicKey])

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
