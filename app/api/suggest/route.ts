import { NextRequest, NextResponse } from 'next/server'
import { StorageOrchestrator } from '../../../lib/storage-orchestrator'
import { ContentFilter } from '../../../lib/content-filter'

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic'

// API Keys for different AI providers
const PERPLEXITY_API_KEY = process.env.PERPLEXITY_API_KEY
const GEMINI_API_KEY = process.env.GEMINI_API_KEY
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY
const OPENAI_API_KEY = process.env.OPENAI_API_KEY

interface Alternative {
  name: string
  description: string
  pricing: string
  pros: string[]
  cons: string[]
  rating: number
  website: string
  category: string
}

// Fallback alternatives database for common tools
const fallbackAlternatives: Record<string, Alternative[]> = {
  'photoshop': [
    {
      name: 'GIMP',
      description: 'Free and open-source image editor',
      pricing: 'Free',
      pros: ['Completely free', 'Open source', 'Powerful features'],
      cons: ['Steep learning curve', 'Different UI paradigm'],
      rating: 4.2,
      website: 'https://gimp.org',
      category: 'Design'
    },
    {
      name: 'Canva',
      description: 'Online design and publishing tool',
      pricing: 'Free / $12.99/month',
      pros: ['Easy to use', 'Templates', 'Web-based'],
      cons: ['Limited advanced features', 'Subscription model'],
      rating: 4.4,
      website: 'https://canva.com',
      category: 'Design'
    }
  ],
  'notion': [
    {
      name: 'Obsidian',
      description: 'Powerful knowledge base with local files',
      pricing: 'Free / $50/year',
      pros: ['Local files', 'Powerful linking', 'Plugin ecosystem'],
      cons: ['Steep learning curve', 'No real-time collaboration'],
      rating: 4.5,
      website: 'https://obsidian.md',
      category: 'Productivity'
    }
  ]
}

async function generateWithPerplexity(productName: string): Promise<Alternative[]> {
  if (!PERPLEXITY_API_KEY) {
    throw new Error('Perplexity API key not configured')
  }

  const prompt = `Generate 4-6 alternatives to "${productName}". For each alternative, provide:
- name: The product name
- description: Brief description (max 100 chars)
- pricing: Pricing model (e.g., "Free", "$10/month", "Free / $5/month")
- pros: Array of 3 advantages
- cons: Array of 2-3 disadvantages  
- rating: Rating out of 5 (realistic, between 3.8-4.8)
- website: Official website URL (use real URLs)
- category: Category (e.g., "Design", "Productivity", "Communication")

Return valid JSON array only, no markdown or explanation.`

  try {
    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${PERPLEXITY_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.1-sonar-large-128k-online',
        messages: [
          {
            role: 'system',
            content: 'You are an expert software analyst with access to current information. Generate accurate, realistic alternatives to software products using your knowledge of the current market.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 1500,
        temperature: 0.7,
      }),
    })

    const data = await response.json()
    const content = data.choices[0]?.message?.content

    if (!content) {
      throw new Error('No content received from Perplexity')
    }

    // Parse the JSON response
    const alternatives = JSON.parse(content)
    return alternatives
  } catch (error) {
    console.error('Perplexity API request failed')
    throw new Error('AI service temporarily unavailable')
  }
}

async function generateWithGemini(productName: string): Promise<Alternative[]> {
  if (!GEMINI_API_KEY) {
    throw new Error('Gemini API key not configured')
  }

  const prompt = `Generate 4-6 alternatives to "${productName}". For each alternative, provide:
- name: The product name
- description: Brief description (max 100 chars)
- pricing: Pricing model (e.g., "Free", "$10/month", "Free / $5/month")
- pros: Array of 3 advantages
- cons: Array of 2-3 disadvantages  
- rating: Rating out of 5 (realistic, between 3.8-4.8)
- website: Official website URL (use real URLs)
- category: Category (e.g., "Design", "Productivity", "Communication")

Return valid JSON array only, no markdown or explanation.`

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `You are an expert software analyst. ${prompt}`
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 1500,
        }
      }),
    })

    const data = await response.json()
    const content = data.candidates?.[0]?.content?.parts?.[0]?.text

    if (!content) {
      throw new Error('No content received from Gemini')
    }

    // Parse the JSON response
    const alternatives = JSON.parse(content)
    return alternatives
  } catch (error) {
    console.error('Gemini API request failed')
    throw new Error('AI service temporarily unavailable')
  }
}

async function generateWithOpenRouter(productName: string): Promise<Alternative[]> {
  if (!OPENROUTER_API_KEY) {
    throw new Error('OpenRouter API key not configured')
  }

  const prompt = `Generate 4-6 alternatives to "${productName}". For each alternative, provide:
- name: The product name
- description: Brief description (max 100 chars)
- pricing: Pricing model (e.g., "Free", "$10/month", "Free / $5/month")
- pros: Array of 3 advantages
- cons: Array of 2-3 disadvantages  
- rating: Rating out of 5 (realistic, between 3.8-4.8)
- website: Official website URL (use real URLs)
- category: Category (e.g., "Design", "Productivity", "Communication")

Return valid JSON array only, no markdown or explanation.`

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://altquery.com',
        'X-Title': 'AltQuery Alternative Finder',
      },
      body: JSON.stringify({
        model: 'anthropic/claude-3.5-sonnet', // High-quality model
        messages: [
          {
            role: 'system',
            content: 'You are an expert software analyst. Generate accurate, realistic alternatives to software products.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 1500,
        temperature: 0.7,
      }),
    })

    const data = await response.json()
    const content = data.choices[0]?.message?.content

    if (!content) {
      throw new Error('No content received from OpenRouter')
    }

    // Parse the JSON response
    const alternatives = JSON.parse(content)
    return alternatives
  } catch (error) {
    console.error('OpenRouter API request failed')
    throw new Error('AI service temporarily unavailable')
  }
}

async function generateWithOpenAI(productName: string): Promise<Alternative[]> {
  if (!OPENAI_API_KEY) {
    throw new Error('OpenAI API key not configured')
  }

  const prompt = `Generate 4-6 alternatives to "${productName}". For each alternative, provide:
- name: The product name
- description: Brief description (max 100 chars)
- pricing: Pricing model (e.g., "Free", "$10/month", "Free / $5/month")
- pros: Array of 3 advantages
- cons: Array of 2-3 disadvantages  
- rating: Rating out of 5 (realistic, between 3.8-4.8)
- website: Official website URL (use real URLs)
- category: Category (e.g., "Design", "Productivity", "Communication")

Return valid JSON array only, no markdown or explanation.`

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are an expert software analyst. Generate accurate, realistic alternatives to software products.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 1500,
        temperature: 0.7,
      }),
    })

    const data = await response.json()
    const content = data.choices[0]?.message?.content

    if (!content) {
      throw new Error('No content received from OpenAI')
    }

    // Parse the JSON response
    const alternatives = JSON.parse(content)
    return alternatives
  } catch (error) {
    console.error('OpenAI API request failed')
    throw new Error('AI service temporarily unavailable')
  }
}



async function generateAlternatives(productName: string): Promise<Alternative[]> {
  const normalizedName = productName.toLowerCase().trim()
  const storage = StorageOrchestrator.getInstance()
  
  // First, check intelligent storage for cached results
  const cachedResult = await storage.get(productName)
  if (cachedResult) {
    return cachedResult.alternatives || cachedResult
  }
  
  // Second, check if we have fallback data
  if (fallbackAlternatives[normalizedName]) {
    // Cache the fallback data for faster future access
    await storage.set(productName, {
      alternatives: fallbackAlternatives[normalizedName],
      source: 'manual',
      timestamp: new Date().toISOString()
    })
    return fallbackAlternatives[normalizedName]
  }

  // Try AI providers in order of preference
  const providers = [
    { name: 'Perplexity', fn: generateWithPerplexity, key: PERPLEXITY_API_KEY },
    { name: 'Gemini', fn: generateWithGemini, key: GEMINI_API_KEY },
    { name: 'OpenRouter', fn: generateWithOpenRouter, key: OPENROUTER_API_KEY },
    { name: 'OpenAI', fn: generateWithOpenAI, key: OPENAI_API_KEY },
  ]

  for (const provider of providers) {
    if (provider.key) {
      try {
        const result = await provider.fn(productName)
        
        // Cache the AI result for future use
        await storage.set(productName, {
          alternatives: result,
          source: 'ai',
          timestamp: new Date().toISOString(),
          provider: provider.name
        })
        
        return result
      } catch (error) {
        // Log error without exposing sensitive information
        console.error(`AI provider failed for query: ${productName}`)
        // Continue to next provider
      }
    }
  }

  // If all AI providers fail, use basic alternatives
  const basicResult = generateBasicAlternatives(productName)
  
  // Don't cache the "No AI Available" message
  if (basicResult[0]?.name !== 'No AI Available') {
    await storage.set(productName, {
      alternatives: basicResult,
      source: 'manual',
      timestamp: new Date().toISOString()
    })
  }
  
  return basicResult
}

function generateBasicAlternatives(productName: string): Alternative[] {
  // Enhanced fallback with real alternatives for common software
  const normalizedName = productName.toLowerCase().trim()
  
  // Common software alternatives database
  const commonAlternatives: Record<string, Alternative[]> = {
    'azar': [
      {
        name: 'Chatroulette',
        description: 'Random video chat platform',
        pricing: 'Free',
        pros: ['Free to use', 'Large user base', 'Simple interface'],
        cons: ['Privacy concerns', 'Inappropriate content risk'],
        rating: 3.2,
        website: 'https://chatroulette.com',
        category: 'Communication'
      },
      {
        name: 'Omegle',
        description: 'Anonymous chat with strangers',
        pricing: 'Free',
        pros: ['Anonymous chatting', 'Text and video options', 'No registration'],
        cons: ['Safety concerns', 'Moderation issues'],
        rating: 3.0,
        website: 'https://omegle.com',
        category: 'Communication'
      }
    ],
    'discord': [
      {
        name: 'Slack',
        description: 'Team communication platform',
        pricing: 'Free / $7.25/month',
        pros: ['Professional features', 'Great integrations', 'File sharing'],
        cons: ['Can be expensive', 'Learning curve for advanced features'],
        rating: 4.4,
        website: 'https://slack.com',
        category: 'Communication'
      },
      {
        name: 'Microsoft Teams',
        description: 'Unified communication platform',
        pricing: 'Free / $4/month',
        pros: ['Office integration', 'Video conferencing', 'Enterprise features'],
        cons: ['Can be slow', 'Complex interface'],
        rating: 4.0,
        website: 'https://teams.microsoft.com',
        category: 'Communication'
      }
    ],
    'whatsapp': [
      {
        name: 'Telegram',
        description: 'Cloud-based messaging app',
        pricing: 'Free',
        pros: ['Privacy focused', 'Large file sharing', 'Cross-platform'],
        cons: ['Less mainstream', 'Interface complexity'],
        rating: 4.3,
        website: 'https://telegram.org',
        category: 'Communication'
      },
      {
        name: 'Signal',
        description: 'Privacy-focused messaging',
        pricing: 'Free',
        pros: ['End-to-end encryption', 'Open source', 'Privacy focused'],
        cons: ['Smaller user base', 'Limited features'],
        rating: 4.5,
        website: 'https://signal.org',
        category: 'Communication'
      }
    ],
    'bumble': [
      {
        name: 'Tinder',
        description: 'Popular dating app with swipe feature',
        pricing: 'Free / $9.99/month',
        pros: ['Large user base', 'Simple interface', 'Location-based'],
        cons: ['Superficial matching', 'Premium features cost extra'],
        rating: 3.8,
        website: 'https://tinder.com',
        category: 'Dating'
      },
      {
        name: 'Hinge',
        description: 'Dating app designed to be deleted',
        pricing: 'Free / $19.99/month',
        pros: ['Relationship-focused', 'Detailed profiles', 'Conversation starters'],
        cons: ['Smaller user base', 'Limited free features'],
        rating: 4.2,
        website: 'https://hinge.co',
        category: 'Dating'
      },
      {
        name: 'Coffee Meets Bagel',
        description: 'Curated dating with quality matches',
        pricing: 'Free / $34.99/month',
        pros: ['Quality over quantity', 'Less overwhelming', 'Detailed profiles'],
        cons: ['Limited daily matches', 'Expensive premium'],
        rating: 3.9,
        website: 'https://coffeemeetsbagel.com',
        category: 'Dating'
      }
    ],
    'tinder': [
      {
        name: 'Bumble',
        description: 'Women-first dating app',
        pricing: 'Free / $22.99/month',
        pros: ['Women make first move', 'Also has BFF/Bizz modes', 'Good safety features'],
        cons: ['24-hour message limit', 'Premium features expensive'],
        rating: 4.1,
        website: 'https://bumble.com',
        category: 'Dating'
      },
      {
        name: 'OkCupid',
        description: 'Dating app with detailed compatibility',
        pricing: 'Free / $24.90/month',
        pros: ['Detailed matching algorithm', 'Inclusive options', 'Free messaging'],
        cons: ['Can be overwhelming', 'Interface feels dated'],
        rating: 3.7,
        website: 'https://okcupid.com',
        category: 'Dating'
      }
    ]
  }

  // Check if we have specific alternatives for this software
  if (commonAlternatives[normalizedName]) {
    return commonAlternatives[normalizedName]
  }

  // If no specific alternatives, return a helpful message
  return [
    {
      name: 'No AI Available',
      description: `No alternatives found for ${productName} in our database`,
      pricing: 'Not Available',
      pros: ['Submit alternatives to help the community', 'Browse categories for similar software', 'Check trending alternatives'],
      cons: ['Limited database coverage', 'Manual curation needed'],
      rating: 0,
      website: '/submit',
      category: 'Not Found'
    }
  ]
}

function detectCategory(productName: string): string {
  const name = productName.toLowerCase()
  
  if (name.includes('photo') || name.includes('design') || name.includes('figma')) return 'Design'
  if (name.includes('chat') || name.includes('slack') || name.includes('discord')) return 'Communication'
  if (name.includes('note') || name.includes('notion') || name.includes('task')) return 'Productivity'
  if (name.includes('code') || name.includes('dev') || name.includes('git')) return 'Development'
  if (name.includes('video') || name.includes('zoom') || name.includes('meet')) return 'Communication'
  
  return 'Software'
}

export async function POST(request: NextRequest) {
  try {
    // Add timeout to prevent hanging requests
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Request timeout')), 30000) // 30 second timeout
    })

    const requestPromise = request.json()
    const body = await Promise.race([requestPromise, timeoutPromise]) as { productName: string }

    if (!body.productName || typeof body.productName !== 'string') {
      return NextResponse.json(
        { error: 'Product name is required' },
        { status: 400 }
      )
    }

    // Input validation and sanitization
    const productName = body.productName.trim()
    if (productName.length === 0) {
      return NextResponse.json(
        { error: 'Product name cannot be empty' },
        { status: 400 }
      )
    }

    if (productName.length > 100) {
      return NextResponse.json(
        { error: 'Product name too long (max 100 characters)' },
        { status: 400 }
      )
    }

    // Basic sanitization - remove potentially harmful characters
    const sanitizedProductName = productName.replace(/[<>\"'&]/g, '')

    // Content filtering
    const contentFilter = ContentFilter.getInstance()
    const filterResult = contentFilter.checkContent(sanitizedProductName)
    
    if (!filterResult.allowed) {
      return NextResponse.json({
        success: false,
        blocked: true,
        category: filterResult.category,
        message: filterResult.message,
        alternatives: filterResult.alternatives,
        productName: sanitizedProductName,
        timestamp: new Date().toISOString()
      }, { status: 400 })
    }

    const alternatives = await generateAlternatives(sanitizedProductName)

    return NextResponse.json({
      success: true,
      productName: sanitizedProductName,
      alternatives,
      generated: true,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('API error occurred')
    return NextResponse.json(
      { 
        error: 'Failed to generate alternatives',
        message: 'Unable to process your request at this time. Please try again later.'
      },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const productName = searchParams.get('q')

  if (!productName) {
    return NextResponse.json(
      { error: 'Product name query parameter is required' },
      { status: 400 }
    )
  }

  // Input validation and sanitization for GET request
  const sanitizedProductName = productName.trim().replace(/[<>\"'&]/g, '')
  if (sanitizedProductName.length === 0 || sanitizedProductName.length > 100) {
    return NextResponse.json(
      { error: 'Invalid product name' },
      { status: 400 }
    )
  }

  try {
    const alternatives = await generateAlternatives(sanitizedProductName)

    return NextResponse.json({
      success: true,
      productName: sanitizedProductName,
      alternatives,
      generated: true,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('API error occurred')
    return NextResponse.json(
      { 
        error: 'Failed to generate alternatives',
        message: 'Unable to process your request at this time. Please try again later.'
      },
      { status: 500 }
    )
  }
}