'use client'

import { useState } from 'react'
import { Search, Star, Users, TrendingUp, ExternalLink, Sparkles } from 'lucide-react'
import Link from 'next/link'

const featuredAlternatives = [
  {
    id: 'notion-alternatives',
    name: 'Notion Alternatives',
    description: 'Find the best alternatives to Notion for note-taking and productivity',
    category: 'Productivity',
    alternatives: ['Obsidian', 'Roam Research', 'Logseq', 'RemNote']
  },
  {
    id: 'figma-alternatives',
    name: 'Figma Alternatives',
    description: 'Discover design tools that compete with Figma',
    category: 'Design',
    alternatives: ['Sketch', 'Adobe XD', 'Penpot', 'Canva']
  },
  {
    id: 'slack-alternatives',
    name: 'Slack Alternatives',
    description: 'Team communication tools better than Slack',
    category: 'Communication',
    alternatives: ['Discord', 'Microsoft Teams', 'Mattermost', 'Rocket.Chat']
  },
  {
    id: 'photoshop-alternatives',
    name: 'Photoshop Alternatives',
    description: 'Free and paid alternatives to Adobe Photoshop',
    category: 'Design',
    alternatives: ['GIMP', 'Canva', 'Affinity Photo', 'Pixlr']
  }
]

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-indigo-600">AltQuery</h1>
              <span className="ml-2 text-gray-500">Find Better Alternatives</span>
            </div>
            <nav className="hidden md:flex space-x-6">
              <Link href="/categories" className="text-gray-600 hover:text-indigo-600">Categories</Link>
              <Link href="/trending" className="text-gray-600 hover:text-indigo-600">Trending</Link>
              <Link href="/compare" className="text-gray-600 hover:text-indigo-600">Compare</Link>
              <Link href="/quiz" className="text-gray-600 hover:text-indigo-600">Quiz</Link>
              <Link href="/collections" className="text-gray-600 hover:text-indigo-600">Collections</Link>
              <Link href="/submit" className="text-gray-600 hover:text-indigo-600">Submit</Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Find the Perfect Alternative
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Discover better, cheaper, or more suitable alternatives to popular software, tools, and services.
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-12">
            <form onSubmit={handleSearch}>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search for alternatives (e.g., 'Photoshop alternatives')"
                  className="w-full pl-12 pr-4 py-4 text-lg text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder-gray-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button 
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700"
                >
                  Search
                </button>
              </div>
            </form>
          </div>

          {/* AI Feature Highlight */}
          <div className="bg-gradient-to-r from-purple-100 to-indigo-100 rounded-lg p-6 mb-12">
            <div className="flex items-center justify-center mb-3">
              <Sparkles className="w-6 h-6 text-purple-600 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900">AI-Powered Suggestions</h3>
            </div>
            <p className="text-center text-gray-600">
              Can't find what you're looking for? Our AI can generate alternatives for any software or service!
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="text-center">
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <TrendingUp className="w-8 h-8 text-indigo-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">500+</div>
                <div className="text-gray-600">Alternatives Listed</div>
              </div>
            </div>
            <div className="text-center">
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <Users className="w-8 h-8 text-indigo-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">50K+</div>
                <div className="text-gray-600">Monthly Visitors</div>
              </div>
            </div>
            <div className="text-center">
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <Star className="w-8 h-8 text-indigo-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">4.8/5</div>
                <div className="text-gray-600">User Rating</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h3 className="text-3xl font-bold text-gray-900 mb-8 text-center">Discover Alternatives Your Way</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <Link href="/quiz" className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-6 text-center group">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-purple-200 transition-colors">
              <span className="text-2xl">🎯</span>
            </div>
            <h4 className="text-lg font-semibold text-gray-900 mb-2">Take the Quiz</h4>
            <p className="text-gray-600 text-sm">Get personalized recommendations based on your needs</p>
          </Link>

          <Link href="/compare" className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-6 text-center group">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-200 transition-colors">
              <span className="text-2xl">⚖️</span>
            </div>
            <h4 className="text-lg font-semibold text-gray-900 mb-2">Compare Tools</h4>
            <p className="text-gray-600 text-sm">Side-by-side comparison of features and pricing</p>
          </Link>

          <Link href="/collections" className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-6 text-center group">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-green-200 transition-colors">
              <span className="text-2xl">📚</span>
            </div>
            <h4 className="text-lg font-semibold text-gray-900 mb-2">Collections</h4>
            <p className="text-gray-600 text-sm">Curated lists by experts and community</p>
          </Link>

          <Link href="/daily" className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-6 text-center group">
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-orange-200 transition-colors">
              <span className="text-2xl">📅</span>
            </div>
            <h4 className="text-lg font-semibold text-gray-900 mb-2">Daily Pick</h4>
            <p className="text-gray-600 text-sm">Fresh alternative recommendation every day</p>
          </Link>
        </div>
      </section>

      {/* Featured Alternatives */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h3 className="text-3xl font-bold text-gray-900 mb-8 text-center">Popular Alternatives</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredAlternatives.map((item) => (
            <Link key={item.id} href={`/alternatives/${item.id}`} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-6 block">
              <div className="flex items-center justify-between mb-3">
                <span className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-0.5 rounded">
                  {item.category}
                </span>
                <ExternalLink className="w-4 h-4 text-gray-400" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">{item.name}</h4>
              <p className="text-gray-600 text-sm mb-4">{item.description}</p>
              <div className="flex flex-wrap gap-1">
                {item.alternatives.slice(0, 3).map((alt) => (
                  <span key={alt} className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
                    {alt}
                  </span>
                ))}
                {item.alternatives.length > 3 && (
                  <span className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
                    +{item.alternatives.length - 3} more
                  </span>
                )}
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Ad Space */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-gray-100 rounded-lg p-8 text-center">
          <div className="text-gray-500 text-sm mb-2">Advertisement</div>
          <div className="bg-white rounded border-2 border-dashed border-gray-300 p-8">
            <p className="text-gray-400">Google AdSense Banner (728x90)</p>
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h3 className="text-3xl font-bold mb-4">Stay Updated</h3>
          <p className="text-xl mb-8 opacity-90">
            Get weekly alternative discoveries and exclusive deals delivered to your inbox.
          </p>
          <Link
            href="/newsletter"
            className="bg-white text-indigo-600 px-8 py-3 rounded-lg hover:bg-gray-100 font-medium inline-block"
          >
            Subscribe to Newsletter
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
            <div>
              <h5 className="text-lg font-semibold mb-4">AltQuery</h5>
              <p className="text-gray-400 text-sm">
                Find the best alternatives to popular software and services.
              </p>
            </div>
            <div>
              <h6 className="font-semibold mb-4">Discover</h6>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/categories">Categories</Link></li>
                <li><Link href="/trending">Trending</Link></li>
                <li><Link href="/collections">Collections</Link></li>
                <li><Link href="/daily">Daily Pick</Link></li>
              </ul>
            </div>
            <div>
              <h6 className="font-semibold mb-4">Tools</h6>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/compare">Compare</Link></li>
                <li><Link href="/quiz">Quiz</Link></li>
                <li><Link href="/search">Search</Link></li>
                <li><Link href="/submit">Submit</Link></li>
              </ul>
            </div>
            <div>
              <h6 className="font-semibold mb-4">Company</h6>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/about">About</Link></li>
                <li><Link href="/contact">Contact</Link></li>
                <li><Link href="/privacy">Privacy</Link></li>
                <li><Link href="/terms">Terms</Link></li>
              </ul>
            </div>
            <div>
              <h6 className="font-semibold mb-4">Connect</h6>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="https://twitter.com/altquery">Twitter</a></li>
                <li><a href="https://github.com/altquery">GitHub</a></li>
                <li><Link href="/newsletter">Newsletter</Link></li>
                <li><Link href="/admin">Admin</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
            <p>&copy; 2024 AltQuery. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}