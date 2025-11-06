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
          background: 'linear-gradient(135deg, #0A0A0B 0%, #1a1a1b 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '80px',
        }}
      >
        <img
          src="https://namdapha.iitmbs.org/logo-namdapha.png"
          alt="Namdapha Logo"
          width="300"
          height="300"
          style={{ marginRight: '60px' }}
        />
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            color: 'white',
          }}
        >
          <div style={{ fontSize: 72, fontWeight: 'bold', marginBottom: 20 }}>
            Namdapha House
          </div>
          <div style={{ fontSize: 36, color: '#9CA3AF', marginBottom: 10 }}>
            Empower Community. Engineer Excellence.
          </div>
          <div style={{ fontSize: 28, color: '#6B7280' }}>
            General Student Body | IIT Madras
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
