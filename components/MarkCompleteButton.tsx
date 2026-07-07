'use client'

import { useState, useEffect } from 'react'
import { Check } from 'lucide-react'

function loadCompleted(): string[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem('altquery_progress')
    if (raw) return JSON.parse(raw).completed || []
  } catch {}
  return []
}

function saveCompleted(ids: string[]) {
  const today = new Date().toDateString()
  let streak = 0
  try {
    const raw = localStorage.getItem('altquery_progress')
    if (raw) {
      const p = JSON.parse(raw)
      const yesterday = new Date(Date.now() - 86400000).toDateString()
      if (p.lastDate === today) streak = p.streak
      else if (p.lastDate === yesterday) streak = p.streak + 1
    }
  } catch {}

  localStorage.setItem('altquery_progress', JSON.stringify({
    completed: ids,
    lastDate: today,
    streak,
  }))
}

export default function MarkCompleteButton({ questionId }: { questionId: string }) {
  const [completed, setCompleted] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    setCompleted(loadCompleted().includes(questionId))
  }, [questionId])

  function toggle() {
    const ids = loadCompleted()
    let next: string[]
    if (ids.includes(questionId)) {
      next = ids.filter((id) => id !== questionId)
    } else {
      next = [...ids, questionId]
    }
    saveCompleted(next)
    setCompleted(next.includes(questionId))
    // Trigger storage event for ProgressTracker to update
    window.dispatchEvent(new Event('storage'))
  }

  if (!mounted) return null

  return (
    <button
      onClick={toggle}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
        completed
          ? 'bg-emerald-600 text-white hover:bg-emerald-700'
          : 'bg-slate-800 border border-slate-700 text-slate-300 hover:text-white hover:border-emerald-600'
      }`}
    >
      <Check className="w-4 h-4" />
      {completed ? 'Completed' : 'Mark Complete'}
    </button>
  )
}
