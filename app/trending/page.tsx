import Link from 'next/link'
import { TrendingUp, Star, Users, Clock } from 'lucide-react'

const trendingAlternatives = [
  {
    id: 'notion-alternatives',
    name: 'Notion Alternatives',
    category: 'Productivity',
    views: '12.5K',
    growth: '+45%',
    rating: 4.6,
    description: 'All-in-one workspace alternatives gaining massive popularity',
    trending_reason: 'Remote work boom'
  },
  {
    id: 'figma-alternatives',
    name: 'Figma Alternatives',
    category: 'Design',
    views: '8.2K',
    growth: '+38%',
    rating: 4.4,
    description: 'Design tools competing with Figma\'s dominance',
    trending_reason: 'Adobe acquisition concerns'
  },
  {
    id: 'twitter-alternatives',
    name: 'Twitter Alternatives',
    category: 'Social Media',
    views: '15.8K',
    growth: '+125%',
    rating: 4.2,
    description: 'Social platforms as Twitter alternatives',
    trending_reason: 'Platform changes'
  },
  {
    id: 'chatgpt-alternatives',
    name: 'ChatGPT Alternatives',
    category: 'AI',
    views: '22.1K',
    growth: '+89%',
    rating: 4.5,
    description: 'AI chatbots and language models',
    trending_reason: 'AI revolution'
  },
  {
    id: 'zoom-alternatives',
    name: 'Zoom Alternatives',
    category: 'Communication',
    views: '6.7K',
    growth: '+28%',
    rating: 4.3,
    description: 'Video conferencing solutions',
    trending_reason: 'Hybrid work needs'
  },
  {
    id: 'photoshop-alternatives',
    name: 'Photoshop Alternatives',
    category: 'Design',
    views: '9.4K',
    growth: '+32%',
    rating: 4.1,
    description: 'Image editing software alternatives',
    trending_reason: 'Subscription fatigue'
  }
]

export default function TrendingPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Link href="/" className="text-2xl font-bold text-indigo-600">AltQuery</Link>
              <span className="ml-2 text-gray-500">/ Trending</span>
            </div>
            <nav className="hidden md:flex space-x-8">
              <Link href="/categories" className="text-gray-600 hover:text-indigo-600">Categories</Link>
              <Link href="/trending" className="text-indigo-600 font-medium">Trending</Link>
              <Link href="/submit" className="text-gray-600 hover:text-indigo-600">Submit</Link>
            </nav>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <TrendingUp className="w-8 h-8 text-indigo-600 mr-3" />
            <h1 className="text-4xl font-bold text-gray-900">Trending Alternatives</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover the most popular alternatives people are searching for right now.
          </p>
        </div>

        {/* Stats Bar */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-2xl font-bold text-indigo-600">50K+</div>
              <div className="text-sm text-gray-600">Monthly Searches</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">+67%</div>
              <div className="text-sm text-gray-600">Growth This Month</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-600">24</div>
              <div className="text-sm text-gray-600">Trending Categories</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-orange-600">4.5★</div>
              <div className="text-sm text-gray-600">Average Rating</div>
            </div>
          </div>
        </div>

        {/* Ad Space */}
        <div className="bg-gray-100 rounded-lg p-6 text-center mb-8">
          <div className="text-gray-500 text-sm mb-2">Advertisement</div>
          <div className="bg-white rounded border-2 border-dashed border-gray-300 p-6">
            <p className="text-gray-400">Google AdSense Banner (728x90)</p>
          </div>
        </div>

        {/* Trending List */}
        <div className="space-y-6">
          {trendingAlternatives.map((item, index) => (
            <Link
              key={item.id}
              href={`/alternatives/${item.id}`}
              className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-6 border block"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  {/* Rank */}
                  <div className="flex-shrink-0">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white ${
                      index === 0 ? 'bg-yellow-500' : 
                      index === 1 ? 'bg-gray-400' : 
                      index === 2 ? 'bg-orange-600' : 'bg-indigo-600'
                    }`}>
                      {index + 1}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <h3 className="text-xl font-semibold text-gray-900 mr-3">{item.name}</h3>
                      <span className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-0.5 rounded">
                        {item.category}
                      </span>
                      {index < 3 && (
                        <span className="ml-2 bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded">
                          🔥 Hot
                        </span>
                      )}
                    </div>
                    
                    <p className="text-gray-600 mb-3">{item.description}</p>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center">
                        <Users className="w-4 h-4 mr-1" />
                        {item.views} views
                      </div>
                      <div className="flex items-center">
                        <TrendingUp className="w-4 h-4 mr-1 text-green-500" />
                        {item.growth}
                      </div>
                      <div className="flex items-center">
                        <Star className="w-4 h-4 mr-1 text-yellow-500" />
                        {item.rating}
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {item.trending_reason}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Growth Indicator */}
                <div className="flex-shrink-0">
                  <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                    {item.growth}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Bottom Ad */}
        <div className="bg-gray-100 rounded-lg p-6 text-center mt-12">
          <div className="text-gray-500 text-sm mb-2">Advertisement</div>
          <div className="bg-white rounded border-2 border-dashed border-gray-300 p-8">
            <p className="text-gray-400">Google AdSense Rectangle (300x250)</p>
          </div>
        </div>
      </div>
    </div>
  )
}