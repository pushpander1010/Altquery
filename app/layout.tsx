import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Link from 'next/link'
import { Code2 } from 'lucide-react'
import { defaultMetadata } from './metadata'
import Script from 'next/script'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  ...defaultMetadata,
  alternates: {
    canonical: 'https://www.altquery.com',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* Google Analytics - Replace with your GA4 ID */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-XXXXXXXXXX');
          `}
        </Script>
        
        {/* Google AdSense - Replace with your publisher ID */}
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </head>
      <body className={inter.className}>
        <header className="sticky top-0 z-50 glass border-b border-slate-800">
          <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <Code2 className="w-8 h-8 text-indigo-500" />
              <span className="text-2xl font-bold gradient-text">AltQuery</span>
            </Link>
            <nav className="flex items-center gap-6">
              <Link href="/" className="text-slate-300 hover:text-white transition-colors">
                Questions
              </Link>
              <Link href="/topics/joins" className="text-slate-300 hover:text-white transition-colors">
                Topics
              </Link>
              <Link href="/about" className="text-slate-300 hover:text-white transition-colors">
                About
              </Link>
            </nav>
          </div>
        </header>
        <main className="min-h-screen">
          {children}
        </main>
        <footer className="border-t border-slate-800 py-8 mt-20">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid md:grid-cols-4 gap-8 mb-8">
              <div>
                <h3 className="font-bold text-white mb-4">AltQuery</h3>
                <p className="text-slate-400 text-sm">
                  Master SQL with 1050+ interactive practice questions. Free forever.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-white mb-4">Topics</h4>
                <ul className="space-y-2 text-sm text-slate-400">
                  <li><Link href="/topics/SELECT+Basics" className="hover:text-white">SELECT Basics</Link></li>
                  <li><Link href="/topics/JOINs" className="hover:text-white">JOINs</Link></li>
                  <li><Link href="/topics/Window+Functions" className="hover:text-white">Window Functions</Link></li>
                  <li><Link href="/topics/CTEs" className="hover:text-white">CTEs</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-white mb-4">Difficulty</h4>
                <ul className="space-y-2 text-sm text-slate-400">
                  <li><Link href="/?difficulty=easy" className="hover:text-white">Easy Questions</Link></li>
                  <li><Link href="/?difficulty=medium" className="hover:text-white">Medium Questions</Link></li>
                  <li><Link href="/?difficulty=hard" className="hover:text-white">Hard Questions</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-white mb-4">Resources</h4>
                <ul className="space-y-2 text-sm text-slate-400">
                  <li><Link href="/about" className="hover:text-white">About</Link></li>
                  <li><Link href="/contact" className="hover:text-white">Contact</Link></li>
                  <li><Link href="/privacy" className="hover:text-white">Privacy Policy</Link></li>
                  <li><Link href="/terms" className="hover:text-white">Terms of Service</Link></li>
                </ul>
              </div>
            </div>
            <div className="text-center text-slate-500 text-sm border-t border-slate-800 pt-8">
              <p>© {new Date().getFullYear()} AltQuery. Practice SQL for free. No login required.</p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  )
}
