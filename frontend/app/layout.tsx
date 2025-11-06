import type { Metadata } from "next";
import "./globals.css";
import { manrope, montserrat, pacifico, questrial, dancingScript } from './fonts';
import PreloadData from '@/components/PreloadData';
import ConditionalFooter from '@/components/ConditionalFooter';
import PageWrapper from './page-wrapper';
import Navbar from '@/components/Navbar';


export const metadata: Metadata = {
  metadataBase: new URL('https://namdapha.iitmbs.org'),
  title: {
    default: 'Namdapha House | General Student Body | IIT Madras',
    template: '%s | Namdapha House'
  },
  description: 'A vibrant house built on tradition, values, and excellence. Namdapha stands as a beacon of pride within the IIT Madras BS community.',
  keywords: ['IIT Madras', 'BS Degree', 'Namdapha House', 'IIT Madras BS Degree', 'IIT Madras BS', 'Sundarbans house IIT Madras BS', 'Gir House IIT Madras BS', 'Wayanad House IIT Madras BS', 'Kaziranga House IITM Madras BS', 'Online Degree IIT Madras'],
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
    description: 'A vibrant house built on tradition, values, and excellence. Namdapha stands as a beacon of pride within the IIT Madras BS community.',
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
    description: 'A vibrant house built on tradition, values, and excellence. Namdapha stands as a beacon of pride within the IIT Madras BS community.',
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="canonical" href="https://namdapha.iitmbs.org" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="192x192" href="/icon-192.png" />
        <link rel="icon" type="image/png" sizes="512x512" href="/icon-512.png" />
        <meta name="theme-color" content="#0A0A0B" />
      </head>
      <body
        className={`${manrope.variable} ${montserrat.variable} ${pacifico.variable} ${questrial.variable} ${dancingScript.variable} antialiased`}
      >
        <PreloadData />
        <Navbar />
        <PageWrapper>
          {children}
          <ConditionalFooter />
        </PageWrapper>
      </body>
    </html>
  );
}
