'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Calendar, Star, TrendingUp, RefreshCw, Share2, Bookmark } from 'lucide-react'

interface DailyAlternative {
  name: string
  description: string
  category: string
  rating: number
  pricing: string
  website: string
  whyToday: string
  pros: string[]
  cons: string[]
  similarTo: string[]
}

const dailyAlternatives: DailyAlternative[] = [
  {
    name: 'Linear',
    description: 'The issue tracking tool your team will actually love using',
    category: 'Project Management',
    rating: 4.7,
    pricing: 'Free / $8/month',
    website: 'https://linear.app',
    whyToday: 'Perfect for teams looking to move away from bloated project management tools',
    pros: ['Lightning fast', 'Beautiful design', 'Keyboard shortcuts', 'Git integration'],
    cons: ['Limited customization', 'No time tracking', 'Newer platform'],
    similarTo: ['Jira', 'Asana', 'Monday.com']
  },
  {
    name: 'Raycast',
    description: 'Supercharged productivity launcher for Mac',
    category: 'Productivity',
    rating: 4.8,
    pricing: 'Free / $8/month',
    website: 'https://raycast.com',
    whyToday: 'Game-changer for Mac users wanting to boost productivity',
    pros: ['Extensible', 'Fast search', 'Beautiful UI', 'Active community'],
    cons: ['Mac only', 'Learning curve', 'Some features require Pro'],
    similarTo: ['Alfred', 'Spotlight', 'Launcher']
  }
]

export default function DailyPage() {
  const [currentAlternative, setCurrentAlternative] = useState<DailyAlternative>(dailyAlternatives[0])
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [currentDate, setCurrentDate] = useState('')

  useEffect(() => {
    const today = new Date()
    setCurrentDate(today.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }))
    
    // Rotate daily alternative based on day of year
    const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000)
    setCurrentAlternative(dailyAlternatives[dayOfYear % dailyAlternatives.length])
  }, [])

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${currentAlternative.name} - Alternative of the Day`,
          text: currentAlternative.description,
          url: window.location.href,
        })
      } catch (err) {
        console.log('Error sharing:', err)
      }
    } else {
      // Fallback to copying URL
      navigator.clipboard.writeText(window.location.href)
      alert('Link copied to clipboard!')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Link href="/" className="text-2xl font-bold text-indigo-600">AltQuery</Link>
              <span className="ml-2 text-gray-500">/ Daily Alternative</span>
            </div>
            <nav className="hidden md:flex space-x-6">
              <Link href="/categories" className="text-gray-600 hover:text-indigo-600">Categories</Link>
              <Link href="/trending" className="text-gray-600 hover:text-indigo-600">Trending</Link>
              <Link href="/compare" className="text-gray-600 hover:text-indigo-600">Compare</Link>
              <Link href="/daily" className="text-orange-600 font-medium">Daily</Link>
            </nav>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Calendar className="w-8 h-8 text-orange-600 mr-3" />
            <h1 className="text-4xl font-bold text-gray-900">Alternative of the Day</h1>
          </div>
          <p className="text-lg text-gray-600">{currentDate}</p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
          {/* Header */}
          <div className="bg-gradient-to-r from-orange-500 to-red-500 p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <span className="bg-white bg-opacity-20 text-white text-sm font-medium px-3 py-1 rounded-full">
                {currentAlternative.category}
              </span>
              <div className="flex space-x-2">
                <button
                  onClick={() => setIsBookmarked(!isBookmarked)}
                  className={`p-2 rounded-full transition-colors ${
                    isBookmarked ? 'bg-white bg-opacity-20' : 'hover:bg-white hover:bg-opacity-10'
                  }`}
                >
                  <Bookmark className={`w-5 h-5 ${isBookmarked ? 'fill-current' : ''}`} />
                </button>
                <button
                  onClick={handleShare}
                  className="p-2 rounded-full hover:bg-white hover:bg-opacity-10 transition-colors"
                >
                  <Share2 className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <h2 className="text-3xl font-bold mb-2">{currentAlternative.name}</h2>
            <p className="text-lg opacity-90 mb-4">{currentAlternative.description}</p>
            
            <div className="flex items-center space-x-6">
              <div className="flex items-center">
                <Star className="w-5 h-5 fill-current mr-1" />
                <span className="font-semibold">{currentAlternative.rating}/5</span>
              </div>
              <div className="font-semibold">{currentAlternative.pricing}</div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Why Today */}
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-orange-900 mb-2">🎯 Why we're featuring this today:</h3>
              <p className="text-orange-800">{currentAlternative.whyToday}</p>
            </div>

            {/* Similar To */}
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-3">Alternative to:</h3>
              <div className="flex flex-wrap gap-2">
                {currentAlternative.similarTo.map((tool) => (
                  <Link
                    key={tool}
                    href={`/search?q=${encodeURIComponent(tool)}`}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm transition-colors"
                  >
                    {tool}
                  </Link>
                ))}
              </div>
            </div>

            {/* Pros and Cons */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <h3 className="font-semibold text-green-700 mb-3 flex items-center">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Advantages
                </h3>
                <ul className="space-y-2">
                  {currentAlternative.pros.map((pro, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-green-500 mr-2 mt-1">•</span>
                      <span className="text-gray-700">{pro}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-red-700 mb-3 flex items-center">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Considerations
                </h3>
                <ul className="space-y-2">
                  {currentAlternative.cons.map((con, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-red-500 mr-2 mt-1">•</span>
                      <span className="text-gray-700">{con}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* CTA */}
            <div className="text-center">
              <a
                href={currentAlternative.website}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-orange-600 text-white px-8 py-3 rounded-lg hover:bg-orange-700 font-medium inline-block mr-4"
              >
                Try {currentAlternative.name}
              </a>
              <Link
                href={`/search?q=${encodeURIComponent(currentAlternative.name)}`}
                className="bg-gray-200 text-gray-800 px-8 py-3 rounded-lg hover:bg-gray-300 font-medium inline-block"
              >
                Find More Alternatives
              </Link>
            </div>
          </div>
        </div>

        {/* Newsletter Signup */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg p-8 text-white text-center">
          <h3 className="text-2xl font-bold mb-2">Never Miss a Daily Alternative</h3>
          <p className="mb-6 opacity-90">
            Get our daily alternative delivered to your inbox every morning
          </p>
          <Link
            href="/newsletter"
            className="bg-white text-indigo-600 px-6 py-3 rounded-lg hover:bg-gray-100 font-medium inline-block"
          >
            Subscribe to Newsletter
          </Link>
        </div>

        {/* Previous Alternatives */}
        <div className="mt-12">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Recent Daily Alternatives</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {dailyAlternatives.slice(1).map((alt, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded">
                    {alt.category}
                  </span>
                  <div className="flex items-center">
                    <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                    <span className="text-sm text-gray-600">{alt.rating}</span>
                  </div>
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">{alt.name}</h4>
                <p className="text-gray-600 text-sm mb-4">{alt.description}</p>
                <Link
                  href={`/search?q=${encodeURIComponent(alt.name)}`}
                  className="text-indigo-600 hover:text-indigo-700 text-sm font-medium"
                >
                  Learn More →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}