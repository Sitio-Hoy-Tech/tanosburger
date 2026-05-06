import type { Metadata } from 'next'
import { Bricolage_Grotesque, DM_Sans } from 'next/font/google'
import '@/styles/tokens.css'
import './globals.css'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import WhatsAppButton from '@/components/layout/WhatsAppButton'
import CartSidebar from '@/components/cart/CartSidebar'

const display = Bricolage_Grotesque({
  subsets: ['latin'],
  variable: '--font-display',
  weight: ['400', '600', '700', '800'],
})

const body = DM_Sans({
  subsets: ['latin'],
  variable: '--font-body',
  weight: ['400', '500', '600'],
})

const BASE_URL = process.env.NEXT_PUBLIC_URL ?? 'https://tanosburger.com.ar'

export const metadata: Metadata = {
  title: {
    template: '%s — Tanos Burger',
    default: 'Tanos Burger — Hamburguesas con sabor único',
  },
  description: 'Las mejores hamburguesas. Delivery rápido o retiro en local. Pagá con tarjeta.',
  metadataBase: new URL(BASE_URL),
  openGraph: {
    siteName: 'Tanos Burger',
    locale: 'es_AR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
  },
}

const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Tanos Burger',
  url: BASE_URL,
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: `${BASE_URL}/menu?q={search_term_string}`,
    },
    'query-input': 'required name=search_term_string',
  },
}

const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FoodEstablishment',
  name: 'Tanos Burger',
  url: BASE_URL,
  logo: `${BASE_URL}/logo.png`,
  telephone: '+543329404361',
  email: 'contacto@tanosburger.com.ar',
  servesCuisine: 'Hamburguesas',
  hasMap: 'https://maps.google.com',
  sameAs: ['https://instagram.com/tanosburgers', 'https://wa.me/543329404361'],
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const umamiUrl = process.env.NEXT_PUBLIC_UMAMI_URL
  const umamiId = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID

  return (
    <html lang="es-AR" className={`${display.variable} ${body.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-[var(--color-bg)] text-[var(--color-text)]">
        {umamiUrl && umamiId && (
          <script
            defer
            src={`${umamiUrl}/script.js`}
            data-website-id={umamiId}
          />
        )}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <Header />
        <CartSidebar />
        <main className="flex-1">{children}</main>
        <WhatsAppButton />
        <Footer />
      </body>
    </html>
  )
}
