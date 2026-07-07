import { MetadataRoute } from 'next'
import { QUESTIONS, TOPICS } from '@/lib/questions'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://www.altquery.com'
  
  const staticPages = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'daily' as const, priority: 1 },
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.8 },
    { url: `${baseUrl}/privacy`, lastModified: new Date(), changeFrequency: 'yearly' as const, priority: 0.3 },
    { url: `${baseUrl}/terms`, lastModified: new Date(), changeFrequency: 'yearly' as const, priority: 0.3 },
    { url: `${baseUrl}/contact`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.7 },
  ]

  const topicPages = TOPICS.map((topic) => ({
    url: `${baseUrl}/topics/${encodeURIComponent(topic)}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }))

  const questionPages = QUESTIONS.map((question) => ({
    url: `${baseUrl}/question/${question.id}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }))

  return [...staticPages, ...topicPages, ...questionPages]
}
