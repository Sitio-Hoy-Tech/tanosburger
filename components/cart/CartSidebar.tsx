'use client'

import { X, Minus, Plus, Trash2 } from 'lucide-react'
import { useCartStore } from '@/store/cart'

function formatPrice(n: number) {
  return `$${n.toLocaleString('es-AR', { minimumFractionDigits: 0 })}`
}

export default function CartSidebar() {
  const { items, isOpen, closeCart, updateQuantity, removeItem, getTotal, discount, coupon } =
    useCartStore()

  const subtotal = items.reduce((acc, i) => acc + i.price * i.quantity, 0)
  const total = getTotal()

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 transition-opacity"
          onClick={closeCart}
          aria-hidden="true"
        />
      )}

      {/* Drawer */}
      <aside
        role="dialog"
        aria-label="Carrito de compras"
        aria-modal="true"
        className={`fixed top-0 right-0 h-full w-full max-w-[400px] bg-white z-50 flex flex-col shadow-xl transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-5 py-4 border-b"
          style={{ borderColor: 'var(--color-border)' }}
        >
          <h2
            className="text-lg font-bold"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Tu pedido
          </h2>
          <button
            type="button"
            onClick={closeCart}
            aria-label="Cerrar carrito"
            className="p-2 rounded-[var(--radius-sm)] hover:bg-[var(--neutral-100)] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"
          >
            <X size={20} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-3 text-center">
              <span className="text-5xl">🍔</span>
              <p
                className="font-semibold text-lg"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                Tu carrito está vacío
              </p>
              <p style={{ color: 'var(--color-text-muted)' }} className="text-sm">
                Agregá algo del menú para empezar
              </p>
              <button
                type="button"
                onClick={closeCart}
                className="mt-2 px-5 py-2.5 rounded-[var(--radius-md)] font-semibold text-sm transition-colors"
                style={{ backgroundColor: 'var(--color-primary)', color: 'var(--color-text)' }}
              >
                Ver menú
              </button>
            </div>
          ) : (
            <ul className="flex flex-col gap-4">
              {items.map((item) => (
                <li
                  key={item.id}
                  className="flex gap-3 pb-4 border-b last:border-b-0"
                  style={{ borderColor: 'var(--color-border)' }}
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm leading-tight truncate">{item.name}</p>
                    {item.variantName && (
                      <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-muted)' }}>
                        {item.variantName}
                      </p>
                    )}
                    <p
                      className="text-sm font-bold mt-1"
                      style={{ color: 'var(--color-primary-text)' }}
                    >
                      {formatPrice(item.price)}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      aria-label={`Eliminar ${item.name}`}
                      className="text-[var(--color-text-muted)] hover:text-[var(--color-secondary)] transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                    <div
                      className="flex items-center gap-2 border rounded-[var(--radius-md)] overflow-hidden"
                      style={{ borderColor: 'var(--color-border)' }}
                    >
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        aria-label="Reducir cantidad"
                        className="w-8 h-8 flex items-center justify-center hover:bg-[var(--neutral-100)] transition-colors"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="w-6 text-center text-sm font-semibold tabular-nums">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        aria-label="Aumentar cantidad"
                        className="w-8 h-8 flex items-center justify-center hover:bg-[var(--neutral-100)] transition-colors"
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer con totales */}
        {items.length > 0 && (
          <div
            className="px-5 py-4 border-t"
            style={{ borderColor: 'var(--color-border)' }}
          >
            <div className="flex flex-col gap-2 mb-4 text-sm">
              <div className="flex justify-between">
                <span style={{ color: 'var(--color-text-muted)' }}>Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              {discount > 0 && coupon && (
                <div className="flex justify-between" style={{ color: 'var(--color-secondary)' }}>
                  <span>Cupón ({coupon})</span>
                  <span>-{formatPrice(discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-base font-bold pt-2 border-t" style={{ borderColor: 'var(--color-border)' }}>
                <span>Total</span>
                <span style={{ color: 'var(--color-primary-text)' }}>{formatPrice(total)}</span>
              </div>
              <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                El envío se calcula en el checkout
              </p>
            </div>
            <a
              href="/checkout"
              className="block w-full py-3 text-center font-bold rounded-[var(--radius-md)] transition-colors text-sm"
              style={{ backgroundColor: 'var(--color-secondary)', color: '#fff' }}
              onClick={closeCart}
            >
              Iniciar compra
            </a>
          </div>
        )}
      </aside>
    </>
  )
}
