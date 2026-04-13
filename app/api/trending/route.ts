import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

const YT_API_KEY = process.env.YOUTUBE_API_KEY

// ─── Category → Instagram hashtags mapping (internal use only) ───────────────
const CATEGORY_HASHTAGS: Record<string, string[]> = {
  all:          ['trendingreels', 'viralreels', 'trending'],
  comedy:       ['comedyreels', 'funnyreels', 'comedy'],
  dance:        ['dancereels', 'trending dance', 'dancevideo'],
  fitness:      ['fitnessreels', 'gymreels', 'workout'],
  food:         ['foodreels', 'foodie', 'cooking'],
  fashion:      ['fashionreels', 'ootd', 'styleinspo'],
  travel:       ['travelreels', 'wanderlust', 'travelgram'],
  music:        ['musicreels', 'newsong', 'musicvideo'],
  motivation:   ['motivationreels', 'mindset', 'success'],
  beauty:       ['beautyreels', 'makeuptutorial', 'skincare'],
  tech:         ['techreels', 'technology', 'gadgets'],
  business:     ['businessreels', 'entrepreneur', 'marketing'],
  education:    ['educationreels', 'learnontiktok', 'didyouknow'],
  sports:       ['sportsreels', 'cricket', 'football'],
  pets:         ['petsofinstagram', 'dogsofinstagram', 'cutepets'],
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

// facebookexternalhit UA triggers Instagram's SSR path — returns real reel data
const IG_HEADERS = {
  'User-Agent': 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)',
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
  'Accept-Language': 'en-US,en;q=0.9',
}

// ─── Scrape one Instagram popular page ───────────────────────────────────────
async function scrapeIGPage(url: string): Promise<{ reels: any[]; topics: string[] }> {
  try {
    const res = await fetch(url, { headers: IG_HEADERS, next: { revalidate: 1800 } })
    if (!res.ok) return { reels: [], topics: [] }
    const html = await res.text()

    // ── Topic pills: href="/popular/chalo-reels-trending/?utm_source=topic_pill"
    const pillMatches = [...html.matchAll(/href="\/popular\/([^/?#"]+)\/\?utm_source=topic_pill"/g)]
    const topics = [...new Set(
      pillMatches.map(m => decodeURIComponent(m[1]).replace(/-/g, ' ').trim())
        .filter(t => t.length > 2 && t.length < 60)
    )].slice(0, 20)

    // ── Reels: each reel block has href="/reel/{code}/" then nearby img with alt+src
    // Pattern: href="/reel/{shortcode}/" ... alt="{caption}" ... src="https://scontent..."
    const reelBlockRe = /href="\/reel\/([A-Za-z0-9_-]+)\/"[\s\S]{0,600}?alt="([^"]{0,300})"[\s\S]{0,200}?src="(https:\/\/scontent[^"]+)"/g
    const reels: any[] = []
    const seen = new Set<string>()
    let m: RegExpExecArray | null

    while ((m = reelBlockRe.exec(html)) !== null && reels.length < 20) {
      const shortcode = m[1]
      if (seen.has(shortcode)) continue
      seen.add(shortcode)

      const captionRaw = m[2].replace(/\s+/g, ' ').trim()
      const thumbnail = m[3].replace(/&amp;/g, '&')

      // Clean caption — strip emoji-heavy noise, keep first meaningful line
      const caption = captionRaw.replace(/[^\x00-\x7F]/g, '').replace(/\s+/g, ' ').trim().slice(0, 120)
        || captionRaw.slice(0, 80)

      const hashtags = [...captionRaw.matchAll(/#(\w+)/g)].map(h => h[1]).slice(0, 6)

      reels.push({
        id: `ig-${shortcode}`,
        platform: 'instagram',
        title: caption || 'Trending Reel',
        channel: '📸 Instagram Reels',
        thumbnail,
        views: 0,
        likes: 0,
        publishedAt: new Date().toISOString(),
        url: `https://www.instagram.com/reel/${shortcode}/`,
        tags: hashtags,
        subtitle: hashtags.length ? `#${hashtags.slice(0, 3).join(' #')}` : 'Trending Reel',
        shortcode,
      })
    }

    return { reels, topics }
  } catch {
    return { reels: [], topics: [] }
  }
}

// ─── Instagram trending — scrapes multiple /popular/ pages in parallel ────────
// Pages are country-aware where Instagram has them, falls back to global
async function fetchInstagramTrending(category: string, country: string) {

  // Country-specific popular pages Instagram actually has
  const countryPages: Record<string, string[]> = {
    IN: [
      'https://www.instagram.com/popular/trending--reels/',
      'https://www.instagram.com/popular/reels-trending-this-week/',
      'https://www.instagram.com/popular/instagram-new-trend-reel/',
      'https://www.instagram.com/popular/new-trending-transition-reels/',
    ],
    US: [
      'https://www.instagram.com/popular/trending--reels/',
      'https://www.instagram.com/popular/reels-trending-this-week/',
      'https://www.instagram.com/popular/trending-2026-reels/',
      'https://www.instagram.com/popular/instagram-new-trend-reel/',
    ],
    GB: [
      'https://www.instagram.com/popular/trending--reels/',
      'https://www.instagram.com/popular/reels-trending-this-week/',
      'https://www.instagram.com/popular/trending-2026-reels/',
    ],
    DEFAULT: [
      'https://www.instagram.com/popular/trending--reels/',
      'https://www.instagram.com/popular/reels-trending-this-week/',
      'https://www.instagram.com/popular/instagram-new-trend-reel/',
    ],
  }

  // Category-specific pages (these are real Instagram /popular/ pages)
  const categoryPages: Record<string, string[]> = {
    comedy:     ['https://www.instagram.com/popular/comedy-trending-reels/', 'https://www.instagram.com/popular/new-trending-bhojpuri-reel/'],
    dance:      ['https://www.instagram.com/popular/dances-reels-trending/', 'https://www.instagram.com/popular/indian-dance-reels-trending/'],
    fitness:    ['https://www.instagram.com/popular/fitness-reels-trending/'],
    food:       ['https://www.instagram.com/popular/food-reels-trending/'],
    fashion:    ['https://www.instagram.com/popular/viral-reels-fashion-trends/'],
    travel:     ['https://www.instagram.com/popular/travel-reels-trending/'],
    music:      ['https://www.instagram.com/popular/trending-south-indian-songs-on-reels/', 'https://www.instagram.com/popular/ya-ali-trending-reels/'],
    motivation: ['https://www.instagram.com/popular/motivation-reels-trending/'],
    beauty:     ['https://www.instagram.com/popular/beauty-reels-trending/'],
    tech:       ['https://www.instagram.com/popular/tech-reels-trending/'],
    business:   ['https://www.instagram.com/popular/business-reels-trending/'],
    education:  ['https://www.instagram.com/popular/education-reels-trending/'],
    sports:     ['https://www.instagram.com/popular/sports-reels-trending/'],
    pets:       ['https://www.instagram.com/popular/baby-reels-trends/'],
  }

  // Build list of pages to scrape in parallel
  const basePages = countryPages[country] || countryPages.DEFAULT
  const catPages = category !== 'all' ? (categoryPages[category] || []) : []
  const pagesToFetch = [...new Set([...catPages, ...basePages])].slice(0, 4)

  // Scrape all pages in parallel
  const results = await Promise.all(pagesToFetch.map(url => scrapeIGPage(url)))

  // Merge, deduplicate by shortcode
  const seen = new Set<string>()
  const allReels: any[] = []
  const allTopics: string[] = []

  for (const { reels, topics } of results) {
    for (const reel of reels) {
      if (!seen.has(reel.shortcode)) {
        seen.add(reel.shortcode)
        allReels.push(reel)
      }
    }
    allTopics.push(...topics)
  }

  return {
    reels: allReels.slice(0, 25),
    topics: [...new Set(allTopics)].slice(0, 20),
  }
}

// ─── YouTube trending ─────────────────────────────────────────────────────────
async function fetchYouTubeTrending(regionCode: string, category: string) {
  if (!YT_API_KEY) return []

  // Map category to YouTube category ID
  const ytCategoryMap: Record<string, string> = {
    comedy: '23', music: '10', sports: '17', tech: '28',
    education: '27', travel: '19', food: '26', fashion: '26',
    fitness: '17', beauty: '26', gaming: '20',
  }
  const categoryParam = ytCategoryMap[category] ? `&videoCategoryId=${ytCategoryMap[category]}` : ''

  const url = `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&chart=mostPopular&regionCode=${regionCode}&maxResults=25${categoryParam}&key=${YT_API_KEY}`
  const res = await fetch(url, { next: { revalidate: 3600 } })
  if (!res.ok) return []
  const data = await res.json()
  return (data.items || []).map((v: any) => ({
    id: v.id,
    platform: 'youtube',
    title: v.snippet.title,
    channel: v.snippet.channelTitle,
    thumbnail: v.snippet.thumbnails?.high?.url || v.snippet.thumbnails?.default?.url,
    views: parseInt(v.statistics.viewCount || '0'),
    likes: parseInt(v.statistics.likeCount || '0'),
    publishedAt: v.snippet.publishedAt,
    url: `https://youtube.com/watch?v=${v.id}`,
    tags: v.snippet.tags?.slice(0, 5) || [],
    subtitle: '',
  }))
}

// ─── Google Trends RSS ────────────────────────────────────────────────────────
async function fetchGoogleTrends(regionCode: string) {
  try {
    const res = await fetch(
      `https://trends.google.com/trending/rss?geo=${regionCode}`,
      { next: { revalidate: 3600 }, headers: { 'User-Agent': 'Mozilla/5.0' } }
    )
    if (!res.ok) return []
    const xml = await res.text()
    const items = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)]

    return items.slice(0, 12).map((match, i) => {
      const block = match[1]
      const title = block.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/)?.[1]
        || block.match(/<title>(.*?)<\/title>/)?.[1] || 'Trending'
      const traffic = block.match(/<ht:approx_traffic>(.*?)<\/ht:approx_traffic>/)?.[1] || ''
      const newsTitle = block.match(/<ht:news_item_title><!\[CDATA\[(.*?)\]\]>/)?.[1] || ''
      const newsImg = block.match(/<ht:picture>(.*?)<\/ht:picture>/)?.[1] || ''
      const link = block.match(/<link>(.*?)<\/link>/)?.[1] || `https://trends.google.com/trending?geo=${regionCode}`
      const trafficNum = traffic
        ? parseInt(traffic.replace(/[^0-9]/g, '')) * (traffic.includes('M') ? 1_000_000 : traffic.includes('K') ? 1_000 : 1)
        : (12 - i) * 10000

      return {
        id: `gt-${regionCode}-${i}`,
        platform: 'trends',
        title,
        channel: `🔥 ${traffic || 'Trending'} searches`,
        thumbnail: newsImg,
        views: trafficNum,
        likes: 0,
        publishedAt: new Date().toISOString(),
        url: link,
        tags: [title.toLowerCase()],
        subtitle: newsTitle,
      }
    })
  } catch {
    return []
  }
}

// ─── Main handler ─────────────────────────────────────────────────────────────
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const country = searchParams.get('country') || 'US'
  const platform = searchParams.get('platform') || 'all'
  const category = searchParams.get('category') || 'all'

  try {
    const [ytVideos, igData, gtCards] = await Promise.all([
      platform === 'instagram' || platform === 'trends'
        ? Promise.resolve([])
        : fetchYouTubeTrending(country, category),
      platform === 'youtube' || platform === 'trends'
        ? Promise.resolve({ reels: [], topics: [] })
        : fetchInstagramTrending(category, country),
      platform === 'instagram' || platform === 'youtube'
        ? Promise.resolve([])
        : fetchGoogleTrends(country),
    ])

    const igReels = (igData.reels || []) as any[]
    const igTopics = (igData.topics || []) as string[]

    const combined = [
      ...ytVideos.sort((a: any, b: any) => b.views - a.views),
      ...igReels.sort((a: any, b: any) => b.views - a.views),
      ...gtCards,
    ].slice(0, 50)

    // Build trending topics
    const stopWords = new Set([
      'this','that','with','from','have','will','your','what','when','they','been',
      'more','also','into','than','then','some','just','like','very','much','most',
      'over','such','only','even','back','after','first','well','year','know','take',
      'good','make','time','come','could','these','those','about','would','there',
      'their','which','other','were','been','video','watch','official','music','full',
      'reels','reel','trending','viral','explore','instagram','views','follow','reelsvideo',
    ])
    const allText = combined.map((v: any) => `${v.title} ${(v.tags || []).join(' ')}`).join(' ')
    const words = allText.toLowerCase().match(/\b[a-z]{4,}\b/g) || []
    const freq: Record<string, number> = {}
    words.forEach(w => { freq[w] = (freq[w] || 0) + 1 })
    const wordTopics = Object.entries(freq)
      .filter(([w]) => !stopWords.has(w))
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([word]) => word)

    const gtTopics = gtCards.slice(0, 8).map((t: any) => t.title)

    const trendingTopics = [...new Set([
      ...igTopics.slice(0, 8),
      ...gtTopics,
      ...wordTopics,
    ])].slice(0, 20)

    return NextResponse.json({ videos: combined, trendingTopics, country, category })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
