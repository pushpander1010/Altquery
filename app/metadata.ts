import { Metadata } from 'next';

export const siteConfig = {
  name: 'AltQuery - SQL Practice Platform',
  description: '1050+ interactive SQL practice questions. Master SQL with hands-on exercises covering SELECT, JOINs, Window Functions, CTEs, and more. No login required. AI assistant included.',
  url: 'https://altquery.com',
  ogImage: 'https://altquery.com/og-image.png',
  keywords: [
    'SQL practice',
    'SQL tutorial',
    'SQL exercises',
    'SQL questions',
    'SQL interview prep',
    'learn SQL',
    'SQL online',
    'SQL practice problems',
    'SQL JOIN exercises',
    'SQL window functions',
    'SQL CTEs',
    'SQL subqueries',
    'SQL aggregation',
    'SQL filtering',
    'MySQL practice',
    'PostgreSQL practice',
    'SQLite practice',
    'database queries',
    'SQL certification',
    'SQL training'
  ]
};

export const defaultMetadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`
  },
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  authors: [{ name: 'AltQuery' }],
  creator: 'AltQuery',
  publisher: 'AltQuery',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(siteConfig.url),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.name,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
    creator: '@altquery',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
    // yandex: 'your-yandex-verification-code',
    // bing: 'your-bing-verification-code',
  },
};
