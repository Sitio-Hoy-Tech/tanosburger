'use client'

import { useState } from 'react'
import { ShoppingBag, Check } from 'lucide-react'
import { useCartStore } from '@/store/cart'
import { trackEvent } from '@/lib/umami'

interface Variant {
  id: string
  name: string
  price_modifier: number
  stock: number
}

interface AddToCartButtonProps {
  productId: string
  name: string
  basePrice: number
  image?: string
  variants: Variant[]
  className?: string
}

function formatPrice(n: number) {
  return `$${n.toLocaleString('es-AR', { minimumFractionDigits: 0 })}`
}

export default function AddToCartButton({
  productId,
  name,
  basePrice,
  image,
  variants,
  className = '',
}: AddToCartButtonProps) {
  const { addItem } = useCartStore()
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(
    variants.length === 1 ? variants[0] : null
  )
  const [added, setAdded] = useState(false)

  const price = basePrice + (selectedVariant?.price_modifier ?? 0)
  const canAdd = variants.length === 0 || selectedVariant !== null

  function handleAdd() {
    if (!canAdd) return
    addItem({
      productId,
      variantId: selectedVariant?.id,
      name,
      variantName: selectedVariant?.name,
      price,
      quantity: 1,
      image,
    })
    trackEvent('add_to_cart', {
      product_id: productId,
      name,
      price,
      variant: selectedVariant?.name ?? null,
    })
    setAdded(true)
    setTimeout(() => setAdded(false), 1800)
  }

  return (
    <div className={`flex flex-col gap-4 ${className}`}>
      {/* Variantes */}
      {variants.length > 1 && (
        <div className="flex flex-col gap-2">
          <p className="text-sm font-semibold">Elegí tu opción:</p>
          <div className="flex flex-wrap gap-2">
            {variants.map((v) => (
              <button
                key={v.id}
                type="button"
                onClick={() => setSelectedVariant(v)}
                className={`px-4 py-2 rounded-[var(--radius-md)] text-sm font-medium border transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] ${
                  selectedVariant?.id === v.id
                    ? 'border-[var(--color-primary)] bg-[var(--color-primary)] text-[var(--color-text)]'
                    : 'border-[var(--color-border)] hover:border-[var(--color-primary)]'
                }`}
              >
                {v.name}
                {v.price_modifier !== 0 && (
                  <span className="ml-1 text-xs opacity-75">
                    {v.price_modifier > 0 ? '+' : ''}
                    {formatPrice(v.price_modifier)}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Precio final + botón */}
      <div className="flex items-center gap-3">
        <span className="text-2xl font-extrabold" style={{ color: 'var(--color-primary-text)', fontFamily: 'var(--font-display)' }}>
          {formatPrice(price)}
        </span>
        <button
          type="button"
          onClick={handleAdd}
          disabled={!canAdd || added}
          className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-[var(--radius-md)] font-bold text-sm transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-secondary)]"
          style={{ backgroundColor: 'var(--color-secondary)', color: '#fff' }}
        >
          {added ? (
            <>
              <Check size={16} />
              ¡Agregado!
            </>
          ) : (
            <>
              <ShoppingBag size={16} />
              {!canAdd ? 'Elegí una opción' : 'Agregar al pedido'}
            </>
          )}
        </button>
      </div>
    </div>
  )
}
