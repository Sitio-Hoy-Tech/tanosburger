'use client'

import { useEffect } from 'react'
import { trackEvent } from '@/lib/umami'

interface Props {
  productId: string
  name: string
  price: number
}

export default function ProductViewTracker({ productId, name, price }: Props) {
  useEffect(() => {
    trackEvent('product_viewed', { product_id: productId, name, price })
  }, [productId, name, price])

  return null
}
