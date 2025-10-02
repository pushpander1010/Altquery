import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'AltQuery - Find Better Alternatives',
    short_name: 'AltQuery',
    description: 'Discover the best alternatives to popular software, tools, and services. Compare features, pricing, and reviews.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#4F46E5',
    icons: [
      {
        src: '/android-chrome-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/android-chrome-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
    categories: ['productivity', 'utilities', 'business'],
    lang: 'en',
    orientation: 'portrait-primary',
    scope: '/',
  }
}