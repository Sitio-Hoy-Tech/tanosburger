import { MetadataRoute } from 'next'
import { env } from '@/lib/config/env'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/checkout', '/seguimiento', '/api/'],
      },
    ],
    sitemap: `${env.NEXT_PUBLIC_URL}/sitemap.xml`,
  }
}
