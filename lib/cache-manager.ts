import fs from 'fs'
import path from 'path'

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

interface CacheData {
  cache: Record<string, CacheEntry>
  metadata: {
    created: string
    lastUpdated: string
    totalEntries: number
    version: string
  }
}

const CACHE_FILE_PATH = path.join(process.cwd(), 'data', 'ai-cache.json')

export class CacheManager {
  private static instance: CacheManager
  private cacheData: CacheData = {
    cache: {},
    metadata: {
      created: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
      totalEntries: 0,
      version: '1.0'
    }
  }

  private constructor() {
    this.loadCache()
  }

  public static getInstance(): CacheManager {
    if (!CacheManager.instance) {
      CacheManager.instance = new CacheManager()
    }
    return CacheManager.instance
  }

  private loadCache(): void {
    try {
      if (fs.existsSync(CACHE_FILE_PATH)) {
        const fileContent = fs.readFileSync(CACHE_FILE_PATH, 'utf-8')
        this.cacheData = JSON.parse(fileContent)
      } else {
        this.cacheData = {
          cache: {},
          metadata: {
            created: new Date().toISOString(),
            lastUpdated: new Date().toISOString(),
            totalEntries: 0,
            version: '1.0'
          }
        }
        this.saveCache()
      }
    } catch (error) {
      console.error('Error loading cache:', error)
      this.cacheData = {
        cache: {},
        metadata: {
          created: new Date().toISOString(),
          lastUpdated: new Date().toISOString(),
          totalEntries: 0,
          version: '1.0'
        }
      }
    }
  }

  private saveCache(): void {
    try {
      // Ensure directory exists
      const dir = path.dirname(CACHE_FILE_PATH)
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true })
      }

      // Update metadata
      this.cacheData.metadata.lastUpdated = new Date().toISOString()
      this.cacheData.metadata.totalEntries = Object.keys(this.cacheData.cache).length

      // Write to file
      fs.writeFileSync(CACHE_FILE_PATH, JSON.stringify(this.cacheData, null, 2))
    } catch (error) {
      console.error('Error saving cache:', error)
    }
  }

  public get(productName: string): Alternative[] | null {
    const normalizedName = productName.toLowerCase().trim()
    const entry = this.cacheData.cache[normalizedName]
    
    if (entry) {
      // Update access statistics
      entry.searchCount += 1
      entry.lastAccessed = new Date().toISOString()
      this.saveCache()
      
      console.log(`Cache HIT for: ${productName} (searched ${entry.searchCount} times)`)
      return entry.alternatives
    }
    
    console.log(`Cache MISS for: ${productName}`)
    return null
  }

  public set(productName: string, alternatives: Alternative[], source: 'ai' | 'manual' = 'ai'): void {
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

    this.cacheData.cache[normalizedName] = entry
    this.saveCache()
    
    console.log(`Cached ${alternatives.length} alternatives for: ${productName}`)
  }

  public getStats(): {
    totalEntries: number
    aiGenerated: number
    manual: number
    mostSearched: Array<{ name: string; count: number }>
  } {
    const entries = Object.entries(this.cacheData.cache)
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
    // Remove entries older than maxAge (default 30 days)
    const now = new Date().getTime()
    let removedCount = 0

    Object.keys(this.cacheData.cache).forEach(key => {
      const entry = this.cacheData.cache[key]
      const entryAge = now - new Date(entry.timestamp).getTime()
      
      if (entryAge > maxAge && entry.searchCount < 2) {
        delete this.cacheData.cache[key]
        removedCount++
      }
    })

    if (removedCount > 0) {
      this.saveCache()
      console.log(`Cleaned up ${removedCount} old cache entries`)
    }
  }

  public exportToMainDatabase(): void {
    // Export popular cached items to main alternatives.json
    const stats = this.getStats()
    const popularItems = stats.mostSearched.filter(item => item.count >= 5)
    
    console.log(`Found ${popularItems.length} popular items to potentially add to main database`)
    // This could be implemented to automatically update alternatives.json
  }
}