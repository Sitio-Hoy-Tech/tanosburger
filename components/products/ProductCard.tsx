import Link from 'next/link'
import Image from 'next/image'

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

export interface ProductCardData {
  id: string
  name: string
  slug: string
  price: number
  featured?: boolean
  product_images: ProductImage[]
  product_variants: ProductVariant[]
}

function formatPrice(n: number) {
  return `$${n.toLocaleString('es-AR', { minimumFractionDigits: 0 })}`
}

export default function ProductCard({ product }: { product: ProductCardData }) {
  const image = product.product_images?.sort((a, b) => a.position - b.position)[0]
  const hasVariants = product.product_variants?.length > 0
  const totalStock = product.product_variants?.reduce((a, v) => a + v.stock, 0) ?? 99
  const outOfStock = product.product_variants?.length > 0 && totalStock === 0

  return (
    <article className="group flex flex-col rounded-[var(--radius-lg)] overflow-hidden border bg-white transition-shadow hover:shadow-[var(--shadow-lg)]" style={{ borderColor: 'var(--color-border)' }}>
      {/* Imagen */}
      <Link href={`/menu/${product.slug}`} className="block aspect-square relative overflow-hidden bg-[var(--color-surface)]" tabIndex={-1} aria-hidden="true">
        {image ? (
          <Image
            src={image.url}
            alt={image.alt ?? product.name}
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1280px) 33vw, 25vw"
            className={`object-cover transition-transform duration-300 group-hover:scale-105 ${outOfStock ? 'opacity-50 grayscale' : ''}`}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-5xl">🍔</div>
        )}
        {product.featured && !outOfStock && (
          <span className="absolute top-2 left-2 text-xs font-bold px-2 py-1 rounded-[var(--radius-full)]" style={{ backgroundColor: 'var(--color-primary)', color: 'var(--color-text)' }}>
            Destacado
          </span>
        )}
        {outOfStock && (
          <span className="absolute top-2 left-2 text-xs font-bold px-2 py-1 rounded-[var(--radius-full)] bg-[var(--neutral-600)] text-white">
            Sin stock
          </span>
        )}
      </Link>

      {/* Info */}
      <div className="flex flex-col gap-2 p-3 sm:p-4 flex-1">
        <Link href={`/menu/${product.slug}`}>
          <h3 className="font-bold text-sm sm:text-base leading-tight hover:text-[var(--color-primary)] transition-colors" style={{ fontFamily: 'var(--font-display)' }}>
            {product.name}
          </h3>
        </Link>

        <div className="flex items-center justify-between mt-auto pt-2 gap-2">
          <span className="font-bold text-base sm:text-lg shrink-0" style={{ color: 'var(--color-primary)' }}>
            {formatPrice(product.price)}
          </span>
          {outOfStock ? (
            <span className="text-xs text-[var(--color-text-muted)]">Sin stock</span>
          ) : (
            <Link
              href={`/menu/${product.slug}`}
              className="text-xs sm:text-sm font-semibold px-3 py-2 rounded-[var(--radius-md)] transition-all hover:scale-105 active:scale-95 min-h-[36px] flex items-center whitespace-nowrap"
              style={{ backgroundColor: 'var(--color-primary)', color: 'var(--color-text)' }}
            >
              {hasVariants ? 'Elegir' : 'Agregar'}
            </Link>
          )}
        </div>
      </div>
    </article>
  )
}
