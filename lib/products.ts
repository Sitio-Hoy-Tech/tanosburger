import { unstable_cache } from 'next/cache'
import { TAGS } from '@/lib/cache-tags'
import { createServiceClient } from '@/lib/supabase/server'

const TENANT_ID = process.env.NEXT_PUBLIC_TENANT_ID!

export const getFeaturedProducts = unstable_cache(
  async () => {
    const supabase = createServiceClient()
    const { data } = await supabase
      .from('products')
      .select(`
        id, name, slug, description, price,
        product_images(url, alt, position),
        product_variants(id, name, price_modifier, stock)
      `)
      .eq('tenant_id', TENANT_ID)
      .eq('featured', true)
      .eq('active', true)
      .order('created_at', { ascending: false })
      .limit(4)

    return data ?? []
  },
  ['featured-products'],
  { tags: [TAGS.PRODUCTS], revalidate: 3600 }
)

export const getCategories = unstable_cache(
  async () => {
    const supabase = createServiceClient()
    const { data } = await supabase
      .from('categories')
      .select('id, name, slug, position')
      .eq('tenant_id', TENANT_ID)
      .eq('active', true)
      .order('position', { ascending: true })

    return data ?? []
  },
  ['categories'],
  { tags: [TAGS.CATEGORIES], revalidate: 3600 }
)

export const getProducts = unstable_cache(
  async (categorySlug?: string) => {
    const supabase = createServiceClient()
    let query = supabase
      .from('products')
      .select(`
        id, name, slug, price, featured,
        categories!inner(slug),
        product_images(url, alt, position),
        product_variants(id, name, price_modifier, stock)
      `)
      .eq('tenant_id', TENANT_ID)
      .eq('active', true)
      .order('created_at', { ascending: false })

    if (categorySlug) {
      query = query.eq('categories.slug', categorySlug)
    }

    const { data } = await query
    return data ?? []
  },
  ['products'],
  { tags: [TAGS.PRODUCTS], revalidate: 3600 }
)

export const getProductBySlug = unstable_cache(
  async (slug: string) => {
    const supabase = createServiceClient()
    const { data } = await supabase
      .from('products')
      .select(`
        id, name, slug, description, price, featured,
        category_id,
        categories(id, name, slug),
        product_images(url, alt, position),
        product_variants(id, name, price_modifier, stock)
      `)
      .eq('tenant_id', TENANT_ID)
      .eq('slug', slug)
      .eq('active', true)
      .single()

    return data ?? null
  },
  ['product'],
  { tags: [TAGS.PRODUCTS], revalidate: 3600 }
)
