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

interface CompactCacheEntry {
  a: Alternative[] // alternatives
  t: string       // timestamp
  s: 'ai' | 'manual' // source
  c: number       // searchCount
  l: string       // lastAccessed
  q: number       // quality score (0-100)
}

interface SmartCacheConfig {
  maxEntries: number
  maxSizeBytes: number
  minSearchCount: number
  maxAge: number // milliseconds
  compressionEnabled: boolean
  tieringEnabled: boolean
}

const DEFAULT_CONFIG: SmartCacheConfig = {
  maxEntries: 10000,        // Max 10k cached items
  maxSizeBytes: 50 * 1024 * 1024, // 50MB max
  minSearchCount: 2,        // Keep items searched 2+ times
  maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  compressionEnabled: true,
  tieringEnabled: true
}

export class SmartCacheManager {
  private static instance: SmartCacheManager
  private config: SmartCacheConfig
  private cacheFilePath: string
  private hotCache: Map<string, CompactCacheEntry> = new Map() // In-memory hot cache
  private stats = {
    hits: 0,
    misses: 0,
    evictions: 0,
    compressions: 0
  }

  private constructor(config: Partial<SmartCacheConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config }
    this.cacheFilePath = path.join(process.cwd(), 'data', 'smart-cache.json')
    this.loadCache()
    this.startMaintenanceTimer()
  }

  public static getInstance(config?: Partial<SmartCacheConfig>): SmartCacheManager {
    if (!SmartCacheManager.instance) {
      SmartCacheManager.instance = new SmartCacheManager(config)
    }
    return SmartCacheManager.instance
  }

  private loadCache(): void {
    try {
      if (fs.existsSync(this.cacheFilePath)) {
        const data = JSON.parse(fs.readFileSync(this.cacheFilePath, 'utf-8'))
        
        // Load only hot items (frequently accessed) into memory
        Object.entries(data.cache || {}).forEach(([key, entry]: [string, any]) => {
          if (entry.c >= this.config.minSearchCount) {
            this.hotCache.set(key, entry as CompactCacheEntry)
          }
        })
        
        console.log(`Loaded ${this.hotCache.size} hot cache entries`)
      }
    } catch (error) {
      console.error('Error loading smart cache:', error)
    }
  }

  private saveCache(): void {
    try {
      // Only save if we're not in production (Vercel limitation)
      if (process.env.NODE_ENV === 'production') {
        return
      }

      const dir = path.dirname(this.cacheFilePath)
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true })
      }

      // Load existing cold storage
      let existingData: any = { cache: {}, metadata: {} }
      if (fs.existsSync(this.cacheFilePath)) {
        existingData = JSON.parse(fs.readFileSync(this.cacheFilePath, 'utf-8'))
      }

      // Merge hot cache with existing data
      const mergedCache = { ...existingData.cache }
      this.hotCache.forEach((entry, key) => {
        mergedCache[key] = entry
      })

      const cacheData = {
        cache: mergedCache,
        metadata: {
          lastUpdated: new Date().toISOString(),
          totalEntries: Object.keys(mergedCache).length,
          hotEntries: this.hotCache.size,
          config: this.config,
          stats: this.stats
        }
      }

      // Check size before saving
      const dataString = JSON.stringify(cacheData)
      if (dataString.length > this.config.maxSizeBytes) {
        console.warn('Cache size exceeds limit, performing cleanup')
        this.performIntelligentCleanup()
        return
      }

      fs.writeFileSync(this.cacheFilePath, dataString)
    } catch (error) {
      console.error('Error saving smart cache:', error)
    }
  }

  public async get(productName: string): Promise<Alternative[] | null> {
    const normalizedName = productName.toLowerCase().trim()
    
    // Check hot cache first
    let entry = this.hotCache.get(normalizedName)
    
    if (!entry) {
      // Check cold storage
      entry = await this.getColdEntry(normalizedName)
      if (entry) {
        // Promote to hot cache if frequently accessed
        if (entry.c >= this.config.minSearchCount) {
          this.hotCache.set(normalizedName, entry)
        }
      }
    }

    if (entry) {
      // Update access statistics
      entry.c += 1
      entry.l = new Date().toISOString()
      entry.q = this.calculateQualityScore(entry)
      
      this.stats.hits++
      console.log(`Smart cache HIT for: ${productName} (${entry.c} searches, quality: ${entry.q})`)
      return entry.a
    }

    this.stats.misses++
    console.log(`Smart cache MISS for: ${productName}`)
    return null
  }

  private async getColdEntry(key: string): Promise<CompactCacheEntry | null> {
    try {
      if (!fs.existsSync(this.cacheFilePath)) return null
      
      const data = JSON.parse(fs.readFileSync(this.cacheFilePath, 'utf-8'))
      return data.cache[key] || null
    } catch (error) {
      console.error('Error reading cold storage:', error)
      return null
    }
  }

  public async set(productName: string, alternatives: Alternative[], source: 'ai' | 'manual' = 'ai'): Promise<void> {
    const normalizedName = productName.toLowerCase().trim()
    
    if (!alternatives || alternatives.length === 0 || alternatives[0]?.name === 'No AI Available') {
      return
    }

    // Compress alternatives if enabled
    const compressedAlternatives = this.config.compressionEnabled 
      ? this.compressAlternatives(alternatives)
      : alternatives

    const entry: CompactCacheEntry = {
      a: compressedAlternatives,
      t: new Date().toISOString(),
      s: source,
      c: 1,
      l: new Date().toISOString(),
      q: source === 'ai' ? 80 : 60 // Initial quality score
    }

    // Add to hot cache
    this.hotCache.set(normalizedName, entry)
    
    // Trigger cleanup if needed
    if (this.hotCache.size > this.config.maxEntries * 0.8) {
      this.performIntelligentCleanup()
    }

    console.log(`Smart cached ${alternatives.length} alternatives for: ${productName}`)
  }

  private compressAlternatives(alternatives: Alternative[]): Alternative[] {
    // Compress by removing redundant data and shortening descriptions
    return alternatives.map(alt => ({
      ...alt,
      description: alt.description.length > 100 ? alt.description.substring(0, 97) + '...' : alt.description,
      pros: alt.pros.slice(0, 3), // Keep only top 3 pros
      cons: alt.cons.slice(0, 2)  // Keep only top 2 cons
    }))
  }

  private calculateQualityScore(entry: CompactCacheEntry): number {
    const now = Date.now()
    const entryAge = now - new Date(entry.t).getTime()
    const lastAccessAge = now - new Date(entry.l).getTime()
    
    let score = 50 // Base score
    
    // Boost for search frequency
    score += Math.min(entry.c * 5, 30)
    
    // Boost for AI-generated content
    if (entry.s === 'ai') score += 10
    
    // Penalty for age
    const daysSinceCreated = entryAge / (24 * 60 * 60 * 1000)
    score -= Math.min(daysSinceCreated * 2, 20)
    
    // Penalty for not being accessed recently
    const daysSinceAccess = lastAccessAge / (24 * 60 * 60 * 1000)
    score -= Math.min(daysSinceAccess * 3, 25)
    
    return Math.max(0, Math.min(100, score))
  }

  private performIntelligentCleanup(): void {
    console.log('Performing intelligent cache cleanup...')
    
    const entries = Array.from(this.hotCache.entries())
    const now = Date.now()
    let removedCount = 0

    // Sort by quality score (ascending - worst first)
    entries.sort(([, a], [, b]) => a.q - b.q)

    // Remove entries based on multiple criteria
    for (const [key, entry] of entries) {
      const shouldRemove = 
        entry.q < 30 || // Low quality score
        (entry.c < 2 && now - new Date(entry.t).getTime() > 7 * 24 * 60 * 60 * 1000) || // Low usage + old
        (now - new Date(entry.l).getTime() > this.config.maxAge) // Too old

      if (shouldRemove && this.hotCache.size > this.config.maxEntries * 0.5) {
        this.hotCache.delete(key)
        removedCount++
        this.stats.evictions++
      }
    }

    console.log(`Cleaned up ${removedCount} cache entries. Remaining: ${this.hotCache.size}`)
    
    // Save after cleanup
    this.saveCache()
  }

  private startMaintenanceTimer(): void {
    // Run maintenance every hour
    setInterval(() => {
      this.performIntelligentCleanup()
    }, 60 * 60 * 1000)
  }

  public getAdvancedStats(): {
    totalEntries: number
    hotEntries: number
    coldEntries: number
    hitRate: number
    averageQuality: number
    sizeEstimate: string
    topQuality: Array<{ name: string; quality: number; searches: number }>
  } {
    const hotEntries = Array.from(this.hotCache.entries())
    const totalHits = this.stats.hits + this.stats.misses
    const hitRate = totalHits > 0 ? (this.stats.hits / totalHits) * 100 : 0
    
    const averageQuality = hotEntries.length > 0 
      ? hotEntries.reduce((sum, [, entry]) => sum + entry.q, 0) / hotEntries.length 
      : 0

    const topQuality = hotEntries
      .map(([name, entry]) => ({ name, quality: entry.q, searches: entry.c }))
      .sort((a, b) => b.quality - a.quality)
      .slice(0, 10)

    // Estimate size
    const estimatedSize = JSON.stringify(Object.fromEntries(this.hotCache)).length
    const sizeEstimate = estimatedSize > 1024 * 1024 
      ? `${(estimatedSize / (1024 * 1024)).toFixed(1)}MB`
      : `${(estimatedSize / 1024).toFixed(1)}KB`

    return {
      totalEntries: hotEntries.length,
      hotEntries: this.hotCache.size,
      coldEntries: 0, // Would need to read from file
      hitRate: Math.round(hitRate),
      averageQuality: Math.round(averageQuality),
      sizeEstimate,
      topQuality
    }
  }

  public async migrateToExternalStorage(): Promise<void> {
    // Future: Migrate to external storage when cache gets too large
    console.log('Migration to external storage not implemented yet')
  }
}