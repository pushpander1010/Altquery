'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Mail, CheckCircle, TrendingUp, Zap, Users, Gift } from 'lucide-react'

export default function NewsletterPage() {
  const [email, setEmail] = useState('')
  const [interests, setInterests] = useState<string[]>([])
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const interestOptions = [
    'Design Tools', 'Productivity Apps', 'Development Tools', 'Communication Software',
    'Marketing Tools', 'AI & Machine Learning', 'Business Software', 'Creative Tools'
  ]

  const toggleInterest = (interest: string) => {
    setInterests(prev => 
      prev.includes(interest) 
        ? prev.filter(i => i !== interest)
        : [...prev, interest]
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    setIsLoading(true)
    
    // Simulate API call
    setTimeout(() => {
      setIsSubscribed(true)
      setIsLoading(false)
    }, 1500)
  }

  if (isSubscribed) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="max-w-md w-full mx-4">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome to AltQuery!</h2>
            <p className="text-gray-600 mb-6">
              You're now subscribed to our newsletter. Check your email for a welcome message with exclusive content!
            </p>
            <div className="space-y-3">
              <Link
                href="/"
                className="block bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700"
              >
                Back to Home
              </Link>
              <Link
                href="/trending"
                className="block bg-gray-100 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-200"
              >
                Explore Trending
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-indigo-600">AltQuery</Link>
            <span className="ml-2 text-gray-500">/ Newsletter</span>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Mail className="w-8 h-8 text-indigo-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Stay Ahead of the Curve
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Get the latest alternative software discoveries, exclusive reviews, and insider tips delivered to your inbox weekly.
          </p>
        </div>

        {/* Benefits */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Weekly Discoveries</h3>
            <p className="text-gray-600 text-sm">
              Be the first to know about new alternatives and hidden gems in the software world.
            </p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Zap className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Exclusive Content</h3>
            <p className="text-gray-600 text-sm">
              In-depth comparisons, expert reviews, and content not available on the website.
            </p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Gift className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Special Offers</h3>
            <p className="text-gray-600 text-sm">
              Exclusive discounts and deals from our partner software companies.
            </p>
          </div>
        </div>

        {/* Subscription Form */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address *
              </label>
              <input
                type="email"
                id="email"
                required
                className="w-full px-4 py-3 text-gray-900 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                What interests you most? (Optional)
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {interestOptions.map((interest) => (
                  <button
                    key={interest}
                    type="button"
                    onClick={() => toggleInterest(interest)}
                    className={`p-3 text-sm rounded-lg border transition-colors ${
                      interests.includes(interest)
                        ? 'bg-indigo-50 border-indigo-300 text-indigo-700'
                        : 'bg-gray-50 border-gray-300 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {interest}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || !email}
              className={`w-full py-3 px-6 rounded-lg font-medium transition-colors ${
                isLoading || !email
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-indigo-600 text-white hover:bg-indigo-700'
              }`}
            >
              {isLoading ? 'Subscribing...' : 'Subscribe to Newsletter'}
            </button>
          </form>

          <p className="text-xs text-gray-500 mt-4 text-center">
            We respect your privacy. Unsubscribe at any time. No spam, ever.
          </p>
        </div>

        {/* Social Proof */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg p-8 text-white text-center">
          <div className="flex items-center justify-center mb-4">
            <Users className="w-6 h-6 mr-2" />
            <span className="text-lg font-semibold">Join 12,000+ subscribers</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm opacity-90">
            <div>
              <div className="text-2xl font-bold">12,000+</div>
              <div>Active Subscribers</div>
            </div>
            <div>
              <div className="text-2xl font-bold">4.8★</div>
              <div>Average Rating</div>
            </div>
            <div>
              <div className="text-2xl font-bold">Weekly</div>
              <div>Fresh Content</div>
            </div>
          </div>
        </div>

        {/* Sample Newsletter Preview */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">What You'll Get</h2>
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="border-l-4 border-indigo-500 pl-4 mb-4">
              <h3 className="font-semibold text-gray-900">🔥 This Week's Hot Alternatives</h3>
              <p className="text-sm text-gray-600">Discover 3 trending alternatives that are gaining popularity</p>
            </div>
            <div className="border-l-4 border-purple-500 pl-4 mb-4">
              <h3 className="font-semibold text-gray-900">💡 Expert Spotlight</h3>
              <p className="text-sm text-gray-600">In-depth review of a game-changing alternative</p>
            </div>
            <div className="border-l-4 border-green-500 pl-4 mb-4">
              <h3 className="font-semibold text-gray-900">💰 Deal of the Week</h3>
              <p className="text-sm text-gray-600">Exclusive discount on premium software alternatives</p>
            </div>
            <div className="border-l-4 border-blue-500 pl-4">
              <h3 className="font-semibold text-gray-900">🎯 Reader's Choice</h3>
              <p className="text-sm text-gray-600">Community-voted best alternative of the month</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}