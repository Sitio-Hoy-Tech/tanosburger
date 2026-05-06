import type { Metadata } from 'next'
import CheckoutFlow from '@/components/checkout/CheckoutFlow'

export const metadata: Metadata = {
  title: 'Checkout — Tanos Burger',
  robots: { index: false },
}

export default function CheckoutPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      <h1
        className="text-3xl font-extrabold mb-8"
        style={{ fontFamily: 'var(--font-display)' }}
      >
        Tu pedido
      </h1>
      <CheckoutFlow />
    </div>
  )
}
