import { Youtube, Eye, Heart, Zap, ExternalLink, TrendingUp, Instagram } from 'lucide-react'

type Video = {
  id: string; platform: string; title: string; channel: string
  thumbnail: string; views: number; likes: number; publishedAt: string
  url: string; tags: string[]; subtitle?: string
}

function formatNum(n: number) {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M'
  if (n >= 1_000) return (n / 1_000).toFixed(0) + 'K'
  return String(n)
}

const platformStyles: Record<string, { bg: string; icon: React.ReactNode; label: string }> = {
  youtube: {
    bg: 'bg-red-600',
    icon: <Youtube className="w-3 h-3" />,
    label: 'YouTube',
  },
  instagram: {
    bg: 'bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400',
    icon: <Instagram className="w-3 h-3" />,
    label: 'Instagram',
  },
  trends: {
    bg: 'bg-gradient-to-r from-blue-600 to-cyan-500',
    icon: <TrendingUp className="w-3 h-3" />,
    label: 'Trending',
  },
}

export default function VideoCard({ video, rank, onUseIdea }: {
  video: Video; rank: number; onUseIdea: () => void
}) {
  const ps = platformStyles[video.platform] || platformStyles.trends
  const isTrend = video.platform === 'trends'
  const isInstagram = video.platform === 'instagram'

  return (
    <div className="card group hover:border-slate-600 transition-all duration-200 flex flex-col">
      {/* Thumbnail / Trend visual */}
      <div className="relative aspect-video rounded-lg overflow-hidden mb-3 bg-slate-800">
        {video.thumbnail ? (
          <img src={video.thumbnail} alt={video.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        ) : isInstagram ? (
          <div className="w-full h-full flex flex-col items-center justify-center p-3 bg-gradient-to-br from-purple-900 to-pink-900">
            <Instagram className="w-6 h-6 text-pink-400 mb-2" />
            <p className="text-white text-xs font-semibold text-center line-clamp-3">{video.title}</p>
          </div>
        ) : isTrend ? (
          <div className="w-full h-full flex flex-col items-center justify-center p-3 bg-gradient-to-br from-slate-800 to-slate-900">
            <TrendingUp className="w-6 h-6 text-cyan-400 mb-2" />
            <p className="text-white text-xs font-semibold text-center line-clamp-3">{video.title}</p>
          </div>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Youtube className="w-8 h-8 text-slate-600" />
          </div>
        )}

        {/* Rank badge */}
        <div className="absolute top-2 left-2 w-6 h-6 rounded-full bg-black/70 flex items-center justify-center text-xs font-bold text-white">
          {rank}
        </div>

        {/* Platform badge */}
        <div className={`absolute top-2 right-2 px-1.5 py-0.5 rounded text-xs font-medium flex items-center gap-1 text-white ${ps.bg}`}>
          {ps.icon}
        </div>
      </div>

      {/* Info */}
      <div className="flex-1 flex flex-col">
        <h3 className="text-sm font-medium text-slate-200 line-clamp-2 mb-1 leading-snug">
          {video.title}
        </h3>
        {video.subtitle && (
          <p className="text-xs text-slate-500 line-clamp-1 mb-1">{video.subtitle}</p>
        )}
        <p className="text-xs text-slate-500 mb-3">{video.channel}</p>

        <div className="flex items-center gap-3 text-xs text-slate-500 mb-3">
          {video.views > 0 && (
            <span className="flex items-center gap-1">
              <Eye className="w-3 h-3" />{formatNum(video.views)}
            </span>
          )}
          {video.likes > 0 && (
            <span className="flex items-center gap-1">
              <Heart className="w-3 h-3" />{formatNum(video.likes)}
            </span>
          )}
        </div>

        <div className="mt-auto flex gap-2">
          <a href={video.url} target="_blank" rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-1 py-1.5 text-xs border border-slate-700 rounded-lg text-slate-400 hover:text-white hover:border-slate-500 transition-colors">
            <ExternalLink className="w-3 h-3" /> {isTrend ? 'Explore' : isInstagram ? 'Reel' : 'Watch'}
          </a>
          <button onClick={onUseIdea}
            className="flex-1 flex items-center justify-center gap-1 py-1.5 text-xs bg-violet-600/20 border border-violet-500/30 rounded-lg text-violet-300 hover:bg-violet-600/30 transition-colors">
            <Zap className="w-3 h-3" /> Use Idea
          </button>
        </div>
      </div>
    </div>
  )
}
