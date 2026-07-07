'use client'

import { useState, useEffect } from 'react'
import { CheckCircle, Flame, BarChart3 } from 'lucide-react'
import { QUESTIONS } from '@/lib/questions'

interface Progress {
  completed: string[]
  lastDate: string
  streak: number
}

function loadProgress(): Progress {
  if (typeof window === 'undefined') return { completed: [], lastDate: '', streak: 0 }
  try {
    const raw = localStorage.getItem('altquery_progress')
    if (raw) return JSON.parse(raw)
  } catch {}
  return { completed: [], lastDate: '', streak: 0 }
}

function saveProgress(progress: Progress) {
  localStorage.setItem('altquery_progress', JSON.stringify(progress))
}

export function getCompletedIds(): string[] {
  return loadProgress().completed
}

export default function ProgressTracker() {
  const [progress, setProgress] = useState<Progress>({ completed: [], lastDate: '', streak: 0 })
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const p = loadProgress()

    // Update streak
    const today = new Date().toDateString()
    const yesterday = new Date(Date.now() - 86400000).toDateString()
    if (p.lastDate === today) {
      // Same day, keep streak
    } else if (p.lastDate === yesterday) {
      p.streak += 1
    } else if (p.lastDate !== today) {
      p.streak = p.lastDate ? 0 : 0
    }
    p.lastDate = today
    saveProgress(p)
    setProgress(p)
  }, [])

  if (!mounted) return null

  const total = QUESTIONS.length
  const done = progress.completed.length
  const pct = total > 0 ? Math.round((done / total) * 100) : 0

  return (
    <div className="card mb-6 p-4 bg-gradient-to-r from-indigo-900/20 to-cyan-900/20 border-indigo-800/30">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-indigo-400" />
            <span className="text-sm text-slate-300">
              <span className="font-bold text-white">{done}</span>/{total} completed
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-orange-400" />
            <span className="text-sm text-slate-300">
              <span className="font-bold text-white">{progress.streak}</span> day streak
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-32 h-2 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-full transition-all duration-500"
              style={{ width: `${pct}%` }}
            />
          </div>
          <span className="text-xs text-slate-500 font-medium">{pct}%</span>
        </div>
      </div>
    </div>
  )
}
