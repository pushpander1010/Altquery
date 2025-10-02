import { ImageResponse } from 'next/og'

// Image metadata
export const alt = 'AltQuery - Find Better Alternatives'
export const size = {
  width: 1200,
  height: 600,
}
export const contentType = 'image/png'

// Image generation
export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: '#1a202c',
          padding: '60px',
        }}
      >
        {/* Left side - Content */}
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
          <div
            style={{
              fontSize: '64px',
              fontWeight: 'bold',
              color: '#4F46E5',
              marginBottom: '20px',
              fontFamily: 'system-ui',
            }}
          >
            AltQuery
          </div>
          <div
            style={{
              fontSize: '32px',
              color: 'white',
              marginBottom: '30px',
              fontFamily: 'system-ui',
              lineHeight: 1.2,
            }}
          >
            Find Better Alternatives to Any Software
          </div>
          <div
            style={{
              display: 'flex',
              gap: '20px',
              fontSize: '18px',
              color: '#a0aec0',
              fontFamily: 'system-ui',
            }}
          >
            <span>🤖 AI-Powered</span>
            <span>⚡ Instant Results</span>
            <span>🆓 Free</span>
          </div>
        </div>

        {/* Right side - Logo */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#4F46E5',
            borderRadius: '50%',
            width: '200px',
            height: '200px',
            marginLeft: '60px',
          }}
        >
          <div
            style={{
              fontSize: '100px',
              fontWeight: 'bold',
              color: 'white',
              fontFamily: 'system-ui',
            }}
          >
            A
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}