'use client'

import { useEffect, useState } from 'react'
import { ShoppingBag } from 'lucide-react'
import { useCartStore } from '@/store/cart'

export default function CartButton() {
  const { openCart, getItemCount } = useCartStore()
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  const count = mounted ? getItemCount() : 0

  return (
    <button
      type="button"
      onClick={openCart}
      aria-label={`Carrito — ${count} ${count === 1 ? 'producto' : 'productos'}`}
      className="relative p-2 transition-transform active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 rounded-[var(--radius-sm)]"
    >
      <ShoppingBag size={24} strokeWidth={1.75} />
      {count > 0 && (
        <span
          aria-hidden="true"
          className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 flex items-center justify-center rounded-full text-[10px] font-bold"
          style={{ backgroundColor: 'var(--color-secondary)', color: '#fff' }}
        >
          {count > 99 ? '99+' : count}
        </span>
      )}
    </button>
  )
}
