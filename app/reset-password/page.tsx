'use client'
import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { TrendingUp, Eye, EyeOff } from 'lucide-react'

function ResetForm() {
  const router = useRouter()
  const params = useSearchParams()
  const token = params.get('token') || ''
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [showPw, setShowPw] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password !== confirm) { setError('Passwords do not match'); return }
    if (password.length < 6) { setError('Password must be at least 6 characters'); return }
    setError('')
    setLoading(true)
    const res = await fetch('/api/auth/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, password }),
    })
    const data = await res.json()
    setLoading(false)
    if (!res.ok) { setError(data.error); return }
    setDone(true)
    setTimeout(() => router.push('/login'), 2000)
  }

  if (!token) return (
    <div className="text-center text-red-400">Invalid reset link. <Link href="/forgot-password" className="underline">Request a new one</Link>.</div>
  )

  return done ? (
    <div className="text-center">
      <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
        <span className="text-2xl">✓</span>
      </div>
      <p className="text-white">Password updated. Redirecting to login...</p>
    </div>
  ) : (
    <>
      <h1 className="text-xl font-semibold text-white mb-6">Set new password</h1>
      {error && <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-lg px-4 py-3 mb-4">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm text-slate-400 mb-1.5">New password</label>
          <div className="relative">
            <input type={showPw ? 'text' : 'password'} className="input-field pr-10"
              placeholder="Min. 6 characters" value={password}
              onChange={e => setPassword(e.target.value)} required />
            <button type="button" onClick={() => setShowPw(v => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300">
              {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>
        <div>
          <label className="block text-sm text-slate-400 mb-1.5">Confirm password</label>
          <input type="password" className="input-field" placeholder="Repeat password"
            value={confirm} onChange={e => setConfirm(e.target.value)} required />
        </div>
        <button type="submit" disabled={loading} className="btn-primary w-full py-3">
          {loading ? 'Updating...' : 'Update password'}
        </button>
      </form>
    </>
  )
}

export default function ResetPasswordPage() {
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
          <Suspense fallback={<div className="text-slate-400">Loading...</div>}>
            <ResetForm />
          </Suspense>
        </div>
      </div>
    </div>
  )
}
