import { FileText, AlertTriangle, Scale, Ban, Shield, Mail } from 'lucide-react'
import Link from 'next/link'

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 gradient-text">Terms of Service</h1>
        <p className="text-slate-400">Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
      </div>

      <div className="space-y-8">
        {/* Introduction */}
        <section className="card">
          <div className="flex items-start gap-4 mb-4">
            <FileText className="w-6 h-6 text-indigo-400 flex-shrink-0 mt-1" />
            <div>
              <h2 className="text-2xl font-bold mb-4">Agreement to Terms</h2>
              <p className="text-slate-300 leading-relaxed">
                By accessing and using AltQuery, you agree to be bound by these Terms of Service. 
                If you don't agree with any part of these terms, please don't use our platform.
              </p>
            </div>
          </div>
        </section>

        {/* Use of Service */}
        <section className="card">
          <div className="flex items-start gap-4 mb-4">
            <Shield className="w-6 h-6 text-emerald-400 flex-shrink-0 mt-1" />
            <div>
              <h2 className="text-2xl font-bold mb-4">Use of Service</h2>
              
              <h3 className="text-xl font-semibold mb-3 text-emerald-400">You May:</h3>
              <ul className="space-y-2 text-slate-300 mb-6">
                <li className="flex gap-2">
                  <span className="text-emerald-400">✓</span>
                  <span>Use AltQuery for free to practice SQL</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-emerald-400">✓</span>
                  <span>Access all 1050+ questions without creating an account</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-emerald-400">✓</span>
                  <span>Use the AI assistant for learning purposes</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-emerald-400">✓</span>
                  <span>Share links to AltQuery with others</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-emerald-400">✓</span>
                  <span>Use AltQuery for educational or interview preparation</span>
                </li>
              </ul>

              <h3 className="text-xl font-semibold mb-3 text-red-400">You May NOT:</h3>
              <ul className="space-y-2 text-slate-300">
                <li className="flex gap-2">
                  <span className="text-red-400">✗</span>
                  <span>Scrape, copy, or redistribute our question database</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-red-400">✗</span>
                  <span>Attempt to hack, disrupt, or overload our servers</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-red-400">✗</span>
                  <span>Use automated bots or scripts to abuse the AI assistant</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-red-400">✗</span>
                  <span>Claim ownership of AltQuery content or questions</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-red-400">✗</span>
                  <span>Use AltQuery for any illegal or harmful purposes</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Intellectual Property */}
        <section className="card">
          <div className="flex items-start gap-4 mb-4">
            <Scale className="w-6 h-6 text-purple-400 flex-shrink-0 mt-1" />
            <div>
              <h2 className="text-2xl font-bold mb-4">Intellectual Property</h2>
              <p className="text-slate-300 leading-relaxed mb-4">
                All content on AltQuery, including but not limited to:
              </p>
              <ul className="space-y-2 text-slate-300 mb-4">
                <li className="flex gap-2">
                  <span className="text-purple-400">•</span>
                  <span>SQL questions and their descriptions</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-purple-400">•</span>
                  <span>Database schemas and sample data</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-purple-400">•</span>
                  <span>Website design and code</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-purple-400">•</span>
                  <span>Logos and branding</span>
                </li>
              </ul>
              <p className="text-slate-300 leading-relaxed">
                ...is owned by AltQuery and protected by copyright laws. You may not reproduce, 
                distribute, or create derivative works without explicit permission.
              </p>
              <div className="mt-4 p-4 bg-indigo-900/20 border border-indigo-800 rounded-lg">
                <p className="text-sm text-indigo-300">
                  <strong>Exception:</strong> You may share individual questions or screenshots for educational 
                  purposes, as long as you credit AltQuery and link back to our site.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* User Content */}
        <section className="card">
          <h2 className="text-2xl font-bold mb-4">User-Generated Content</h2>
          <p className="text-slate-300 leading-relaxed mb-4">
            When you use the AI assistant:
          </p>
          <ul className="space-y-2 text-slate-300">
            <li className="flex gap-2">
              <span className="text-indigo-400">•</span>
              <span>Your questions are sent to Together AI for processing</span>
            </li>
            <li className="flex gap-2">
              <span className="text-indigo-400">•</span>
              <span>We don't store your conversations permanently</span>
            </li>
            <li className="flex gap-2">
              <span className="text-indigo-400">•</span>
              <span>You retain ownership of your questions and queries</span>
            </li>
            <li className="flex gap-2">
              <span className="text-indigo-400">•</span>
              <span>Don't share sensitive or personal information with the AI</span>
            </li>
          </ul>
        </section>

        {/* Disclaimer */}
        <section className="card bg-amber-900/10 border-amber-800/50">
          <div className="flex items-start gap-4 mb-4">
            <AlertTriangle className="w-6 h-6 text-amber-400 flex-shrink-0 mt-1" />
            <div>
              <h2 className="text-2xl font-bold mb-4">Disclaimer of Warranties</h2>
              <p className="text-slate-300 leading-relaxed mb-4">
                AltQuery is provided "as is" without any warranties, express or implied. We make no guarantees about:
              </p>
              <ul className="space-y-2 text-slate-300">
                <li className="flex gap-2">
                  <span className="text-amber-400">•</span>
                  <span><strong>Accuracy:</strong> While we strive for accuracy, SQL questions may contain errors</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-amber-400">•</span>
                  <span><strong>Availability:</strong> The service may be interrupted for maintenance or technical issues</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-amber-400">•</span>
                  <span><strong>AI Responses:</strong> AI assistant responses may not always be correct or helpful</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-amber-400">•</span>
                  <span><strong>Fitness:</strong> We don't guarantee AltQuery will meet your specific needs</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Limitation of Liability */}
        <section className="card">
          <h2 className="text-2xl font-bold mb-4">Limitation of Liability</h2>
          <p className="text-slate-300 leading-relaxed mb-4">
            To the maximum extent permitted by law, AltQuery and its creators shall not be liable for:
          </p>
          <ul className="space-y-2 text-slate-300">
            <li className="flex gap-2">
              <span className="text-slate-500">•</span>
              <span>Any indirect, incidental, or consequential damages</span>
            </li>
            <li className="flex gap-2">
              <span className="text-slate-500">•</span>
              <span>Loss of data, profits, or opportunities</span>
            </li>
            <li className="flex gap-2">
              <span className="text-slate-500">•</span>
              <span>Damages resulting from use or inability to use the service</span>
            </li>
            <li className="flex gap-2">
              <span className="text-slate-500">•</span>
              <span>Errors in questions or AI responses</span>
            </li>
          </ul>
          <p className="text-slate-400 text-sm mt-4">
            Since AltQuery is free, our liability is limited to the amount you paid (which is $0).
          </p>
        </section>

        {/* Third-Party Links */}
        <section className="card">
          <h2 className="text-2xl font-bold mb-4">Third-Party Services</h2>
          <p className="text-slate-300 leading-relaxed mb-4">
            AltQuery uses third-party services (Google Analytics, Together AI, Google AdSense). 
            These services have their own terms and privacy policies. We're not responsible for 
            their practices or content.
          </p>
          <p className="text-slate-400 text-sm">
            By using AltQuery, you also agree to comply with the terms of these third-party services.
          </p>
        </section>

        {/* Termination */}
        <section className="card">
          <div className="flex items-start gap-4 mb-4">
            <Ban className="w-6 h-6 text-red-400 flex-shrink-0 mt-1" />
            <div>
              <h2 className="text-2xl font-bold mb-4">Termination</h2>
              <p className="text-slate-300 leading-relaxed mb-4">
                We reserve the right to:
              </p>
              <ul className="space-y-2 text-slate-300">
                <li className="flex gap-2">
                  <span className="text-red-400">•</span>
                  <span>Block access to users who violate these terms</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-red-400">•</span>
                  <span>Modify or discontinue the service at any time</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-red-400">•</span>
                  <span>Remove or modify content without notice</span>
                </li>
              </ul>
              <p className="text-slate-400 text-sm mt-4">
                Since there are no user accounts, "termination" typically means IP-based blocking for abuse.
              </p>
            </div>
          </div>
        </section>

        {/* Changes to Terms */}
        <section className="card">
          <h2 className="text-2xl font-bold mb-4">Changes to Terms</h2>
          <p className="text-slate-300 leading-relaxed">
            We may update these terms from time to time. Significant changes will be announced on the homepage. 
            Continued use of AltQuery after changes constitutes acceptance of the new terms.
          </p>
        </section>

        {/* Governing Law */}
        <section className="card">
          <h2 className="text-2xl font-bold mb-4">Governing Law</h2>
          <p className="text-slate-300 leading-relaxed">
            These terms are governed by and construed in accordance with applicable laws. 
            Any disputes shall be resolved in the appropriate courts.
          </p>
        </section>

        {/* Contact */}
        <section className="card bg-gradient-to-br from-indigo-900/20 to-purple-900/20 border-indigo-800/50">
          <div className="flex items-start gap-4">
            <Mail className="w-6 h-6 text-indigo-400 flex-shrink-0 mt-1" />
            <div>
              <h2 className="text-2xl font-bold mb-4">Questions About These Terms?</h2>
              <p className="text-slate-300 leading-relaxed mb-4">
                If you have questions about these Terms of Service, please contact us.
              </p>
              <p className="text-slate-400 text-sm">
                We're here to help and want to make sure you have a great experience using AltQuery!
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
