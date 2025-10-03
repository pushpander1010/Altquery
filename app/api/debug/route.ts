import { NextResponse } from 'next/server'

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic'

export async function GET() {
  // Only allow debug in development environment
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json(
      { error: 'Debug endpoint not available in production' },
      { status: 404 }
    )
  }

  const apiStatus = {
    timestamp: new Date().toISOString(),
    environment: {
      NODE_ENV: process.env.NODE_ENV,
    },
    services: {
      perplexity: !!process.env.PERPLEXITY_API_KEY ? 'configured' : 'not configured',
      gemini: !!process.env.GEMINI_API_KEY ? 'configured' : 'not configured',
      openrouter: !!process.env.OPENROUTER_API_KEY ? 'configured' : 'not configured',
      openai: !!process.env.OPENAI_API_KEY ? 'configured' : 'not configured',
    }
  }

  return NextResponse.json({
    success: true,
    message: 'Debug information (development only)',
    ...apiStatus
  })
}