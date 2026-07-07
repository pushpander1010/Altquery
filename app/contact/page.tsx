import { Mail, MessageSquare, Github, Twitter, Heart } from 'lucide-react'
import Link from 'next/link'
import type { Metadata } from 'next'
import Breadcrumb from '@/components/Breadcrumb'

export const metadata: Metadata = {
  title: 'Contact Us — AltQuery Support',
  description: 'Get in touch with the AltQuery team. Questions, feedback, or partnership inquiries — we respond within 24 hours.',
  alternates: { canonical: 'https://www.altquery.com/contact' },
  openGraph: {
    title: 'Contact Us — AltQuery Support',
    description: 'Get in touch with the AltQuery team for questions, feedback, or partnerships.',
    url: 'https://www.altquery.com/contact',
  },
}

export default function ContactPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Contact', href: '/contact' }]} />
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 gradient-text">Get in Touch</h1>
        <p className="text-xl text-slate-400">
          We'd love to hear from you! Questions, feedback, or just want to say hi?
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-12">
        {/* General Inquiries */}
        <div className="card hover:border-indigo-700 transition-all">
          <div className="flex items-start gap-4 mb-4">
            <div className="p-3 bg-indigo-600/20 rounded-lg">
              <Mail className="w-6 h-6 text-indigo-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold mb-2">General Inquiries</h2>
              <p className="text-slate-400 text-sm mb-4">
                Questions about AltQuery, features, or how to use the platform?
              </p>
              <a 
                href="mailto:hello@altquery.com" 
                className="text-indigo-400 hover:text-indigo-300 transition-colors font-medium"
              >
                hello@altquery.com
              </a>
            </div>
          </div>
        </div>

        {/* Bug Reports */}
        <div className="card hover:border-red-700 transition-all">
          <div className="flex items-start gap-4 mb-4">
            <div className="p-3 bg-red-600/20 rounded-lg">
              <MessageSquare className="w-6 h-6 text-red-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold mb-2">Bug Reports</h2>
              <p className="text-slate-400 text-sm mb-4">
                Found a bug or issue? Let us know so we can fix it!
              </p>
              <a 
                href="mailto:bugs@altquery.com" 
                className="text-red-400 hover:text-red-300 transition-colors font-medium"
              >
                bugs@altquery.com
              </a>
            </div>
          </div>
        </div>

        {/* Feature Requests */}
        <div className="card hover:border-purple-700 transition-all">
          <div className="flex items-start gap-4 mb-4">
            <div className="p-3 bg-purple-600/20 rounded-lg">
              <Heart className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold mb-2">Feature Requests</h2>
              <p className="text-slate-400 text-sm mb-4">
                Have an idea to make AltQuery better? We're all ears!
              </p>
              <a 
                href="mailto:feedback@altquery.com" 
                className="text-purple-400 hover:text-purple-300 transition-colors font-medium"
              >
                feedback@altquery.com
              </a>
            </div>
          </div>
        </div>

        {/* Business Inquiries */}
        <div className="card hover:border-emerald-700 transition-all">
          <div className="flex items-start gap-4 mb-4">
            <div className="p-3 bg-emerald-600/20 rounded-lg">
              <Mail className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold mb-2">Business Inquiries</h2>
              <p className="text-slate-400 text-sm mb-4">
                Partnerships, sponsorships, or business opportunities?
              </p>
              <a 
                href="mailto:business@altquery.com" 
                className="text-emerald-400 hover:text-emerald-300 transition-colors font-medium"
              >
                business@altquery.com
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Social Media (Optional) */}
      <div className="card bg-gradient-to-br from-indigo-900/20 to-purple-900/20 border-indigo-800/50 mb-12">
        <h2 className="text-2xl font-bold mb-6 text-center">Connect With Us</h2>
        <div className="flex justify-center gap-6">
          <a 
            href="https://github.com/altquery" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex flex-col items-center gap-2 p-4 bg-slate-800/50 rounded-lg hover:bg-slate-800 transition-all group"
          >
            <Github className="w-8 h-8 text-slate-400 group-hover:text-white transition-colors" />
            <span className="text-sm text-slate-400 group-hover:text-white transition-colors">GitHub</span>
          </a>
          <a 
            href="https://twitter.com/altquery" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex flex-col items-center gap-2 p-4 bg-slate-800/50 rounded-lg hover:bg-slate-800 transition-all group"
          >
            <Twitter className="w-8 h-8 text-slate-400 group-hover:text-cyan-400 transition-colors" />
            <span className="text-sm text-slate-400 group-hover:text-white transition-colors">Twitter</span>
          </a>
        </div>
        <p className="text-center text-slate-400 text-sm mt-6">
          Follow us for updates, tips, and SQL challenges!
        </p>
      </div>

      {/* FAQ Section */}
      <div className="card mb-12">
        <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-2 text-indigo-400">How quickly will you respond?</h3>
            <p className="text-slate-300">
              We aim to respond to all inquiries within 24-48 hours. Bug reports are prioritized and 
              typically addressed faster.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2 text-indigo-400">Can I contribute questions?</h3>
            <p className="text-slate-300">
              Yes! We're always looking for high-quality SQL questions. Email us at{' '}
              <a href="mailto:contribute@altquery.com" className="text-indigo-400 hover:text-indigo-300">
                contribute@altquery.com
              </a>{' '}
              with your proposed questions.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2 text-indigo-400">Do you offer enterprise solutions?</h3>
            <p className="text-slate-300">
              We're exploring options for teams and organizations. Contact us at{' '}
              <a href="mailto:business@altquery.com" className="text-indigo-400 hover:text-indigo-300">
                business@altquery.com
              </a>{' '}
              to discuss your needs.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2 text-indigo-400">Can I use AltQuery in my classroom?</h3>
            <p className="text-slate-300">
              Absolutely! AltQuery is perfect for teaching SQL. It's free, requires no setup, and 
              students can practice at their own pace. Email us for educator resources.
            </p>
          </div>
        </div>
      </div>

      {/* Response Time Notice */}
      <div className="card bg-amber-900/10 border-amber-800/50 mb-12">
        <p className="text-slate-300 text-center">
          <strong className="text-amber-400">Note:</strong> AltQuery is maintained by a small team. 
          We read every message but may not be able to respond to all inquiries immediately. 
          Thank you for your patience! 🙏
        </p>
      </div>

      {/* Back to Home */}
      <div className="text-center">
        <Link href="/" className="btn-primary inline-flex items-center gap-2">
          Back to Questions
        </Link>
      </div>
    </div>
  )
}
