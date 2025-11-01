import { ImageResponse } from 'next/og'

export const dynamic = 'force-static'
export const alt = 'Namdapha House - Empower Community, Engineer Excellence'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'
 
export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 60,
          background: 'linear-gradient(135deg, #0A0A0B 0%, #1a1a1b 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontWeight: 'bold',
        }}
      >
        <div style={{ fontSize: 80, marginBottom: 20 }}>Namdapha House</div>
        <div style={{ fontSize: 40, color: '#9CA3AF' }}>
          Empower Community. Engineer Excellence.
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
