import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ChevronRight } from 'lucide-react'
import { getProductBySlug } from '@/lib/products'
import { createServiceClient } from '@/lib/supabase/server'
import { unstable_cache } from 'next/cache'
import { TAGS } from '@/lib/cache-tags'
import AddToCartButton from '@/components/products/AddToCartButton'
import ProductCard from '@/components/products/ProductCard'
import ProductViewTracker from '@/components/products/ProductViewTracker'

const TENANT_ID = process.env.NEXT_PUBLIC_TENANT_ID!

interface ProductImage { url: string; alt: string | null; position: number }
interface ProductVariant { id: string; name: string; price_modifier: number; stock: number }
interface Category { name: string; slug: string }

const getRelatedProducts = unstable_cache(
  async (categoryId: string, excludeSlug: string) => {
    const supabase = createServiceClient()
    const { data } = await supabase
      .from('products')
      .select(`id, name, slug, price, featured, product_images(url, alt, position), product_variants(id, name, price_modifier, stock)`)
      .eq('tenant_id', TENANT_ID)
      .eq('category_id', categoryId)
      .eq('active', true)
      .neq('slug', excludeSlug)
      .limit(4)
    return data ?? []
  },
  ['related-products'],
  { tags: [TAGS.PRODUCTS], revalidate: 3600 }
)

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const product = await getProductBySlug(slug)
  if (!product) return { title: 'Producto no encontrado — Tanos Burger' }

  const image = (product.product_images as ProductImage[])?.sort((a, b) => a.position - b.position)[0]
  const price = Number(product.price).toLocaleString('es-AR')

  return {
    title: `${product.name} — Tanos Burger`,
    description: product.description ?? `${product.name} por $${price}. Pedí online con delivery o retiro en local.`,
    openGraph: {
      title: product.name,
      description: product.description ?? `$${price}`,
      images: image ? [{ url: image.url }] : [],
    },
  }
}

export async function generateStaticParams() {
  const supabase = createServiceClient()
  const { data } = await supabase
    .from('products')
    .select('slug')
    .eq('tenant_id', TENANT_ID)
    .eq('active', true)
  return (data ?? []).map((p) => ({ slug: p.slug }))
}

function formatPrice(n: number) {
  return `$${n.toLocaleString('es-AR', { minimumFractionDigits: 0 })}`
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const product = await getProductBySlug(slug)

  if (!product) notFound()

  const images = (product.product_images as ProductImage[])?.sort((a, b) => a.position - b.position) ?? []
  const variants = (product.product_variants as ProductVariant[]) ?? []
  const mainImage = images[0]
  const category = (Array.isArray(product.categories) ? product.categories[0] : product.categories) as Category | null
  const related = product.category_id
    ? await getRelatedProducts(product.category_id, slug)
    : []

  const BASE_URL = process.env.NEXT_PUBLIC_URL ?? 'https://tanosburger.com.ar'

  const schemaOrg = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: mainImage?.url,
    offers: {
      '@type': 'Offer',
      price: product.price,
      priceCurrency: 'ARS',
      availability:
        variants.length === 0 || variants.some((v) => v.stock > 0)
          ? 'https://schema.org/InStock'
          : 'https://schema.org/OutOfStock',
    },
  }

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Inicio', item: BASE_URL },
      { '@type': 'ListItem', position: 2, name: 'Menú', item: `${BASE_URL}/menu` },
      ...(category
        ? [{ '@type': 'ListItem', position: 3, name: category.name, item: `${BASE_URL}/menu?categoria=${category.slug}` },
           { '@type': 'ListItem', position: 4, name: product.name, item: `${BASE_URL}/menu/${slug}` }]
        : [{ '@type': 'ListItem', position: 3, name: product.name, item: `${BASE_URL}/menu/${slug}` }]),
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaOrg) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <ProductViewTracker productId={product.id} name={product.name} price={Number(product.price)} />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1 text-xs mb-6" style={{ color: 'var(--color-text-muted)' }} aria-label="Breadcrumb">
          <Link href="/" className="hover:text-[var(--color-primary)] transition-colors">Inicio</Link>
          <ChevronRight size={12} />
          <Link href="/menu" className="hover:text-[var(--color-primary)] transition-colors">Menú</Link>
          {category && (
            <>
              <ChevronRight size={12} />
              <Link href={`/menu?categoria=${category.slug}`} className="hover:text-[var(--color-primary)] transition-colors">
                {category.name}
              </Link>
            </>
          )}
          <ChevronRight size={12} />
          <span className="truncate max-w-[120px]">{product.name}</span>
        </nav>

        {/* Layout producto */}
        <div className="flex flex-col lg:flex-row gap-10">
          {/* Imagen */}
          <div className="w-full lg:w-1/2 shrink-0">
            <div className="aspect-square relative rounded-[var(--radius-lg)] overflow-hidden bg-[var(--color-surface)]">
              {mainImage ? (
                <Image
                  src={mainImage.url}
                  alt={mainImage.alt ?? product.name}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-8xl">🍔</div>
              )}
            </div>
            {/* Galería extra */}
            {images.length > 1 && (
              <div className="flex gap-2 mt-3">
                {images.slice(1).map((img, i) => (
                  <div key={i} className="w-20 h-20 relative rounded-[var(--radius-md)] overflow-hidden border" style={{ borderColor: 'var(--color-border)' }}>
                    <Image src={img.url} alt={img.alt ?? ''} fill className="object-cover" sizes="80px" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Detalles */}
          <div className="flex-1 flex flex-col gap-5">
            <div>
              {category && (
                <Link
                  href={`/menu?categoria=${category.slug}`}
                  className="text-xs font-semibold uppercase tracking-wider hover:text-[var(--color-primary)] transition-colors"
                  style={{ color: 'var(--color-text-muted)' }}
                >
                  {category.name}
                </Link>
              )}
              <h1
                className="text-3xl sm:text-4xl font-extrabold mt-1 leading-tight"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                {product.name}
              </h1>
            </div>

            {product.description && (
              <p className="text-base leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>
                {product.description}
              </p>
            )}

            <AddToCartButton
              productId={product.id}
              name={product.name}
              basePrice={Number(product.price)}
              image={mainImage?.url}
              variants={variants}
            />

            {/* Info adicional */}
            <div
              className="flex flex-col gap-2 pt-4 border-t text-sm"
              style={{ borderColor: 'var(--color-border)', color: 'var(--color-text-muted)' }}
            >
              <p>🛵 Delivery a domicilio disponible</p>
              <p>🏪 También podés retirar en el local</p>
              <p>💳 Pagá con tarjeta vía MercadoPago</p>
            </div>
          </div>
        </div>

        {/* Sticky CTA mobile */}
        <div
          className="lg:hidden fixed bottom-0 left-0 right-0 p-4 border-t bg-white z-30"
          style={{ borderColor: 'var(--color-border)' }}
        >
          <div className="flex items-center justify-between gap-3">
            <span className="text-xl font-extrabold" style={{ color: 'var(--color-primary-text)', fontFamily: 'var(--font-display)' }}>
              {formatPrice(Number(product.price))}
            </span>
            <AddToCartButton
              productId={product.id}
              name={product.name}
              basePrice={Number(product.price)}
              image={mainImage?.url}
              variants={variants}
              className="flex-1"
            />
          </div>
        </div>

        {/* Productos relacionados */}
        {related.length > 0 && (
          <section className="mt-16">
            <h2
              className="text-2xl font-extrabold mb-6"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              También te puede gustar
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
              {related.map((p) => (
                <ProductCard key={p.id} product={p as import('@/components/products/ProductCard').ProductCardData} />
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  )
}
