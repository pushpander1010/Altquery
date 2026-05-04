import { Shield, Mail, Database, Cookie, Eye, Lock } from 'lucide-react'
import Link from 'next/link'

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 gradient-text">Privacy Policy</h1>
        <p className="text-slate-400">Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
      </div>

      <div className="space-y-8">
        {/* Introduction */}
        <section className="card">
          <div className="flex items-start gap-4 mb-4">
            <Shield className="w-6 h-6 text-indigo-400 flex-shrink-0 mt-1" />
            <div>
              <h2 className="text-2xl font-bold mb-4">Your Privacy Matters</h2>
              <p className="text-slate-300 leading-relaxed">
                At AltQuery, we take your privacy seriously. This policy explains what data we collect, 
                how we use it, and your rights regarding your information. We believe in transparency and 
                keeping things simple.
              </p>
            </div>
          </div>
        </section>

        {/* Data We Collect */}
        <section className="card">
          <div className="flex items-start gap-4 mb-4">
            <Database className="w-6 h-6 text-purple-400 flex-shrink-0 mt-1" />
            <div>
              <h2 className="text-2xl font-bold mb-4">Data We Collect</h2>
              
              <h3 className="text-xl font-semibold mb-3 text-indigo-400">What We DO Collect:</h3>
              <ul className="space-y-3 text-slate-300 mb-6">
                <li className="flex gap-2">
                  <span className="text-indigo-400">•</span>
                  <span><strong>Analytics Data:</strong> Page views, time on site, and navigation patterns through Google Analytics (if enabled). This helps us understand how people use AltQuery and improve the platform.</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-indigo-400">•</span>
                  <span><strong>AI Assistant Queries:</strong> When you use the AI assistant, we send your question and the current SQL problem context to Together AI for processing. These are not stored permanently.</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-indigo-400">•</span>
                  <span><strong>Technical Data:</strong> Browser type, device type, and IP address for security and performance monitoring.</span>
                </li>
              </ul>

              <h3 className="text-xl font-semibold mb-3 text-emerald-400">What We DON'T Collect:</h3>
              <ul className="space-y-3 text-slate-300">
                <li className="flex gap-2">
                  <span className="text-emerald-400">✓</span>
                  <span><strong>No Personal Information:</strong> We don't require login, so we don't collect names, emails, or passwords.</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-emerald-400">✓</span>
                  <span><strong>No SQL Queries:</strong> Your SQL queries run entirely in your browser. We never see or store them.</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-emerald-400">✓</span>
                  <span><strong>No Progress Tracking:</strong> We don't track which questions you've completed or your performance.</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Cookies */}
        <section className="card">
          <div className="flex items-start gap-4 mb-4">
            <Cookie className="w-6 h-6 text-amber-400 flex-shrink-0 mt-1" />
            <div>
              <h2 className="text-2xl font-bold mb-4">Cookies & Local Storage</h2>
              <p className="text-slate-300 leading-relaxed mb-4">
                We use minimal cookies and browser storage:
              </p>
              <ul className="space-y-3 text-slate-300">
                <li className="flex gap-2">
                  <span className="text-amber-400">•</span>
                  <span><strong>Analytics Cookies:</strong> Google Analytics uses cookies to track usage patterns (if enabled).</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-amber-400">•</span>
                  <span><strong>Local Storage:</strong> We may use browser local storage to remember your preferences (like theme settings) - this data never leaves your device.</span>
                </li>
              </ul>
              <p className="text-slate-400 text-sm mt-4">
                You can disable cookies in your browser settings, though this may affect some functionality.
              </p>
            </div>
          </div>
        </section>

        {/* Third-Party Services */}
        <section className="card">
          <div className="flex items-start gap-4 mb-4">
            <Eye className="w-6 h-6 text-cyan-400 flex-shrink-0 mt-1" />
            <div>
              <h2 className="text-2xl font-bold mb-4">Third-Party Services</h2>
              <p className="text-slate-300 leading-relaxed mb-4">
                We use the following third-party services:
              </p>
              <div className="space-y-4">
                <div className="bg-slate-800/50 rounded-lg p-4">
                  <h3 className="font-semibold mb-2 text-indigo-400">Google Analytics</h3>
                  <p className="text-slate-300 text-sm">
                    Tracks anonymous usage statistics. View their{' '}
                    <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:text-indigo-300 underline">
                      privacy policy
                    </a>.
                  </p>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-4">
                  <h3 className="font-semibold mb-2 text-purple-400">Together AI</h3>
                  <p className="text-slate-300 text-sm">
                    Powers the AI assistant. Your questions are processed but not stored. View their{' '}
                    <a href="https://www.together.ai/privacy" target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:text-purple-300 underline">
                      privacy policy
                    </a>.
                  </p>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-4">
                  <h3 className="font-semibold mb-2 text-amber-400">Google AdSense (if enabled)</h3>
                  <p className="text-slate-300 text-sm">
                    Displays ads to support the platform. View their{' '}
                    <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-amber-400 hover:text-amber-300 underline">
                      privacy policy
                    </a>.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Your Rights */}
        <section className="card">
          <div className="flex items-start gap-4 mb-4">
            <Lock className="w-6 h-6 text-rose-400 flex-shrink-0 mt-1" />
            <div>
              <h2 className="text-2xl font-bold mb-4">Your Rights</h2>
              <p className="text-slate-300 leading-relaxed mb-4">
                Since we don't collect personal information, there's not much to manage. However, you have the right to:
              </p>
              <ul className="space-y-3 text-slate-300">
                <li className="flex gap-2">
                  <span className="text-rose-400">•</span>
                  <span><strong>Opt Out of Analytics:</strong> Use browser extensions or settings to block Google Analytics.</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-rose-400">•</span>
                  <span><strong>Clear Local Data:</strong> Clear your browser's local storage and cookies at any time.</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-rose-400">•</span>
                  <span><strong>Use Ad Blockers:</strong> Block ads if you prefer (though ads help keep AltQuery free).</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Data Security */}
        <section className="card">
          <h2 className="text-2xl font-bold mb-4">Data Security</h2>
          <p className="text-slate-300 leading-relaxed mb-4">
            We take security seriously:
          </p>
          <ul className="space-y-2 text-slate-300">
            <li className="flex gap-2">
              <span className="text-indigo-400">✓</span>
              <span>All connections use HTTPS encryption</span>
            </li>
            <li className="flex gap-2">
              <span className="text-indigo-400">✓</span>
              <span>SQL queries run entirely in your browser - never sent to our servers</span>
            </li>
            <li className="flex gap-2">
              <span className="text-indigo-400">✓</span>
              <span>No user accounts means no password breaches</span>
            </li>
            <li className="flex gap-2">
              <span className="text-indigo-400">✓</span>
              <span>Minimal data collection reduces risk</span>
            </li>
          </ul>
        </section>

        {/* Children's Privacy */}
        <section className="card">
          <h2 className="text-2xl font-bold mb-4">Children's Privacy</h2>
          <p className="text-slate-300 leading-relaxed">
            AltQuery is safe for all ages. We don't knowingly collect personal information from anyone, 
            including children under 13. Since we don't require accounts or collect personal data, 
            children can use the platform safely under parental supervision.
          </p>
        </section>

        {/* Changes to Policy */}
        <section className="card">
          <h2 className="text-2xl font-bold mb-4">Changes to This Policy</h2>
          <p className="text-slate-300 leading-relaxed">
            We may update this privacy policy from time to time. We'll update the "Last updated" date 
            at the top of this page. Significant changes will be announced on the homepage.
          </p>
        </section>

        {/* Contact */}
        <section className="card bg-gradient-to-br from-indigo-900/20 to-purple-900/20 border-indigo-800/50">
          <div className="flex items-start gap-4">
            <Mail className="w-6 h-6 text-indigo-400 flex-shrink-0 mt-1" />
            <div>
              <h2 className="text-2xl font-bold mb-4">Questions?</h2>
              <p className="text-slate-300 leading-relaxed mb-4">
                If you have any questions about this privacy policy or how we handle data, please contact us.
              </p>
              <p className="text-slate-400 text-sm">
                Note: Since we don't collect personal information, there's usually nothing to delete or modify. 
                But we're happy to answer any questions!
              </p>
            </div>
          </div>
        </section>

        {/* Back to Home */}
        <div className="text-center pt-8">
          <Link href="/" className="btn-primary inline-flex items-center gap-2">
            Back to Questions
          </Link>
        </div>
      </div>
    </div>
  )
}
