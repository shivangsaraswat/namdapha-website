import { MetadataRoute } from 'next'

export const dynamic = 'force-static'
 
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Namdapha House',
    short_name: 'Namdapha',
    description: 'Empower Community, Engineer Excellence',
    start_url: '/',
    display: 'standalone',
    background_color: '#0A0A0B',
    theme_color: '#0A0A0B',
    icons: [
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}
