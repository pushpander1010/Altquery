'use client'
import { useState } from 'react'
import Link from 'next/link'
import { TrendingUp, ArrowLeft } from 'lucide-react'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [devLink, setDevLink] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const res = await fetch('/api/auth/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    })
    const data = await res.json().catch(() => ({}))
    setLoading(false)
    setSent(true)
    if (data.resetUrl) setDevLink(data.resetUrl)
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: 'radial-gradient(ellipse at top, #1e1b4b 0%, #0a0a0f 60%)' }}>
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-3">
            <div className="w-10 h-10 rounded-xl bg-violet-600 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold gradient-text">AltQuery</span>
          </div>
        </div>

        <div className="glass rounded-2xl p-8">
          {!sent ? (
            <>
              <h1 className="text-xl font-semibold text-white mb-2">Reset your password</h1>
              <p className="text-slate-400 text-sm mb-6">Enter your email and we'll send you a reset link.</p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm text-slate-400 mb-1.5">Email</label>
                  <input type="email" className="input-field" placeholder="you@example.com"
                    value={email} onChange={e => setEmail(e.target.value)} required />
                </div>
                <button type="submit" disabled={loading} className="btn-primary w-full py-3">
                  {loading ? 'Sending...' : 'Send reset link'}
                </button>
              </form>
            </>
          ) : (
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">✓</span>
              </div>
              <h2 className="text-lg font-semibold text-white mb-2">Check your email</h2>
              <p className="text-slate-400 text-sm mb-4">
                If an account exists for <span className="text-white">{email}</span>, you'll receive a reset link shortly.
              </p>
              {devLink && (
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3 mb-4 text-left">
                  <p className="text-yellow-400 text-xs font-mono break-all">Dev mode: <a href={devLink} className="underline">{devLink}</a></p>
                </div>
              )}
            </div>
          )}

          <Link href="/login" className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-300 mt-6 justify-center">
            <ArrowLeft className="w-4 h-4" /> Back to login
          </Link>
        </div>
      </div>
    </div>
  )
}
