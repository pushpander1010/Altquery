import { ImageResponse } from 'next/og'

// Image metadata
export const size = {
  width: 180,
  height: 180,
}
export const contentType = 'image/png'

// Image generation
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 120,
          background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          borderRadius: '22%',
          fontWeight: 'bold',
          fontFamily: 'system-ui',
          boxShadow: '0 10px 40px rgba(79, 70, 229, 0.3)',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ fontSize: '80px', lineHeight: '80px' }}>A</div>
          <div style={{ 
            fontSize: '20px', 
            marginTop: '-10px',
            opacity: 0.9,
            letterSpacing: '2px'
          }}>
            Q
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}