import Link from 'next/link'
import { Folder, TrendingUp } from 'lucide-react'

const categories = [
  {
    name: 'Productivity',
    slug: 'productivity',
    description: 'Tools for getting things done',
    count: 45,
    alternatives: ['Notion', 'Todoist', 'Trello', 'Asana']
  },
  {
    name: 'Design',
    slug: 'design',
    description: 'Creative and design software',
    count: 32,
    alternatives: ['Figma', 'Photoshop', 'Sketch', 'Canva']
  },
  {
    name: 'Development',
    slug: 'development',
    description: 'Developer tools and IDEs',
    count: 28,
    alternatives: ['VS Code', 'GitHub', 'Postman', 'Docker']
  },
  {
    name: 'Communication',
    slug: 'communication',
    description: 'Team chat and collaboration',
    count: 22,
    alternatives: ['Slack', 'Discord', 'Zoom', 'Teams']
  },
  {
    name: 'Marketing',
    slug: 'marketing',
    description: 'Marketing and analytics tools',
    count: 18,
    alternatives: ['Mailchimp', 'HubSpot', 'Buffer', 'Hootsuite']
  },
  {
    name: 'Finance',
    slug: 'finance',
    description: 'Accounting and finance software',
    count: 15,
    alternatives: ['QuickBooks', 'Xero', 'FreshBooks', 'Wave']
  }
]

export default function CategoriesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Link href="/" className="text-2xl font-bold text-indigo-600">AltQuery</Link>
              <span className="ml-2 text-gray-500">/ Categories</span>
            </div>
            <nav className="hidden md:flex space-x-8">
              <Link href="/categories" className="text-indigo-600 font-medium">Categories</Link>
              <Link href="/trending" className="text-gray-600 hover:text-indigo-600">Trending</Link>
              <Link href="/submit" className="text-gray-600 hover:text-indigo-600">Submit</Link>
            </nav>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Browse by Category</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Explore alternatives organized by category to find exactly what you need.
          </p>
        </div>

        {/* Ad Space */}
        <div className="bg-gray-100 rounded-lg p-6 text-center mb-8">
          <div className="text-gray-500 text-sm mb-2">Advertisement</div>
          <div className="bg-white rounded border-2 border-dashed border-gray-300 p-6">
            <p className="text-gray-400">Google AdSense Banner (728x90)</p>
          </div>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <Link
              key={category.slug}
              href={`/category/${category.slug}`}
              className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-6 border"
            >
              <div className="flex items-center mb-4">
                <div className="bg-indigo-100 p-3 rounded-lg">
                  <Folder className="w-6 h-6 text-indigo-600" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-gray-900">{category.name}</h3>
                  <p className="text-sm text-gray-500">{category.count} alternatives</p>
                </div>
              </div>
              
              <p className="text-gray-600 mb-4">{category.description}</p>
              
              <div className="flex flex-wrap gap-2">
                {category.alternatives.slice(0, 3).map((alt) => (
                  <span key={alt} className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
                    {alt}
                  </span>
                ))}
                <span className="bg-indigo-100 text-indigo-700 text-xs px-2 py-1 rounded">
                  +{category.count - 3} more
                </span>
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