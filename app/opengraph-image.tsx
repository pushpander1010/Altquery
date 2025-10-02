import { ImageResponse } from 'next/og'

// Image metadata
export const alt = 'AltQuery - Find Better Alternatives'
export const size = {
  width: 1200,
  height: 630,
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
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#f8fafc',
          backgroundImage: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        }}
      >
        {/* Logo */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'white',
            borderRadius: '50%',
            width: '120px',
            height: '120px',
            marginBottom: '40px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
          }}
        >
          <div
            style={{
              fontSize: '60px',
              fontWeight: 'bold',
              color: '#4F46E5',
              fontFamily: 'system-ui',
            }}
          >
            A
          </div>
        </div>

        {/* Title */}
        <div
          style={{
            fontSize: '72px',
            fontWeight: 'bold',
            color: 'white',
            textAlign: 'center',
            marginBottom: '20px',
            fontFamily: 'system-ui',
            textShadow: '0 4px 8px rgba(0,0,0,0.3)',
          }}
        >
          AltQuery
        </div>

        {/* Subtitle */}
        <div
          style={{
            fontSize: '36px',
            color: 'rgba(255,255,255,0.9)',
            textAlign: 'center',
            fontFamily: 'system-ui',
            fontWeight: '400',
          }}
        >
          Find Better Alternatives
        </div>

        {/* Features */}
        <div
          style={{
            display: 'flex',
            marginTop: '40px',
            gap: '40px',
            color: 'white',
            fontSize: '24px',
            fontFamily: 'system-ui',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ marginRight: '10px' }}>🤖</div>
            AI-Powered
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ marginRight: '10px' }}>⚡</div>
            Fast Search
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ marginRight: '10px' }}>🆓</div>
            Free to Use
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}