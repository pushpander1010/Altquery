import { notFound } from 'next/navigation'
import { QUESTIONS } from '@/lib/questions'
import QuestionPageClient from '@/components/QuestionPageClient'
import type { Metadata } from 'next'

interface PageProps {
  params: Promise<{ id: string }>
}

export async function generateStaticParams() {
  return QUESTIONS.map((q) => ({ id: q.id }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params
  const question = QUESTIONS.find((q) => q.id === id)
  if (!question) return {}

  const title = `${question.title} — SQL Practice | AltQuery`
  const description = `${question.description} Practice this ${question.difficulty} SQL ${question.topic} question with instant feedback and AI hints.`
  const url = `https://www.altquery.com/question/${question.id}`

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  }
}

export default async function QuestionPage({ params }: PageProps) {
  const { id } = await params
  const question = QUESTIONS.find((q) => q.id === id)
  if (!question) notFound()

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.altquery.com/' },
        { '@type': 'ListItem', position: 2, name: 'Questions', item: 'https://www.altquery.com/' },
        { '@type': 'ListItem', position: 3, name: question.title, item: `https://www.altquery.com/question/${question.id}` },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: question.title,
      applicationCategory: 'DeveloperApplication',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
      operatingSystem: 'Web',
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: `What is ${question.title}?`,
          acceptedAnswer: {
            '@type': 'Answer',
            text: question.description,
          },
        },
        {
          '@type': 'Question',
          name: `What difficulty level is ${question.title}?`,
          acceptedAnswer: {
            '@type': 'Answer',
            text: `This is a ${question.difficulty} level ${question.topic} question.`,
          },
        },
      ],
    },
  ]

  return (
    <>
      {jsonLd.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
      <QuestionPageClient question={question} />
    </>
  )
}
