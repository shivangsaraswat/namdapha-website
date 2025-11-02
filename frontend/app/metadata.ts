import type { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL('https://namdapha.iitmbs.org'),
  title: {
    default: 'Namdapha House | General Student Body | IIT Madras',
    template: '%s | Namdapha House'
  },
  description: 'Namdapha House | General Student Body | IIT Madras',
  keywords: ['developer tools', 'SDK development', 'open source', 'software engineering', 'developer community', 'tech community', 'cross-platform development', 'Flutter', 'React Native', 'developer experience'],
  authors: [{ name: 'Namdapha House' }],
  creator: 'Namdapha House',
  publisher: 'Namdapha House',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://namdapha.iitmbs.org',
    siteName: 'Namdapha House',
    title: 'Namdapha House | General Student Body | IIT Madras',
    description: 'Namdapha House | General Student Body | IIT Madras',
    images: [{
      url: '/logo-namdapha.png',
      width: 1200,
      height: 630,
      alt: 'Namdapha House Logo',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Namdapha House | General Student Body | IIT Madras',
    description: 'Namdapha House | General Student Body | IIT Madras',
    images: ['/logo-namdapha.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};
