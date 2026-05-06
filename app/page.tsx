import type { Metadata } from 'next'
import Hero from '@/components/home/Hero'
import CategoryChips from '@/components/home/CategoryChips'
import FeaturedProducts from '@/components/home/FeaturedProducts'
import TrustBadges from '@/components/home/TrustBadges'
import WhatsAppCTA from '@/components/home/WhatsAppCTA'
import { getFeaturedProducts, getCategories } from '@/lib/products'

export const metadata: Metadata = {
  title: 'Tanos Burger — Hamburguesas con sabor único | Delivery y retiro',
  description:
    'Las mejores hamburguesas de la zona. Pedí online, pagá con tarjeta. Delivery rápido o retiro en local.',
  openGraph: {
    title: 'Tanos Burger — Hamburguesas con sabor único',
    description: 'Delivery rápido o retiro en local. Pagá con tarjeta.',
    images: [{ url: '/hamburguesa-1.jpg', width: 1200, height: 800 }],
  },
}

const schemaOrg = {
  '@context': 'https://schema.org',
  '@type': 'Restaurant',
  name: 'Tanos Burger',
  servesCuisine: 'Hamburgers',
  priceRange: '$$',
  telephone: '+543329404361',
  email: 'contacto@tanosburger.com.ar',
  url: 'https://tanosburger.com.ar',
  sameAs: ['https://instagram.com/tanosburgers'],
  hasMenu: 'https://tanosburger.com.ar/menu',
  acceptsReservations: false,
}

export default async function HomePage() {
  const [featured, categories] = await Promise.all([
    getFeaturedProducts(),
    getCategories(),
  ])

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaOrg) }}
      />
      <Hero />
      <CategoryChips categories={categories} />
      <FeaturedProducts products={featured as Parameters<typeof FeaturedProducts>[0]['products']} />
      <TrustBadges />
      <WhatsAppCTA />
    </>
  )
}
