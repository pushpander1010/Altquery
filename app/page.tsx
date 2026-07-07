'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Search, Filter } from 'lucide-react'
import { QUESTIONS, TOPICS, Difficulty } from '@/lib/questions'
import Script from 'next/script'
import ProgressTracker from '@/components/ProgressTracker'

export default function HomePage() {
  const [search, setSearch] = useState('')
  const [difficultyFilter, setDifficultyFilter] = useState<Difficulty | 'all'>('all')
  const [topicFilter, setTopicFilter] = useState<string>('all')
  const [dialectFilter, setDialectFilter] = useState<string>('all')

  const filteredQuestions = useMemo(() => {
    return QUESTIONS.filter(q => {
      const matchesSearch = q.title.toLowerCase().includes(search.toLowerCase()) ||
                           q.description.toLowerCase().includes(search.toLowerCase())
      const matchesDifficulty = difficultyFilter === 'all' || q.difficulty === difficultyFilter
      const matchesTopic = topicFilter === 'all' || q.topic === topicFilter
      const matchesDialect = dialectFilter === 'all' || q.dialect === dialectFilter
      return matchesSearch && matchesDifficulty && matchesTopic && matchesDialect
    })
  }, [search, difficultyFilter, topicFilter, dialectFilter])

  const stats = {
    total: QUESTIONS.length,
    easy: QUESTIONS.filter(q => q.difficulty === 'easy').length,
    medium: QUESTIONS.filter(q => q.difficulty === 'medium').length,
    hard: QUESTIONS.filter(q => q.difficulty === 'hard').length,
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* Structured Data for SEO */}
      <Script id="structured-data" type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          "name": "AltQuery",
          "description": "1050+ interactive SQL practice questions. Master SQL with hands-on exercises.",
          "url": "https://altquery.com",
          "potentialAction": {
            "@type": "SearchAction",
            "target": "https://altquery.com/?search={search_term_string}",
            "query-input": "required name=search_term_string"
          }
        })}
      </Script>

      <Script id="faq-structured-data" type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": [
            {
              "@type": "Question",
              "name": "How many SQL practice questions are available?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "AltQuery offers 1050+ interactive SQL practice questions covering all difficulty levels from easy to hard."
              }
            },
            {
              "@type": "Question",
              "name": "Do I need to create an account?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "No, AltQuery is completely free and requires no login. Start practicing SQL immediately."
              }
            },
            {
              "@type": "Question",
              "name": "What SQL topics are covered?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Topics include SELECT basics, JOINs, Window Functions, CTEs, Subqueries, Aggregation, String Functions, Date Functions, and more."
              }
            }
          ]
        })}
      </Script>

      {/* Hero */}
      <div className="text-center mb-16 relative">
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl blob"></div>
          <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-cyan-600/20 rounded-full blur-3xl blob-delay"></div>
        </div>
        <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
          Master <span className="gradient-text">SQL</span> with Practice
        </h1>
        <p className="text-xl md:text-2xl text-slate-400 max-w-3xl mx-auto mb-8 leading-relaxed">
          {stats.total}+ interactive SQL questions. No login required. AI assistant to help you learn.
        </p>
        <div className="flex items-center justify-center gap-4 flex-wrap mb-8">
          <div className="badge-easy text-base px-4 py-2">{stats.easy} Easy</div>
          <div className="badge-medium text-base px-4 py-2">{stats.medium} Medium</div>
          <div className="badge-hard text-base px-4 py-2">{stats.hard} Hard</div>
        </div>
        <div className="flex items-center justify-center gap-3 text-sm text-slate-500">
          <span className="flex items-center gap-1">
            <svg className="w-4 h-4 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Instant Feedback
          </span>
          <span className="text-slate-700">•</span>
          <span className="flex items-center gap-1">
            <svg className="w-4 h-4 text-indigo-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
              <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
            </svg>
            AI Assistant
          </span>
          <span className="text-slate-700">•</span>
          <span className="flex items-center gap-1">
            <svg className="w-4 h-4 text-cyan-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            No Signup
          </span>
        </div>
      </div>

      {/* Progress */}
      <ProgressTracker />

      {/* Browse by Topic */}
      <div className="mb-6">
        <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">Browse by Topic</h2>
        <div className="flex flex-wrap gap-2">
          {TOPICS.map(topic => (
            <Link
              key={topic}
              href={`/topics/${encodeURIComponent(topic)}`}
              className="px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-sm text-slate-300 hover:border-indigo-600 hover:text-white transition-all"
            >
              {topic}
            </Link>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="card mb-8 shadow-2xl">
        <div className="flex flex-col gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
            <input
              type="text"
              placeholder="Search questions..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-12 pr-4 py-3 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
            />
          </div>

          {/* Filter Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Difficulty Filter */}
            <select
              value={difficultyFilter}
              onChange={(e) => setDifficultyFilter(e.target.value as Difficulty | 'all')}
              className="bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-slate-100 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
            >
              <option value="all">All Difficulties</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>

            {/* Topic Filter */}
            <select
              value={topicFilter}
              onChange={(e) => setTopicFilter(e.target.value)}
              className="bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-slate-100 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
            >
              <option value="all">All Topics</option>
              {TOPICS.map(topic => (
                <option key={topic} value={topic}>{topic}</option>
              ))}
            </select>

            {/* Dialect Filter */}
            <select
              value={dialectFilter}
              onChange={(e) => setDialectFilter(e.target.value)}
              className="bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-slate-100 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all sm:col-span-2 lg:col-span-1"
            >
              <option value="all">All SQL Dialects</option>
              <option value="sqlite">SQLite</option>
              <option value="mysql">MySQL</option>
              <option value="postgresql">PostgreSQL</option>
            </select>
          </div>
        </div>
      </div>

      {/* Questions List */}
      <div className="space-y-4">
        {filteredQuestions.length === 0 ? (
          <div className="card text-center py-12">
            <Filter className="w-12 h-12 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400">No questions match your filters</p>
          </div>
        ) : (
          filteredQuestions.map((question) => (
            <Link
              key={question.id}
              href={`/question/${question.id}`}
              className="card hover:border-indigo-700 hover:shadow-2xl hover:shadow-indigo-900/20 transition-all duration-300 block group"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <h3 className="text-lg font-semibold text-white group-hover:text-indigo-400 transition-colors">
                      {question.title}
                    </h3>
                    <span className={`badge-${question.difficulty}`}>
                      {question.difficulty}
                    </span>
                  </div>
                  <p className="text-slate-400 text-sm mb-4 leading-relaxed">{question.description}</p>
                  <div className="flex items-center gap-3 text-xs">
                    <span className="px-3 py-1.5 bg-slate-800 rounded-lg text-slate-300 font-medium">
                      {question.topic}
                    </span>
                    <span className="text-slate-600">•</span>
                    <span className="text-slate-500">
                      {question.schema.length} table{question.schema.length > 1 ? 's' : ''}
                    </span>
                    {question.dialect && (
                      <>
                        <span className="text-slate-600">•</span>
                        <span className="px-2 py-1 bg-blue-900/30 text-blue-400 rounded font-medium">
                          {question.dialect.toUpperCase()}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  )
}
