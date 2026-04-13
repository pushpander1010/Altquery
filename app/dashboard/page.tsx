'use client'
import { useState, useEffect, useCallback } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { TrendingUp, Youtube, Instagram, Globe, RefreshCw, LogOut, Zap, ChevronRight } from 'lucide-react'
import VideoCard from '@/components/VideoCard'
import StudioPanel from '@/components/StudioPanel'

const COUNTRIES = [
  { code: 'US', name: 'United States', flag: '🇺🇸' },
  { code: 'IN', name: 'India', flag: '🇮🇳' },
  { code: 'GB', name: 'United Kingdom', flag: '🇬🇧' },
  { code: 'CA', name: 'Canada', flag: '🇨🇦' },
  { code: 'AU', name: 'Australia', flag: '🇦🇺' },
  { code: 'DE', name: 'Germany', flag: '🇩🇪' },
  { code: 'FR', name: 'France', flag: '🇫🇷' },
  { code: 'BR', name: 'Brazil', flag: '🇧🇷' },
  { code: 'JP', name: 'Japan', flag: '🇯🇵' },
  { code: 'KR', name: 'South Korea', flag: '🇰🇷' },
  { code: 'MX', name: 'Mexico', flag: '🇲🇽' },
  { code: 'ID', name: 'Indonesia', flag: '🇮🇩' },
  { code: 'PK', name: 'Pakistan', flag: '🇵🇰' },
  { code: 'NG', name: 'Nigeria', flag: '🇳🇬' },
  { code: 'ZA', name: 'South Africa', flag: '🇿🇦' },
]

const CATEGORIES = [
  { id: 'all',        label: 'All',        emoji: '🌐' },
  { id: 'comedy',     label: 'Comedy',     emoji: '😂' },
  { id: 'dance',      label: 'Dance',      emoji: '💃' },
  { id: 'fitness',    label: 'Fitness',    emoji: '💪' },
  { id: 'food',       label: 'Food',       emoji: '🍕' },
  { id: 'fashion',    label: 'Fashion',    emoji: '👗' },
  { id: 'travel',     label: 'Travel',     emoji: '✈️' },
  { id: 'music',      label: 'Music',      emoji: '🎵' },
  { id: 'motivation', label: 'Motivation', emoji: '🔥' },
  { id: 'beauty',     label: 'Beauty',     emoji: '💄' },
  { id: 'tech',       label: 'Tech',       emoji: '💻' },
  { id: 'business',   label: 'Business',   emoji: '📈' },
  { id: 'education',  label: 'Education',  emoji: '📚' },
  { id: 'sports',     label: 'Sports',     emoji: '⚽' },
  { id: 'pets',       label: 'Pets',       emoji: '🐾' },
]

type Video = {
  id: string; platform: string; title: string; channel: string
  thumbnail: string; views: number; likes: number; publishedAt: string
  url: string; tags: string[]; subtitle?: string
}

export default function Dashboard() {
  const { data: session } = useSession()
  const [country, setCountry] = useState('IN')
  const [platform, setPlatform] = useState<'all' | 'youtube' | 'instagram' | 'trends'>('all')
  const [category, setCategory] = useState('all')
  const [videos, setVideos] = useState<Video[]>([])
  const [topics, setTopics] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [selectedTopic, setSelectedTopic] = useState('')
  const [showStudio, setShowStudio] = useState(false)

  const fetchTrending = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`/api/trending?country=${country}&platform=${platform}&category=${category}`)
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setVideos(data.videos || [])
      setTopics(data.trendingTopics || [])
    } catch (e: any) {
      setError(e.message || 'Failed to fetch trending data')
    } finally {
      setLoading(false)
    }
  }, [country, platform, category])

  useEffect(() => { fetchTrending() }, [fetchTrending])

  const openStudio = (topic: string) => {
    setSelectedTopic(topic)
    setShowStudio(true)
  }

  const countryInfo = COUNTRIES.find(c => c.code === country)
  const categoryInfo = CATEGORIES.find(c => c.id === category)

  return (
    <div className="min-h-screen" style={{ background: '#0a0a0f' }}>
      {/* Navbar */}
      <nav className="border-b border-slate-800 px-4 py-3 flex items-center justify-between sticky top-0 z-40"
        style={{ background: 'rgba(10,10,15,0.95)', backdropFilter: 'blur(12px)' }}>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-violet-600 flex items-center justify-center">
            <TrendingUp className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-white">AltQuery</span>
          <span className="hidden sm:block text-xs text-slate-500 ml-1">Viral Intelligence</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-slate-400 hidden sm:block">{session?.user?.name}</span>
          <button onClick={() => signOut({ callbackUrl: '/login' })}
            className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-300 transition-colors">
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:block">Sign out</span>
          </button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-6">

        {/* ── Row 1: Country + Platform + Refresh + Actions ── */}
        <div className="flex flex-wrap items-center gap-3 mb-4">
          {/* Country */}
          <div className="relative">
            <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
            <select value={country} onChange={e => setCountry(e.target.value)}
              className="pl-9 pr-8 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-slate-200 text-sm focus:outline-none focus:border-violet-500 appearance-none cursor-pointer">
              {COUNTRIES.map(c => (
                <option key={c.code} value={c.code}>{c.flag} {c.name}</option>
              ))}
            </select>
          </div>

          {/* Platform tabs */}
          <div className="flex rounded-lg border border-slate-700 overflow-hidden">
            {(['all', 'youtube', 'instagram', 'trends'] as const).map(p => (
              <button key={p} onClick={() => setPlatform(p)}
                className={`px-3 py-2.5 text-sm font-medium transition-colors flex items-center gap-1.5 ${platform === p ? 'bg-violet-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}>
                {p === 'youtube'   && <Youtube className="w-3.5 h-3.5" />}
                {p === 'instagram' && <Instagram className="w-3.5 h-3.5" />}
                {p === 'trends'    && <span>🔥</span>}
                {p === 'all'       && <TrendingUp className="w-3.5 h-3.5" />}
                <span className="hidden sm:inline">
                  {p === 'all' ? 'All' : p === 'youtube' ? 'YouTube' : p === 'instagram' ? 'Instagram' : 'Trends'}
                </span>
              </button>
            ))}
          </div>

          <button onClick={fetchTrending} disabled={loading}
            className="flex items-center gap-2 btn-ghost py-2.5 text-sm">
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>

          <div className="ml-auto flex gap-2">
            <button onClick={() => setShowStudio(true)}
              className="btn-primary flex items-center gap-2 px-6 py-3 text-base font-semibold">
              <Zap className="w-5 h-5" />
              Content Studio
            </button>
          </div>
        </div>

        {/* ── Row 2: Category pills ── */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-5 scrollbar-hide">
          {CATEGORIES.map(cat => (
            <button key={cat.id} onClick={() => setCategory(cat.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                category === cat.id
                  ? 'bg-violet-600 text-white'
                  : 'bg-slate-800 border border-slate-700 text-slate-400 hover:text-white hover:border-slate-500'
              }`}>
              <span>{cat.emoji}</span>
              {cat.label}
            </button>
          ))}
        </div>

        {/* Trending Topics Bar */}
        {topics.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-violet-400" />
              <span className="text-sm font-medium text-slate-300">
                Trending {categoryInfo?.emoji} {categoryInfo?.label} in {countryInfo?.name}
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {topics.map(topic => (
                <button key={topic} onClick={() => openStudio(topic)}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium bg-violet-500/10 border border-violet-500/30 text-violet-300 hover:bg-violet-500/20 transition-colors">
                  #{topic}
                  <ChevronRight className="w-3 h-3" />
                </button>
              ))}
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-lg px-4 py-3 mb-6">
            {error}
          </div>
        )}

        {/* Video Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="card animate-pulse">
                <div className="aspect-video bg-slate-800 rounded-lg mb-3" />
                <div className="h-4 bg-slate-800 rounded mb-2" />
                <div className="h-3 bg-slate-800 rounded w-2/3" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {videos.map((video, i) => (
              <VideoCard key={video.id} video={video} rank={i + 1}
                onUseIdea={() => openStudio(video.title)} />
            ))}
          </div>
        )}

        {!loading && videos.length === 0 && !error && (
          <div className="text-center py-20 text-slate-500">
            <TrendingUp className="w-12 h-12 mx-auto mb-4 opacity-30" />
            <p>No trending videos found. Try a different country or category.</p>
          </div>
        )}
      </div>

      {/* Studio Panel */}
      {showStudio && (
        <StudioPanel
          initialTopic={selectedTopic}
          country={country}
          countryName={countryInfo?.name || country}
          category={category}
          topics={topics}
          onClose={() => setShowStudio(false)}
        />
      )}
    </div>
  )
}
