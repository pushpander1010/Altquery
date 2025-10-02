import { notFound } from 'next/navigation'
import { Star, ExternalLink, DollarSign, CheckCircle, XCircle } from 'lucide-react'
import alternativesData from '../../../data/alternatives.json'

interface Alternative {
  name: string
  description: string
  pricing: string
  pros: string[]
  cons: string[]
  rating: number
  website: string
  affiliate: boolean
}

interface AlternativeGroup {
  id: string
  name: string
  category: string
  description: string
  alternatives: Alternative[]
}

export async function generateStaticParams() {
  return alternativesData.alternatives.map((alt) => ({
    slug: alt.id,
  }))
}

export default function AlternativePage({ params }: { params: { slug: string } }) {
  const alternativeGroup = alternativesData.alternatives.find(
    (alt: AlternativeGroup) => alt.id === params.slug
  )

  if (!alternativeGroup) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center">
            <a href="/" className="text-2xl font-bold text-indigo-600">AltQuery</a>
            <span className="ml-2 text-gray-500">/ {alternativeGroup.name} Alternatives</span>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <span className="bg-indigo-100 text-indigo-800 text-sm font-medium px-3 py-1 rounded">
              {alternativeGroup.category}
            </span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Best {alternativeGroup.name} Alternatives
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl">
            {alternativeGroup.description}. Here are the top alternatives with detailed comparisons.
          </p>
        </div>

        {/* Ad Space */}
        <div className="bg-gray-100 rounded-lg p-6 text-center mb-8">
          <div className="text-gray-500 text-sm mb-2">Advertisement</div>
          <div className="bg-white rounded border-2 border-dashed border-gray-300 p-6">
            <p className="text-gray-400">Google AdSense Banner (728x90)</p>
          </div>
        </div>

        {/* Alternatives List */}
        <div className="space-y-8">
          {alternativeGroup.alternatives.map((alternative, index) => (
            <div key={alternative.name} className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center mb-2">
                    <span className="bg-indigo-600 text-white text-sm font-bold px-2 py-1 rounded mr-3">
                      #{index + 1}
                    </span>
                    <h2 className="text-2xl font-bold text-gray-900">{alternative.name}</h2>
                    {alternative.affiliate && (
                      <span className="ml-2 bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                        Recommended
                      </span>
                    )}
                  </div>
                  <p className="text-gray-600 mb-3">{alternative.description}</p>
                  
                  {/* Rating */}
                  <div className="flex items-center mb-3">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.floor(alternative.rating)
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="ml-2 text-sm text-gray-600">
                      {alternative.rating}/5
                    </span>
                  </div>

                  {/* Pricing */}
                  <div className="flex items-center mb-4">
                    <DollarSign className="w-4 h-4 text-green-600 mr-1" />
                    <span className="text-green-600 font-semibold">{alternative.pricing}</span>
                  </div>
                </div>

                <a
                  href={alternative.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 flex items-center"
                >
                  Visit Site
                  <ExternalLink className="w-4 h-4 ml-2" />
                </a>
              </div>

              {/* Pros and Cons */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-green-700 mb-3 flex items-center">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Pros
                  </h3>
                  <ul className="space-y-2">
                    {alternative.pros.map((pro, i) => (
                      <li key={i} className="flex items-start">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-gray-700">{pro}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold text-red-700 mb-3 flex items-center">
                    <XCircle className="w-4 h-4 mr-2" />
                    Cons
                  </h3>
                  <ul className="space-y-2">
                    {alternative.cons.map((con, i) => (
                      <li key={i} className="flex items-start">
                        <XCircle className="w-4 h-4 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-gray-700">{con}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
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