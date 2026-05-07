'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'motion/react'

interface ProductImage {
  url: string
  alt: string | null
  position: number
}

interface ProductVariant {
  id: string
  name: string
  price_modifier: number
  stock: number
}

interface Product {
  id: string
  name: string
  slug: string
  price: number
  product_images: ProductImage[]
  product_variants: ProductVariant[]
}

interface FeaturedProductsProps {
  products: Product[]
}

function formatPrice(n: number) {
  return `$${n.toLocaleString('es-AR', { minimumFractionDigits: 0 })}`
}

function ProductCard({ product }: { product: Product }) {
  const image = product.product_images?.sort((a, b) => a.position - b.position)[0]
  const hasVariants = product.product_variants?.length > 0

  return (
    <article className="group flex flex-col rounded-[var(--radius-lg)] overflow-hidden border bg-white transition-shadow hover:shadow-[var(--shadow-lg)]" style={{ borderColor: 'var(--color-border)' }}>
      {/* Imagen */}
      <Link href={`/menu/${product.slug}`} className="block aspect-square relative overflow-hidden bg-[var(--color-surface)]">
        {image ? (
          <Image
            src={image.url}
            alt={image.alt ?? product.name}
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1280px) 33vw, 25vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-5xl">🍔</div>
        )}
      </Link>

      {/* Info */}
      <div className="flex flex-col gap-2 p-3 sm:p-4 flex-1">
        <Link href={`/menu/${product.slug}`}>
          <h3 className="font-bold text-sm sm:text-base leading-tight hover:text-[var(--color-primary)] transition-colors" style={{ fontFamily: 'var(--font-display)' }}>
            {product.name}
          </h3>
        </Link>
        <div className="flex items-center justify-between mt-auto pt-2">
          <span className="font-bold text-base sm:text-lg" style={{ color: 'var(--color-primary-text)' }}>
            {formatPrice(product.price)}
          </span>
          <Link
            href={`/menu/${product.slug}`}
            className="text-xs sm:text-sm font-semibold px-3 py-2 rounded-[var(--radius-md)] transition-all hover:scale-105 active:scale-95 min-h-[36px] flex items-center"
            style={{ backgroundColor: 'var(--color-primary)', color: 'var(--color-text)' }}
          >
            {hasVariants ? 'Elegir' : 'Agregar'}
          </Link>
        </div>
      </div>
    </article>
  )
}

export default function FeaturedProducts({ products }: FeaturedProductsProps) {
  if (!products.length) return null

  return (
    <section className="py-10 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: 'var(--color-surface)' }}>
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl sm:text-3xl font-extrabold" style={{ fontFamily: 'var(--font-display)' }}>
            Los más pedidos
          </h2>
          <Link
            href="/menu"
            className="text-sm font-semibold hover:underline transition-colors"
            style={{ color: 'var(--color-primary-text)' }}
          >
            Ver todo →
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {products.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.4, delay: i * 0.08, ease: 'easeOut' }}
            >
              <ProductCard product={p} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
