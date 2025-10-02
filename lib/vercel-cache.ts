// Vercel-compatible caching using KV storage or external services

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

interface CacheEntry {
  alternatives: Alternative[]
  timestamp: string
  source: 'ai' | 'manual'
  searchCount: number
  lastAccessed: string
}

// Option 1: In-memory cache (resets on function restart)
const memoryCache = new Map<string, CacheEntry>()

// Option 2: Use Vercel KV (requires upgrade to Pro)
// import { kv } from '@vercel/kv'

export class VercelCacheManager {
  private static instance: VercelCacheManager

  private constructor() {}

  public static getInstance(): VercelCacheManager {
    if (!VercelCacheManager.instance) {
      VercelCacheManager.instance = new VercelCacheManager()
    }
    return VercelCacheManager.instance
  }

  // In-memory caching (works on free tier)
  public async get(productName: string): Promise<Alternative[] | null> {
    const normalizedName = productName.toLowerCase().trim()
    const entry = memoryCache.get(normalizedName)
    
    if (entry) {
      // Update access statistics
      entry.searchCount += 1
      entry.lastAccessed = new Date().toISOString()
      memoryCache.set(normalizedName, entry)
      
      console.log(`Memory cache HIT for: ${productName} (searched ${entry.searchCount} times)`)
      return entry.alternatives
    }
    
    console.log(`Memory cache MISS for: ${productName}`)
    return null
  }

  public async set(productName: string, alternatives: Alternative[], source: 'ai' | 'manual' = 'ai'): Promise<void> {
    const normalizedName = productName.toLowerCase().trim()
    
    // Don't cache if alternatives are empty or contain setup messages
    if (!alternatives || alternatives.length === 0 || 
        alternatives[0]?.name === 'No AI Available') {
      return
    }

    const entry: CacheEntry = {
      alternatives,
      timestamp: new Date().toISOString(),
      source,
      searchCount: 1,
      lastAccessed: new Date().toISOString()
    }

    memoryCache.set(normalizedName, entry)
    console.log(`Cached ${alternatives.length} alternatives for: ${productName} in memory`)

    // Optional: Also save to external service for persistence
    await this.saveToExternalService(normalizedName, entry)
  }

  private async saveToExternalService(key: string, entry: CacheEntry): Promise<void> {
    // Option 1: Save to GitHub as a file (free but slow)
    // Option 2: Save to external database (Supabase, PlanetScale free tiers)
    // Option 3: Save to Vercel KV (requires Pro plan)
    
    try {
      // Example: Save to a simple external API or webhook
      // This is just a placeholder - you'd implement your preferred storage
      console.log(`Would save ${key} to external service`)
    } catch (error) {
      console.error('Failed to save to external service:', error)
    }
  }

  public getStats(): {
    totalEntries: number
    aiGenerated: number
    manual: number
    mostSearched: Array<{ name: string; count: number }>
  } {
    const entries = Array.from(memoryCache.entries())
    const aiGenerated = entries.filter(([_, entry]) => entry.source === 'ai').length
    const manual = entries.filter(([_, entry]) => entry.source === 'manual').length
    
    const mostSearched = entries
      .map(([name, entry]) => ({ name, count: entry.searchCount }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10)

    return {
      totalEntries: entries.length,
      aiGenerated,
      manual,
      mostSearched
    }
  }

  public cleanup(maxAge: number = 30 * 24 * 60 * 60 * 1000): void {
    const now = new Date().getTime()
    let removedCount = 0

    const cacheEntries = Array.from(memoryCache.entries())
    for (const [key, entry] of cacheEntries) {
      const entryAge = now - new Date(entry.timestamp).getTime()
      
      if (entryAge > maxAge && entry.searchCount < 2) {
        memoryCache.delete(key)
        removedCount++
      }
    }

    if (removedCount > 0) {
      console.log(`Cleaned up ${removedCount} old memory cache entries`)
    }
  }
}