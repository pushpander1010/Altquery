import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'AltQuery - Find Better Alternatives',
  description: 'Discover the best alternatives to popular software, tools, and services. Compare features, pricing, and reviews.',
  keywords: 'alternatives, software alternatives, tool alternatives, compare software',
  authors: [{ name: 'AltQuery Team' }],
  creator: 'AltQuery',
  publisher: 'AltQuery',
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
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://altquery.com',
    title: 'AltQuery - Find Better Alternatives',
    description: 'Discover the best alternatives to popular software, tools, and services. Compare features, pricing, and reviews.',
    siteName: 'AltQuery',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'AltQuery - Find Better Alternatives',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AltQuery - Find Better Alternatives',
    description: 'Discover the best alternatives to popular software, tools, and services.',
    images: ['/og-image.png'],
    creator: '@altquery',
  },
  verification: {
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        {/* Favicon and Icons */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        
        {/* Theme Color */}
        <meta name="theme-color" content="#4F46E5" />
        <meta name="msapplication-TileColor" content="#4F46E5" />
        
        {/* Additional SEO */}
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="AltQuery" />
        
        {/* Google AdSense */}
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-YOUR_ACTUAL_PUBLISHER_ID" crossOrigin="anonymous"></script>
        
        {/* Google Analytics */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
        <script dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'GA_MEASUREMENT_ID');
          `
        }} />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  )
}