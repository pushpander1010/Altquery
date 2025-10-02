import { NextResponse } from 'next/server'

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic'

export async function GET() {
  const apiStatus = {
    timestamp: new Date().toISOString(),
    environment: {
      NODE_ENV: process.env.NODE_ENV,
      hasPerplexity: !!process.env.PERPLEXITY_API_KEY,
      hasGemini: !!process.env.GEMINI_API_KEY,
      hasOpenRouter: !!process.env.OPENROUTER_API_KEY,
      hasOpenAI: !!process.env.OPENAI_API_KEY,
    },
    apiKeys: {
      perplexity: process.env.PERPLEXITY_API_KEY ? `${process.env.PERPLEXITY_API_KEY.substring(0, 10)}...` : 'Not set',
      gemini: process.env.GEMINI_API_KEY ? `${process.env.GEMINI_API_KEY.substring(0, 10)}...` : 'Not set',
      openrouter: process.env.OPENROUTER_API_KEY ? `${process.env.OPENROUTER_API_KEY.substring(0, 10)}...` : 'Not set',
      openai: process.env.OPENAI_API_KEY ? `${process.env.OPENAI_API_KEY.substring(0, 10)}...` : 'Not set',
    }
  }

  return NextResponse.json({
    success: true,
    message: 'Debug information',
    ...apiStatus
  })
}