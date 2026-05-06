'use client'

import { useEffect } from 'react'
import { trackEvent } from '@/lib/umami'

export default function PurchaseTracker({ orderId }: { orderId: string }) {
  useEffect(() => {
    trackEvent('purchase', { order_id: orderId })
  }, [orderId])

  return null
}
