import type { Metadata } from "next";
import "./globals.css";
import { manrope, montserrat, pacifico, questrial, dancingScript } from './fonts';
import PreloadData from '@/components/PreloadData';
import ConditionalFooter from '@/components/ConditionalFooter';
import PageWrapper from './page-wrapper';

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
        <PageWrapper>
          {children}
          <ConditionalFooter />
        </PageWrapper>
      </body>
    </html>
  );
}
