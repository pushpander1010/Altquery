// Content filtering system to block inappropriate searches

interface FilterRule {
  type: 'exact' | 'contains' | 'regex'
  pattern: string
  category: 'adult' | 'illegal' | 'spam' | 'harmful'
  severity: 'block' | 'warn' | 'log'
}

const BLOCKED_TERMS: FilterRule[] = [
  // Adult content
  { type: 'exact', pattern: 'xnxx', category: 'adult', severity: 'block' },
  { type: 'exact', pattern: 'pornhub', category: 'adult', severity: 'block' },
  { type: 'exact', pattern: 'xvideos', category: 'adult', severity: 'block' },
  { type: 'contains', pattern: 'porn', category: 'adult', severity: 'block' },
  { type: 'contains', pattern: 'xxx', category: 'adult', severity: 'block' },
  { type: 'contains', pattern: 'sex', category: 'adult', severity: 'warn' },
  
  // Illegal content
  { type: 'exact', pattern: 'zlibrary', category: 'illegal', severity: 'block' },
  { type: 'exact', pattern: 'libgen', category: 'illegal', severity: 'block' },
  { type: 'exact', pattern: 'sci-hub', category: 'illegal', severity: 'block' },
  { type: 'contains', pattern: 'pirate', category: 'illegal', severity: 'block' },
  { type: 'contains', pattern: 'torrent', category: 'illegal', severity: 'warn' },
  { type: 'contains', pattern: 'crack', category: 'illegal', severity: 'warn' },
  
  // Harmful/spam
  { type: 'contains', pattern: 'hack', category: 'harmful', severity: 'warn' },
  { type: 'contains', pattern: 'exploit', category: 'harmful', severity: 'warn' },
  { type: 'regex', pattern: '^.{1,2}$', category: 'spam', severity: 'block' }, // Too short
  { type: 'regex', pattern: '^.{100,}$', category: 'spam', severity: 'block' }, // Too long
]

const SAFE_ALTERNATIVES: Record<string, string[]> = {
  'zlibrary': [
    'Try your local library\'s digital collection',
    'Check out Open Library (openlibrary.org)',
    'Use Google Books for previews',
    'Visit Project Gutenberg for free classics'
  ],
  'libgen': [
    'Use your university library database',
    'Try Google Scholar for academic papers',
    'Check ResearchGate for research papers',
    'Visit JSTOR for academic content'
  ],
  'adult-content': [
    'This type of content is not supported',
    'Please search for legitimate software alternatives',
    'Try searching for productivity or entertainment apps instead'
  ]
}

export class ContentFilter {
  private static instance: ContentFilter
  private blockedAttempts: Map<string, number> = new Map()

  private constructor() {}

  public static getInstance(): ContentFilter {
    if (!ContentFilter.instance) {
      ContentFilter.instance = new ContentFilter()
    }
    return ContentFilter.instance
  }

  public checkContent(query: string): {
    allowed: boolean
    category?: string
    severity?: string
    message?: string
    alternatives?: string[]
  } {
    const normalizedQuery = query.toLowerCase().trim()
    
    // Check against all filter rules
    for (const rule of BLOCKED_TERMS) {
      let matches = false
      
      switch (rule.type) {
        case 'exact':
          matches = normalizedQuery === rule.pattern
          break
        case 'contains':
          matches = normalizedQuery.includes(rule.pattern)
          break
        case 'regex':
          matches = new RegExp(rule.pattern).test(normalizedQuery)
          break
      }
      
      if (matches) {
        // Log the attempt
        const attempts = this.blockedAttempts.get(normalizedQuery) || 0
        this.blockedAttempts.set(normalizedQuery, attempts + 1)
        
        console.log(`Blocked search attempt: "${query}" (${rule.category}, ${attempts + 1} attempts)`)
        
        if (rule.severity === 'block') {
          return {
            allowed: false,
            category: rule.category,
            severity: rule.severity,
            message: this.getBlockMessage(rule.category),
            alternatives: this.getSafeAlternatives(normalizedQuery, rule.category)
          }
        } else if (rule.severity === 'warn') {
          // Log but allow (for borderline cases)
          console.warn(`Warning for search: "${query}" (${rule.category})`)
        }
      }
    }
    
    return { allowed: true }
  }

  private getBlockMessage(category: string): string {
    switch (category) {
      case 'adult':
        return 'This search contains inappropriate content and is not supported.'
      case 'illegal':
        return 'This search appears to be for illegal or pirated content, which we cannot support.'
      case 'spam':
        return 'Please enter a valid software or service name to search for alternatives.'
      case 'harmful':
        return 'This search contains potentially harmful content and is not supported.'
      default:
        return 'This search is not supported. Please try searching for legitimate software alternatives.'
    }
  }

  private getSafeAlternatives(query: string, category: string): string[] {
    // Check for specific alternatives first
    if (SAFE_ALTERNATIVES[query]) {
      return SAFE_ALTERNATIVES[query]
    }
    
    // Return category-based alternatives
    switch (category) {
      case 'illegal':
        return [
          'Try legitimate alternatives from official sources',
          'Check if your library has digital access',
          'Look for free and open-source alternatives',
          'Consider subscription-based legal services'
        ]
      case 'adult':
        return SAFE_ALTERNATIVES['adult-content']
      default:
        return [
          'Please search for legitimate software names',
          'Try searching for productivity tools',
          'Look for popular software categories',
          'Check our trending alternatives instead'
        ]
    }
  }

  public getBlockedStats(): {
    totalBlocked: number
    topBlocked: Array<{ query: string; attempts: number }>
    categories: Record<string, number>
  } {
    const entries = Array.from(this.blockedAttempts.entries())
    const totalBlocked = entries.reduce((sum, [, attempts]) => sum + attempts, 0)
    
    const topBlocked = entries
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([query, attempts]) => ({ query, attempts }))
    
    // Count by category (simplified)
    const categories: Record<string, number> = {
      adult: 0,
      illegal: 0,
      spam: 0,
      harmful: 0
    }
    
    entries.forEach(([query]) => {
      const result = this.checkContent(query)
      if (!result.allowed && result.category) {
        categories[result.category] = (categories[result.category] || 0) + 1
      }
    })
    
    return {
      totalBlocked,
      topBlocked,
      categories
    }
  }

  public isLikelyLegitimate(query: string): boolean {
    const normalizedQuery = query.toLowerCase().trim()
    
    // Check for common software patterns
    const legitimatePatterns = [
      /\w+\s+(app|software|tool|platform|service)$/,
      /^(microsoft|google|adobe|apple|meta|amazon|netflix|spotify|slack|zoom|discord|figma|notion|trello)\s/,
      /\s+(alternative|competitor|replacement)$/,
      /^[a-z0-9\-_\s]{3,50}$/i // Reasonable length and characters
    ]
    
    return legitimatePatterns.some(pattern => pattern.test(normalizedQuery))
  }
}