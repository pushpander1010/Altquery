import { MetadataRoute } from 'next'
import alternativesData from '../data/alternatives.json'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://altquery.com'
  
  // Static pages
  const staticPages = [
    '',
    '/search',
    '/categories',
    '/trending',
    '/compare',
    '/quiz',
    '/collections',
    '/daily',
    '/newsletter',
    '/submit',
    '/setup',
  ]

  // Dynamic alternative pages
  const alternativePages = alternativesData.alternatives.map((alt) => ({
    url: `${baseUrl}/alternatives/${alt.id}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  // Static pages with metadata
  const staticSitemapEntries = staticPages.map((page) => ({
    url: `${baseUrl}${page}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: page === '' ? 1 : 0.9,
  }))

  return [
    ...staticSitemapEntries,
    ...alternativePages,
  ]
}