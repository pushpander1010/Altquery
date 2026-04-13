'use client'
import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { TrendingUp, Loader2 } from 'lucide-react'

function VerifyContent() {
  const router = useRouter()
  const params = useSearchParams()
  const token = params.get('token')
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')

  useEffect(() => {
    if (!token) { setStatus('error'); return }
    fetch(`/api/auth/verify-email?token=${token}`)
      .then(res => {
        setStatus(res.ok || res.redirected ? 'success' : 'error')
        if (res.ok || res.redirected) setTimeout(() => router.push('/login?verified=1'), 2000)
      })
      .catch(() => setStatus('error'))
  }, [token, router])

  return (
    <div className="text-center">
      {status === 'loading' && (
        <>
          <Loader2 className="w-10 h-10 text-violet-400 animate-spin mx-auto mb-4" />
          <p className="text-slate-300">Verifying your email...</p>
        </>
      )}
      {status === 'success' && (
        <>
          <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4 text-2xl">✓</div>
          <h2 className="text-lg font-semibold text-white mb-2">Email verified!</h2>
          <p className="text-slate-400 text-sm">Redirecting to login...</p>
        </>
      )}
      {status === 'error' && (
        <>
          <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-4 text-2xl">✗</div>
          <h2 className="text-lg font-semibold text-white mb-2">Invalid or expired link</h2>
          <p className="text-slate-400 text-sm mb-4">This verification link has expired or already been used.</p>
          <button onClick={() => router.push('/signup')} className="btn-primary text-sm px-4 py-2">
            Sign up again
          </button>
        </>
      )}
    </div>
  )
}

export default function VerifyEmailPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4"
      style={{ background: 'radial-gradient(ellipse at top, #1e1b4b 0%, #0a0a0f 60%)' }}>
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
          <Suspense fallback={<Loader2 className="w-8 h-8 animate-spin mx-auto text-violet-400" />}>
            <VerifyContent />
          </Suspense>
        </div>
      </div>
    </div>
  )
}
