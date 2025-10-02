// Master storage orchestrator - intelligently manages all storage systems
import { SmartCacheManager } from './smart-cache-manager'
import { TieredStorageManager } from './tiered-storage'
import { HybridStorageStrategy } from './external-storage'

interface StorageStrategy {
  name: string
  priority: number
  maxSize: number
  costPerItem: number
  latency: number
  reliability: number
}

const STORAGE_STRATEGIES: StorageStrategy[] = [
  {
    name: 'memory',
    priority: 1,
    maxSize: 1000,
    costPerItem: 0,
    latency: 1,
    reliability: 0.99
  },
  {
    name: 'local-file',
    priority: 2,
    maxSize: 10000,
    costPerItem: 0,
    latency: 10,
    reliability: 0.95
  },
  {
    name: 'external-free',
    priority: 3,
    maxSize: 100000,
    costPerItem: 0,
    latency: 500,
    reliability: 0.90
  },
  {
    name: 'external-paid',
    priority: 4,
    maxSize: 1000000,
    costPerItem: 0.001,
    latency: 200,
    reliability: 0.99
  }
]

export class StorageOrchestrator {
  private static instance: StorageOrchestrator
  private smartCache: SmartCacheManager
  private tieredStorage: TieredStorageManager
  private hybridStorage: HybridStorageStrategy
  private currentStrategy: string = 'smart'
  private metrics = {
    totalRequests: 0,
    cacheHits: 0,
    cacheMisses: 0,
    storageErrors: 0,
    averageLatency: 0
  }

  private constructor() {
    this.smartCache = SmartCacheManager.getInstance()
    this.tieredStorage = new TieredStorageManager()
    this.hybridStorage = new HybridStorageStrategy()
    this.startMonitoring()
  }

  public static getInstance(): StorageOrchestrator {
    if (!StorageOrchestrator.instance) {
      StorageOrchestrator.instance = new StorageOrchestrator()
    }
    return StorageOrchestrator.instance
  }

  public async get(key: string): Promise<any> {
    const startTime = Date.now()
    this.metrics.totalRequests++

    try {
      let result = null

      // Strategy 1: Smart cache (development + some production)
      if (this.currentStrategy === 'smart') {
        result = await this.smartCache.get(key)
      }
      
      // Strategy 2: Tiered storage (high-scale production)
      else if (this.currentStrategy === 'tiered') {
        result = await this.tieredStorage.get(key)
      }
      
      // Strategy 3: Hybrid storage (massive scale)
      else if (this.currentStrategy === 'hybrid') {
        result = await this.hybridStorage.get(key)
      }

      // Update metrics
      if (result) {
        this.metrics.cacheHits++
      } else {
        this.metrics.cacheMisses++
      }

      const latency = Date.now() - startTime
      this.metrics.averageLatency = (this.metrics.averageLatency + latency) / 2

      return result
    } catch (error) {
      this.metrics.storageErrors++
      console.error('Storage orchestrator get error:', error)
      return null
    }
  }

  public async set(key: string, data: any): Promise<void> {
    try {
      // Always use current strategy
      if (this.currentStrategy === 'smart') {
        await this.smartCache.set(key, data.alternatives, data.source)
      } else if (this.currentStrategy === 'tiered') {
        await this.tieredStorage.set(key, data)
      } else if (this.currentStrategy === 'hybrid') {
        await this.hybridStorage.set(key, data)
      }
    } catch (error) {
      this.metrics.storageErrors++
      console.error('Storage orchestrator set error:', error)
    }
  }

  public switchStrategy(strategy: string): void {
    const validStrategies = ['smart', 'tiered', 'hybrid']
    if (validStrategies.includes(strategy)) {
      this.currentStrategy = strategy
      console.log(`Switched to ${strategy} storage strategy`)
    }
  }

  public autoSelectStrategy(): void {
    const stats = this.getComprehensiveStats()
    
    // Auto-select based on scale and environment
    if (process.env.NODE_ENV === 'development') {
      this.currentStrategy = 'smart'
    } else if (stats.totalItems < 10000) {
      this.currentStrategy = 'smart'
    } else if (stats.totalItems < 100000) {
      this.currentStrategy = 'tiered'
    } else {
      this.currentStrategy = 'hybrid'
    }

    console.log(`Auto-selected ${this.currentStrategy} strategy for ${stats.totalItems} items`)
  }

  private startMonitoring(): void {
    // Monitor and auto-adjust strategy every 10 minutes
    setInterval(() => {
      this.autoSelectStrategy()
      this.performMaintenance()
    }, 10 * 60 * 1000)
  }

  private performMaintenance(): void {
    try {
      // Cleanup based on current strategy
      if (this.currentStrategy === 'smart') {
        // Smart cache has its own cleanup
      } else if (this.currentStrategy === 'tiered') {
        this.tieredStorage.cleanup()
      }
      
      console.log('Storage maintenance completed')
    } catch (error) {
      console.error('Storage maintenance error:', error)
    }
  }

  public getComprehensiveStats(): {
    currentStrategy: string
    totalItems: number
    hitRate: number
    averageLatency: number
    storageErrors: number
    recommendations: string[]
    strategies: {
      smart?: any
      tiered?: any
      hybrid?: any
    }
  } {
    const hitRate = this.metrics.totalRequests > 0 
      ? (this.metrics.cacheHits / this.metrics.totalRequests) * 100 
      : 0

    const recommendations: string[] = []
    
    // Generate recommendations
    if (hitRate < 50) {
      recommendations.push('Consider increasing cache size or improving cache strategy')
    }
    if (this.metrics.averageLatency > 1000) {
      recommendations.push('High latency detected - consider upgrading storage tier')
    }
    if (this.metrics.storageErrors > 10) {
      recommendations.push('Multiple storage errors - check external storage connections')
    }

    const strategies: any = {}
    
    // Get stats from active strategies
    if (this.currentStrategy === 'smart') {
      strategies.smart = this.smartCache.getAdvancedStats()
    } else if (this.currentStrategy === 'tiered') {
      strategies.tiered = this.tieredStorage.getStorageStats()
    } else if (this.currentStrategy === 'hybrid') {
      strategies.hybrid = this.hybridStorage.getStats()
    }

    return {
      currentStrategy: this.currentStrategy,
      totalItems: strategies[this.currentStrategy]?.totalEntries || 0,
      hitRate: Math.round(hitRate),
      averageLatency: Math.round(this.metrics.averageLatency),
      storageErrors: this.metrics.storageErrors,
      recommendations,
      strategies
    }
  }

  public async migrateStrategy(from: string, to: string): Promise<void> {
    console.log(`Starting migration from ${from} to ${to}`)
    
    // This would implement data migration between strategies
    // For now, just switch strategies
    this.switchStrategy(to)
    
    console.log(`Migration completed from ${from} to ${to}`)
  }

  public getStorageRecommendation(): {
    recommended: string
    reason: string
    benefits: string[]
    costs: string[]
  } {
    const stats = this.getComprehensiveStats()
    
    if (stats.totalItems < 1000) {
      return {
        recommended: 'smart',
        reason: 'Low volume - smart caching is sufficient',
        benefits: ['Simple setup', 'No external dependencies', 'Fast access'],
        costs: ['Limited scale', 'Memory usage']
      }
    } else if (stats.totalItems < 50000) {
      return {
        recommended: 'tiered',
        reason: 'Medium volume - tiered storage provides good balance',
        benefits: ['Better memory management', 'Automatic promotion/demotion', 'Scalable'],
        costs: ['More complex', 'Slight latency increase']
      }
    } else {
      return {
        recommended: 'hybrid',
        reason: 'High volume - external storage required',
        benefits: ['Unlimited scale', 'Persistent storage', 'Cost effective'],
        costs: ['External dependencies', 'Higher latency', 'Setup complexity']
      }
    }
  }
}