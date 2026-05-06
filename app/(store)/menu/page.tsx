import type { Metadata } from 'next'
import { Suspense } from 'react'
import { getCategories } from '@/lib/products'
import { createServiceClient } from '@/lib/supabase/server'
import { TAGS } from '@/lib/cache-tags'
import { unstable_cache } from 'next/cache'
import ProductCard, { type ProductCardData } from '@/components/products/ProductCard'
import CategorySidebar from '@/components/products/CategorySidebar'

export const metadata: Metadata = {
  title: 'Menú — Tanos Burger',
  description: 'Explorá toda nuestra carta: hamburguesas simples, dobles, triples, combos, bebidas y más.',
  openGraph: {
    title: 'Menú — Tanos Burger',
    description: 'Explorá toda nuestra carta: hamburguesas simples, dobles, triples, combos, bebidas y más.',
    images: [{ url: '/hamburguesa-1.jpg', width: 1200, height: 800 }],
  },
}

const TENANT_ID = process.env.NEXT_PUBLIC_TENANT_ID!

const getProductsByCategory = unstable_cache(
  async (categorySlug?: string) => {
    const supabase = createServiceClient()

    const query = supabase
      .from('products')
      .select(`
        id, name, slug, price, featured,
        category_id,
        categories(slug),
        product_images(url, alt, position),
        product_variants(id, name, price_modifier, stock)
      `)
      .eq('tenant_id', TENANT_ID)
      .eq('active', true)
      .order('featured', { ascending: false })
      .order('created_at', { ascending: false })

    const { data } = await query
    if (!data) return []

    if (categorySlug) {
      return data.filter((p) => {
        const cat = Array.isArray(p.categories) ? p.categories[0] : p.categories
        return (cat as { slug: string } | null)?.slug === categorySlug
      })
    }

    return data
  },
  ['products-catalog'],
  { tags: [TAGS.PRODUCTS], revalidate: 3600 }
)

function ProductGridSkeleton() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="rounded-[var(--radius-lg)] overflow-hidden border" style={{ borderColor: 'var(--color-border)' }}>
          <div className="aspect-square skeleton" />
          <div className="p-3 sm:p-4 flex flex-col gap-2">
            <div className="skeleton h-4 rounded w-3/4" />
            <div className="skeleton h-4 rounded w-1/2" />
          </div>
        </div>
      ))}
    </div>
  )
}

async function ProductGrid({ categorySlug }: { categorySlug?: string }) {
  const products = await getProductsByCategory(categorySlug)

  if (!products.length) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center gap-4">
        <span className="text-5xl">🍔</span>
        <p className="font-bold text-lg" style={{ fontFamily: 'var(--font-display)' }}>
          No hay productos en esta categoría
        </p>
        <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
          Probá con otra categoría o volvé al menú completo
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
      {products.map((p) => (
        <ProductCard key={p.id} product={p as ProductCardData} />
      ))}
    </div>
  )
}

interface MenuPageProps {
  searchParams: Promise<{ categoria?: string }>
}

export default async function MenuPage({ searchParams }: MenuPageProps) {
  const { categoria } = await searchParams
  const categories = await getCategories()

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1
        className="text-3xl sm:text-4xl font-extrabold mb-6"
        style={{ fontFamily: 'var(--font-display)' }}
      >
        {categoria
          ? (categories.find((c) => c.slug === categoria)?.name ?? 'Menú')
          : 'Nuestro menú'}
      </h1>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar categorías */}
        <aside className="lg:w-52 shrink-0">
          <Suspense>
            <CategorySidebar categories={categories} />
          </Suspense>
        </aside>

        {/* Grid productos */}
        <div className="flex-1 min-w-0">
          <Suspense fallback={<ProductGridSkeleton />}>
            <ProductGrid categorySlug={categoria} />
          </Suspense>
        </div>
      </div>
    </div>
  )
}
