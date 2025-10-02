import { NextResponse } from 'next/server'

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic'

export async function GET() {
  const status = {
    timestamp: new Date().toISOString(),
    providers: {
      perplexity: !!process.env.PERPLEXITY_API_KEY,
      gemini: !!process.env.GEMINI_API_KEY,
      openrouter: !!process.env.OPENROUTER_API_KEY,
      openai: !!process.env.OPENAI_API_KEY,
    },
    fallback: {
      available: true,
      alternatives_count: 5 // Number of products with fallback data
    }
  }

  return NextResponse.json({
    success: true,
    message: 'AltQuery API Status',
    ...status
  })
}