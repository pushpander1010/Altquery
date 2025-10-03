import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/debug',
          '/admin/',
          '/_next/',
          '/setup/'
        ],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: [
          '/api/debug',
          '/admin/',
          '/_next/',
          '/setup/'
        ],
      },
      {
        userAgent: 'Bingbot',
        allow: '/',
        disallow: [
          '/api/debug',
          '/admin/',
          '/_next/',
          '/setup/'
        ],
      }
    ],
    sitemap: 'https://altquery.com/sitemap.xml',
  }
}