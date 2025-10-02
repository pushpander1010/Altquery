// External storage adapters for massive scale
// Options: GitHub, Supabase, PlanetScale, or custom API

interface ExternalStorageAdapter {
  name: string
  maxSize: number
  costPerGB: number
  latency: number // ms
  reliability: number // 0-1
}

// GitHub as free storage (creative but works!)
export class GitHubStorageAdapter {
  private repoOwner: string
  private repoName: string
  private token: string
  private branch: string = 'cache-data'

  constructor(repoOwner: string, repoName: string, token: string) {
    this.repoOwner = repoOwner
    this.repoName = repoName
    this.token = token
  }

  async save(key: string, data: any): Promise<boolean> {
    try {
      const content = Buffer.from(JSON.stringify(data)).toString('base64')
      const path = `cache/${key.substring(0, 2)}/${key}.json`
      
      const response = await fetch(`https://api.github.com/repos/${this.repoOwner}/${this.repoName}/contents/${path}`, {
        method: 'PUT',
        headers: {
          'Authorization': `token ${this.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: `Cache update: ${key}`,
          content,
          branch: this.branch
        })
      })

      return response.ok
    } catch (error) {
      console.error('GitHub storage error:', error)
      return false
    }
  }

  async load(key: string): Promise<any> {
    try {
      const path = `cache/${key.substring(0, 2)}/${key}.json`
      const response = await fetch(`https://api.github.com/repos/${this.repoOwner}/${this.repoName}/contents/${path}?ref=${this.branch}`, {
        headers: {
          'Authorization': `token ${this.token}`,
        }
      })

      if (!response.ok) return null

      const data = await response.json()
      const content = Buffer.from(data.content, 'base64').toString()
      return JSON.parse(content)
    } catch (error) {
      console.error('GitHub load error:', error)
      return null
    }
  }
}

// Supabase storage adapter
export class SupabaseStorageAdapter {
  private url: string
  private key: string
  private bucket: string = 'cache-data'

  constructor(url: string, key: string) {
    this.url = url
    this.key = key
  }

  async save(key: string, data: any): Promise<boolean> {
    try {
      const response = await fetch(`${this.url}/storage/v1/object/${this.bucket}/${key}.json`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.key}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      })

      return response.ok
    } catch (error) {
      console.error('Supabase storage error:', error)
      return false
    }
  }

  async load(key: string): Promise<any> {
    try {
      const response = await fetch(`${this.url}/storage/v1/object/${this.bucket}/${key}.json`, {
        headers: {
          'Authorization': `Bearer ${this.key}`,
        }
      })

      if (!response.ok) return null
      return await response.json()
    } catch (error) {
      console.error('Supabase load error:', error)
      return null
    }
  }
}

// Smart external storage manager
export class ExternalStorageManager {
  private adapters: Map<string, any> = new Map()
  private primaryAdapter: string = 'github'
  private fallbackAdapter: string = 'supabase'

  constructor() {
    // Initialize adapters based on environment variables
    if (process.env.GITHUB_TOKEN && process.env.GITHUB_REPO) {
      const [owner, repo] = process.env.GITHUB_REPO.split('/')
      this.adapters.set('github', new GitHubStorageAdapter(owner, repo, process.env.GITHUB_TOKEN))
    }

    if (process.env.SUPABASE_URL && process.env.SUPABASE_KEY) {
      this.adapters.set('supabase', new SupabaseStorageAdapter(process.env.SUPABASE_URL, process.env.SUPABASE_KEY))
    }
  }

  async save(key: string, data: any): Promise<boolean> {
    // Try primary adapter first
    const primary = this.adapters.get(this.primaryAdapter)
    if (primary) {
      const success = await primary.save(key, data)
      if (success) return true
    }

    // Try fallback adapter
    const fallback = this.adapters.get(this.fallbackAdapter)
    if (fallback) {
      return await fallback.save(key, data)
    }

    return false
  }

  async load(key: string): Promise<any> {
    // Try primary adapter first
    const primary = this.adapters.get(this.primaryAdapter)
    if (primary) {
      const data = await primary.load(key)
      if (data) return data
    }

    // Try fallback adapter
    const fallback = this.adapters.get(this.fallbackAdapter)
    if (fallback) {
      return await fallback.load(key)
    }

    return null
  }

  getAvailableAdapters(): string[] {
    return Array.from(this.adapters.keys())
  }
}

// Hybrid storage strategy
export class HybridStorageStrategy {
  private localCache: Map<string, any> = new Map()
  private externalStorage: ExternalStorageManager
  private maxLocalSize: number = 1000 // Max items in local cache
  private syncQueue: Set<string> = new Set()

  constructor() {
    this.externalStorage = new ExternalStorageManager()
    this.startSyncProcess()
  }

  async get(key: string): Promise<any> {
    // Check local cache first
    if (this.localCache.has(key)) {
      return this.localCache.get(key)
    }

    // Load from external storage
    const data = await this.externalStorage.load(key)
    if (data) {
      // Add to local cache if there's space
      if (this.localCache.size < this.maxLocalSize) {
        this.localCache.set(key, data)
      }
      return data
    }

    return null
  }

  async set(key: string, data: any): Promise<void> {
    // Always add to local cache
    this.localCache.set(key, data)

    // Add to sync queue for external storage
    this.syncQueue.add(key)

    // Manage local cache size
    if (this.localCache.size > this.maxLocalSize) {
      const oldestKey = this.localCache.keys().next().value
      if (oldestKey) {
        this.localCache.delete(oldestKey)
      }
    }
  }

  private startSyncProcess(): void {
    // Sync to external storage every 5 minutes
    setInterval(async () => {
      const keysToSync = Array.from(this.syncQueue).slice(0, 10) // Batch of 10
      
      for (const key of keysToSync) {
        const data = this.localCache.get(key)
        if (data) {
          const success = await this.externalStorage.save(key, data)
          if (success) {
            this.syncQueue.delete(key)
          }
        }
      }

      if (keysToSync.length > 0) {
        console.log(`Synced ${keysToSync.length} items to external storage`)
      }
    }, 5 * 60 * 1000) // 5 minutes
  }

  getStats(): {
    localItems: number
    pendingSync: number
    availableAdapters: string[]
  } {
    return {
      localItems: this.localCache.size,
      pendingSync: this.syncQueue.size,
      availableAdapters: this.externalStorage.getAvailableAdapters()
    }
  }
}