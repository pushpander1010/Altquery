import { NextResponse } from 'next/server'
import { CacheManager } from '../../../lib/cache-manager'
import { VercelCacheManager } from '../../../lib/vercel-cache'

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const isProduction = process.env.NODE_ENV === 'production'
    const cache = isProduction ? VercelCacheManager.getInstance() : CacheManager.getInstance()
    const stats = cache.getStats()

    return NextResponse.json({
      success: true,
      message: 'Cache statistics',
      stats,
      environment: process.env.NODE_ENV,
      cacheType: isProduction ? 'vercel-memory' : 'file-system',
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Cache stats error:', error)
    return NextResponse.json(
      { error: 'Failed to get cache statistics' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const { action } = await request.json()
    const isProduction = process.env.NODE_ENV === 'production'
    const cache = isProduction ? VercelCacheManager.getInstance() : CacheManager.getInstance()

    if (action === 'cleanup') {
      cache.cleanup()
      return NextResponse.json({
        success: true,
        message: 'Cache cleanup completed',
        environment: process.env.NODE_ENV
      })
    }

    if (action === 'export') {
      if (!isProduction) {
        // Only available in development with file system access
        (cache as CacheManager).exportToMainDatabase()
      }
      return NextResponse.json({
        success: true,
        message: isProduction ? 'Export not available in production' : 'Popular items exported to main database',
        environment: process.env.NODE_ENV
      })
    }

    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    )
  } catch (error) {
    console.error('Cache action error:', error)
    return NextResponse.json(
      { error: 'Failed to perform cache action' },
      { status: 500 }
    )
  }
}