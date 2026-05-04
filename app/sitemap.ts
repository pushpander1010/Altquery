import { MetadataRoute } from 'next'
import { QUESTIONS } from '@/lib/questions'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://altquery.com'
  
  // Static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
  ]

  // Question pages
  const questionPages = QUESTIONS.map((question) => ({
    url: `${baseUrl}/question/${question.id}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }))

  return [...staticPages, ...questionPages]
}
