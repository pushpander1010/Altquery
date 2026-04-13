'use client'
import { useState } from 'react'
import { X, Zap, Lightbulb, FileText, Hash, Anchor, AlignLeft, Copy, Check, Loader2, Layers, RefreshCw } from 'lucide-react'

type GenerateTab = 'ideas' | 'script' | 'hashtags' | 'hooks' | 'description'
type Tab = GenerateTab | 'headings'

const GENERATE_TABS: { id: GenerateTab; label: string; icon: React.ReactNode; desc: string }[] = [
  { id: 'ideas',       label: 'Viral Ideas',  icon: <Lightbulb className="w-4 h-4" />, desc: '5 viral video concepts' },
  { id: 'script',      label: 'Script',       icon: <FileText className="w-4 h-4" />,  desc: 'Full video script' },
  { id: 'hashtags',    label: 'Hashtags',     icon: <Hash className="w-4 h-4" />,      desc: '30 optimized hashtags' },
  { id: 'hooks',       label: 'Hooks',        icon: <Anchor className="w-4 h-4" />,    desc: '10 viral hooks' },
  { id: 'description', label: 'Description',  icon: <AlignLeft className="w-4 h-4" />, desc: 'SEO description' },
]

const CATEGORIES = [
  { id: 'all', label: 'All', emoji: '🌐' },
  { id: 'comedy', label: 'Comedy', emoji: '😂' },
  { id: 'dance', label: 'Dance', emoji: '💃' },
  { id: 'fitness', label: 'Fitness', emoji: '💪' },
  { id: 'food', label: 'Food', emoji: '🍕' },
  { id: 'fashion', label: 'Fashion', emoji: '👗' },
  { id: 'travel', label: 'Travel', emoji: '✈️' },
  { id: 'music', label: 'Music', emoji: '🎵' },
  { id: 'motivation', label: 'Motivation', emoji: '🔥' },
  { id: 'beauty', label: 'Beauty', emoji: '💄' },
  { id: 'tech', label: 'Tech', emoji: '💻' },
  { id: 'business', label: 'Business', emoji: '📈' },
  { id: 'education', label: 'Education', emoji: '📚' },
  { id: 'sports', label: 'Sports', emoji: '⚽' },
  { id: 'pets', label: 'Pets', emoji: '🐾' },
]

export default function StudioPanel({ initialTopic, country, countryName, category: initialCategory, topics: initialTopics, onClose }: {
  initialTopic: string
  country: string
  countryName: string
  category?: string
  topics?: string[]
  onClose: () => void
}) {
  const [topic, setTopic] = useState(initialTopic)
  const [activeTab, setActiveTab] = useState<Tab>('ideas')
  const [results, setResults] = useState<Partial<Record<GenerateTab, string>>>({})
  const [loading, setLoading] = useState<Tab | null>(null)
  const [copied, setCopied] = useState(false)

  // Headings tab state
  const [headingsCategory, setHeadingsCategory] = useState(initialCategory || 'all')
  const [headings, setHeadings] = useState<string[]>([])
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null)
  const [headingsCopied, setHeadingsCopied] = useState(false)

  // ── Generate content (ideas/script/hashtags/hooks/description) ──────────────
  const generate = async (tab: GenerateTab) => {
    if (!topic.trim()) return
    setLoading(tab)
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: tab, topic, country }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setResults(r => ({ ...r, [tab]: data.result }))
    } catch (e: any) {
      setResults(r => ({ ...r, [tab]: `Error: ${e.message}` }))
    } finally {
      setLoading(null)
    }
  }

  // ── Generate headings ────────────────────────────────────────────────────────
  const generateHeadings = async (cat?: string) => {
    const useCat = cat || headingsCategory
    setLoading('headings')
    setHeadings([])
    try {
      const res = await fetch('/api/headings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category: useCat, topics: initialTopics || [], country }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setHeadings(data.headings || [])
    } catch (e: any) {
      setHeadings([`Error: ${e.message}`])
    } finally {
      setLoading(null)
    }
  }

  const handleTabClick = (tab: Tab) => {
    setActiveTab(tab)
    if (tab === 'headings') {
      if (headings.length === 0) generateHeadings()
    } else {
      if (!results[tab as GenerateTab]) generate(tab as GenerateTab)
    }
  }

  const copyResult = async () => {
    const text = results[activeTab as GenerateTab]
    if (!text) return
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const copyAll = async () => {
    await navigator.clipboard.writeText(headings.join('\n'))
    setHeadingsCopied(true)
    setTimeout(() => setHeadingsCopied(false), 2000)
  }

  const copyOne = async (idx: number, text: string) => {
    await navigator.clipboard.writeText(text)
    setCopiedIdx(idx)
    setTimeout(() => setCopiedIdx(null), 1500)
  }

  const useHeadingAsTopic = (h: string) => {
    setTopic(h)
    setActiveTab('ideas')
    generate('ideas')
  }

  const isHeadingsTab = activeTab === 'headings'
  const currentResult = !isHeadingsTab ? results[activeTab as GenerateTab] : undefined
  const isLoading = loading === activeTab

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full sm:max-w-3xl max-h-[90vh] flex flex-col rounded-t-2xl sm:rounded-2xl border border-slate-700 overflow-hidden"
        style={{ background: '#13131a' }}>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-violet-600 flex items-center justify-center">
              <Zap className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-semibold text-white">Content Studio</span>
            <span className="text-xs text-slate-500 hidden sm:block">— {countryName}</span>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Topic input — hidden on headings tab */}
        {!isHeadingsTab && (
          <div className="px-5 py-4 border-b border-slate-800">
            <div className="flex gap-2">
              <input
                type="text"
                className="input-field flex-1 py-2.5 text-sm"
                placeholder="Enter topic or paste video title..."
                value={topic}
                onChange={e => setTopic(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && generate(activeTab as GenerateTab)}
              />
              <button onClick={() => generate(activeTab as GenerateTab)} disabled={!topic.trim() || !!loading}
                className="btn-primary px-4 py-2.5 text-sm flex items-center gap-2 whitespace-nowrap">
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
                Generate
              </button>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="flex border-b border-slate-800 overflow-x-auto">
          {GENERATE_TABS.map(tab => (
            <button key={tab.id} onClick={() => handleTabClick(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors border-b-2 ${activeTab === tab.id ? 'border-violet-500 text-violet-300' : 'border-transparent text-slate-500 hover:text-slate-300'}`}>
              {tab.icon}
              <span>{tab.label}</span>
              {results[tab.id] && <span className="w-1.5 h-1.5 rounded-full bg-green-400" />}
            </button>
          ))}
          {/* Headings tab — amber accent */}
          <button onClick={() => handleTabClick('headings')}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors border-b-2 ${activeTab === 'headings' ? 'border-amber-400 text-amber-300' : 'border-transparent text-slate-500 hover:text-slate-300'}`}>
            <Layers className="w-4 h-4" />
            <span>50 Headings</span>
            {headings.length > 0 && <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />}
          </button>
        </div>

        {/* ── Headings tab content ── */}
        {isHeadingsTab && (
          <>
            {/* Category pills */}
            <div className="px-4 py-3 border-b border-slate-800 flex gap-2 overflow-x-auto">
              {CATEGORIES.map(cat => (
                <button key={cat.id}
                  onClick={() => { setHeadingsCategory(cat.id); setHeadings([]); generateHeadings(cat.id) }}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs whitespace-nowrap transition-all ${
                    headingsCategory === cat.id ? 'bg-amber-500 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}>
                  {cat.emoji} {cat.label}
                </button>
              ))}
            </div>

            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-16 gap-3 flex-1">
                <Loader2 className="w-8 h-8 text-amber-400 animate-spin" />
                <p className="text-slate-400 text-sm">Generating 50 viral headings...</p>
              </div>
            ) : headings.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 gap-3 flex-1">
                <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center">
                  <Layers className="w-6 h-6 text-slate-600" />
                </div>
                <p className="text-slate-400 text-sm">50 scroll-stopping video titles</p>
                <button onClick={() => generateHeadings()} className="btn-primary flex items-center gap-2 mt-1">
                  <Zap className="w-4 h-4" /> Generate Headings
                </button>
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto p-4 space-y-1.5 min-h-0">
                {headings.map((h, i) => (
                  <div key={i}
                    className="flex items-start gap-3 px-3 py-2.5 rounded-lg bg-slate-800/50 hover:bg-slate-800 group transition-colors">
                    <span className="text-xs text-slate-600 font-mono w-5 shrink-0 mt-0.5">{i + 1}</span>
                    <p className="text-sm text-slate-200 flex-1 leading-snug">{h}</p>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                      <button onClick={() => copyOne(i, h)} title="Copy"
                        className="p-1 rounded text-slate-500 hover:text-white">
                        {copiedIdx === i ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                      <button onClick={() => useHeadingAsTopic(h)} title="Use as topic"
                        className="p-1 rounded text-slate-500 hover:text-violet-400">
                        <Zap className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {headings.length > 0 && !isLoading && (
              <div className="px-5 py-3 border-t border-slate-800 flex items-center justify-between">
                <span className="text-xs text-slate-500">{headings.length} headings generated</span>
                <div className="flex gap-2">
                  <button onClick={copyAll} className="flex items-center gap-1.5 btn-ghost py-2 text-sm">
                    {headingsCopied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                    {headingsCopied ? 'Copied!' : 'Copy all'}
                  </button>
                  <button onClick={() => generateHeadings()} className="flex items-center gap-2 btn-ghost py-2 text-sm">
                    <RefreshCw className="w-4 h-4" /> Regenerate
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {/* ── Generate tabs content ── */}
        {!isHeadingsTab && (
          <>
            <div className="flex-1 overflow-y-auto p-5 min-h-0">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-16 gap-3">
                  <Loader2 className="w-8 h-8 text-violet-400 animate-spin" />
                  <p className="text-slate-400 text-sm">Generating {GENERATE_TABS.find(t => t.id === activeTab)?.label}...</p>
                </div>
              ) : currentResult ? (
                <pre className="text-sm text-slate-300 whitespace-pre-wrap font-sans leading-relaxed">
                  {currentResult}
                </pre>
              ) : (
                <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
                  <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center text-slate-600">
                    {GENERATE_TABS.find(t => t.id === activeTab)?.icon}
                  </div>
                  <p className="text-slate-400 text-sm">{GENERATE_TABS.find(t => t.id === activeTab)?.desc}</p>
                  <p className="text-slate-600 text-xs">Enter a topic above and click Generate</p>
                </div>
              )}
            </div>

            {currentResult && !isLoading && (
              <div className="px-5 py-3 border-t border-slate-800 flex justify-end gap-2">
                <button onClick={copyResult} className="flex items-center gap-2 btn-ghost py-2 text-sm">
                  {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                  {copied ? 'Copied!' : 'Copy'}
                </button>
                <button onClick={() => generate(activeTab as GenerateTab)} disabled={!!loading}
                  className="flex items-center gap-2 btn-primary py-2 text-sm">
                  <Zap className="w-4 h-4" /> Regenerate
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
