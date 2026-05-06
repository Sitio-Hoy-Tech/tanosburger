'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface CartItem {
  id: string
  productId: string
  variantId?: string
  name: string
  variantName?: string
  price: number
  quantity: number
  image?: string
}

interface CartStore {
  items: CartItem[]
  isOpen: boolean
  coupon: string | null
  discount: number
  addItem: (item: Omit<CartItem, 'id'>) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  openCart: () => void
  closeCart: () => void
  applyCoupon: (code: string, discount: number) => void
  removeCoupon: () => void
  getTotal: () => number
  getItemCount: () => number
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      coupon: null,
      discount: 0,

      addItem: (item) => {
        set((state) => {
          const key = `${item.productId}-${item.variantId ?? 'base'}`
          const existing = state.items.find(
            (i) => `${i.productId}-${i.variantId ?? 'base'}` === key
          )
          if (existing) {
            return {
              items: state.items.map((i) =>
                `${i.productId}-${i.variantId ?? 'base'}` === key
                  ? { ...i, quantity: i.quantity + item.quantity }
                  : i
              ),
              isOpen: true,
            }
          }
          return {
            items: [...state.items, { ...item, id: key }],
            isOpen: true,
          }
        })
      },

      removeItem: (id) =>
        set((state) => ({ items: state.items.filter((i) => i.id !== id) })),

      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          get().removeItem(id)
          return
        }
        set((state) => ({
          items: state.items.map((i) => (i.id === id ? { ...i, quantity } : i)),
        }))
      },

      clearCart: () => set({ items: [], coupon: null, discount: 0 }),

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),

      applyCoupon: (code, discount) => set({ coupon: code, discount }),
      removeCoupon: () => set({ coupon: null, discount: 0 }),

      getTotal: () => {
        const { items, discount } = get()
        const subtotal = items.reduce((acc, i) => acc + i.price * i.quantity, 0)
        return Math.max(0, subtotal - discount)
      },

      getItemCount: () =>
        get().items.reduce((acc, i) => acc + i.quantity, 0),
    }),
    { name: 'tanosburger-cart' }
  )
)
