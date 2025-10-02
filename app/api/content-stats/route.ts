import { NextResponse } from 'next/server'
import { ContentFilter } from '../../../lib/content-filter'

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const contentFilter = ContentFilter.getInstance()
    const stats = contentFilter.getBlockedStats()

    return NextResponse.json({
      success: true,
      message: 'Content filtering statistics',
      stats,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Content stats error:', error)
    return NextResponse.json(
      { error: 'Failed to get content statistics' },
      { status: 500 }
    )
  }
}