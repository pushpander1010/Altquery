'use client'

import { Share2, Link2, Check } from 'lucide-react'
import { useState } from 'react'

export default function ShareButton({ questionId, title }: { questionId: string; title: string }) {
  const [copied, setCopied] = useState(false)
  const url = `https://www.altquery.com/question/${questionId}`

  async function handleShare() {
    if (navigator.share) {
      try {
        await navigator.share({ title, url })
      } catch {}
    } else {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <button
      onClick={handleShare}
      className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 hover:text-white hover:border-slate-600 transition-all text-sm"
      title="Share this question"
    >
      {copied ? (
        <>
          <Check className="w-4 h-4 text-emerald-400" />
          <span className="text-emerald-400">Copied!</span>
        </>
      ) : (
        <>
          <Share2 className="w-4 h-4" />
          <span className="hidden sm:inline">Share</span>
        </>
      )}
    </button>
  )
}
