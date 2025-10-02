// Tiered storage system for massive scale
// Tier 1: Hot cache (in-memory) - most accessed items
// Tier 2: Warm cache (local file) - frequently accessed items  
// Tier 3: Cold storage (external) - rarely accessed items
// Tier 4: Archive (compressed) - historical data

interface StorageTier {
  name: string
  maxSize: number
  maxAge: number
  compressionRatio: number
  accessCost: number // relative cost (1-10)
}

const STORAGE_TIERS: StorageTier[] = [
  {
    name: 'hot',
    maxSize: 1000,           // 1k items in memory
    maxAge: 24 * 60 * 60 * 1000, // 1 day
    compressionRatio: 1.0,   // No compression
    accessCost: 1
  },
  {
    name: 'warm', 
    maxSize: 10000,          // 10k items in file
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    compressionRatio: 0.7,   // 30% compression
    accessCost: 2
  },
  {
    name: 'cold',
    maxSize: 100000,         // 100k items external
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    compressionRatio: 0.5,   // 50% compression
    accessCost: 5
  },
  {
    name: 'archive',
    maxSize: 1000000,        // 1M items archived
    maxAge: Infinity,        // Never expires
    compressionRatio: 0.3,   // 70% compression
    accessCost: 10
  }
]

export class TieredStorageManager {
  private tiers: Map<string, Map<string, any>> = new Map()
  private accessLog: Map<string, { count: number; lastAccess: number }> = new Map()

  constructor() {
    // Initialize tiers
    STORAGE_TIERS.forEach(tier => {
      this.tiers.set(tier.name, new Map())
    })
  }

  public async get(key: string): Promise<any> {
    // Search through tiers from hot to cold
    for (const tier of STORAGE_TIERS) {
      const tierMap = this.tiers.get(tier.name)
      if (tierMap?.has(key)) {
        const data = tierMap.get(key)
        
        // Update access log
        const access = this.accessLog.get(key) || { count: 0, lastAccess: 0 }
        access.count++
        access.lastAccess = Date.now()
        this.accessLog.set(key, access)
        
        // Promote to higher tier if frequently accessed
        await this.considerPromotion(key, data, tier.name)
        
        console.log(`Found in ${tier.name} tier (cost: ${tier.accessCost})`)
        return data
      }
    }
    
    return null
  }

  public async set(key: string, data: any): Promise<void> {
    // Always start in hot tier
    const hotTier = this.tiers.get('hot')!
    hotTier.set(key, data)
    
    // Initialize access log
    this.accessLog.set(key, { count: 1, lastAccess: Date.now() })
    
    // Trigger rebalancing if needed
    await this.rebalanceTiers()
  }

  private async considerPromotion(key: string, data: any, currentTier: string): Promise<void> {
    const access = this.accessLog.get(key)
    if (!access) return

    const currentTierIndex = STORAGE_TIERS.findIndex(t => t.name === currentTier)
    if (currentTierIndex === 0) return // Already in hot tier

    // Promote if accessed frequently
    const shouldPromote = 
      access.count >= 5 || // 5+ accesses
      (Date.now() - access.lastAccess < 60 * 60 * 1000 && access.count >= 2) // Recent + 2+ accesses

    if (shouldPromote) {
      const targetTier = STORAGE_TIERS[currentTierIndex - 1]
      const targetMap = this.tiers.get(targetTier.name)!
      const currentMap = this.tiers.get(currentTier)!
      
      // Move data
      targetMap.set(key, data)
      currentMap.delete(key)
      
      console.log(`Promoted ${key} from ${currentTier} to ${targetTier.name}`)
    }
  }

  private async rebalanceTiers(): Promise<void> {
    for (let i = 0; i < STORAGE_TIERS.length; i++) {
      const tier = STORAGE_TIERS[i]
      const tierMap = this.tiers.get(tier.name)!
      
      if (tierMap.size > tier.maxSize) {
        await this.demoteOldestItems(tier.name, tierMap.size - tier.maxSize)
      }
    }
  }

  private async demoteOldestItems(tierName: string, count: number): Promise<void> {
    const tierMap = this.tiers.get(tierName)!
    const tierIndex = STORAGE_TIERS.findIndex(t => t.name === tierName)
    
    if (tierIndex === STORAGE_TIERS.length - 1) {
      // Last tier - delete oldest items
      const entries = Array.from(tierMap.entries())
      entries
        .sort(([a], [b]) => {
          const accessA = this.accessLog.get(a)?.lastAccess || 0
          const accessB = this.accessLog.get(b)?.lastAccess || 0
          return accessA - accessB
        })
        .slice(0, count)
        .forEach(([key]) => {
          tierMap.delete(key)
          this.accessLog.delete(key)
        })
      
      console.log(`Deleted ${count} oldest items from ${tierName}`)
    } else {
      // Move to next tier
      const nextTier = STORAGE_TIERS[tierIndex + 1]
      const nextTierMap = this.tiers.get(nextTier.name)!
      
      const entries = Array.from(tierMap.entries())
      entries
        .sort(([a], [b]) => {
          const accessA = this.accessLog.get(a)?.lastAccess || 0
          const accessB = this.accessLog.get(b)?.lastAccess || 0
          return accessA - accessB
        })
        .slice(0, count)
        .forEach(([key, data]) => {
          // Compress data when moving to colder tier
          const compressedData = this.compressData(data, nextTier.compressionRatio)
          nextTierMap.set(key, compressedData)
          tierMap.delete(key)
        })
      
      console.log(`Demoted ${count} items from ${tierName} to ${nextTier.name}`)
    }
  }

  private compressData(data: any, ratio: number): any {
    if (ratio >= 1.0) return data
    
    // Simple compression - remove less important fields
    if (data.alternatives) {
      return {
        ...data,
        alternatives: data.alternatives.map((alt: any) => ({
          name: alt.name,
          description: alt.description?.substring(0, 50) + '...',
          pricing: alt.pricing,
          rating: alt.rating,
          website: alt.website,
          category: alt.category
          // Remove pros/cons to save space
        }))
      }
    }
    
    return data
  }

  public getStorageStats(): {
    tiers: Array<{
      name: string
      items: number
      maxItems: number
      utilizationPercent: number
      estimatedSize: string
    }>
    totalItems: number
    totalAccesses: number
  } {
    const tierStats = STORAGE_TIERS.map(tier => {
      const tierMap = this.tiers.get(tier.name)!
      const items = tierMap.size
      const utilizationPercent = Math.round((items / tier.maxSize) * 100)
      
      // Estimate size
      const estimatedBytes = items * 1000 * tier.compressionRatio // Rough estimate
      const estimatedSize = estimatedBytes > 1024 * 1024 
        ? `${(estimatedBytes / (1024 * 1024)).toFixed(1)}MB`
        : `${(estimatedBytes / 1024).toFixed(1)}KB`
      
      return {
        name: tier.name,
        items,
        maxItems: tier.maxSize,
        utilizationPercent,
        estimatedSize
      }
    })

    const totalItems = tierStats.reduce((sum, tier) => sum + tier.items, 0)
    const totalAccesses = Array.from(this.accessLog.values())
      .reduce((sum, access) => sum + access.count, 0)

    return {
      tiers: tierStats,
      totalItems,
      totalAccesses
    }
  }

  public async cleanup(): Promise<void> {
    const now = Date.now()
    
    // Clean up access log for deleted items
    const accessEntries = Array.from(this.accessLog.entries())
    for (const [key, access] of accessEntries) {
      const exists = STORAGE_TIERS.some(tier => 
        this.tiers.get(tier.name)?.has(key)
      )
      
      if (!exists || now - access.lastAccess > 30 * 24 * 60 * 60 * 1000) {
        this.accessLog.delete(key)
      }
    }
    
    // Rebalance all tiers
    await this.rebalanceTiers()
  }
}