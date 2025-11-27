import type { Metadata } from "next";
import "./globals.css";
import { manrope, montserrat, pacifico, questrial, dancingScript } from './fonts';
import PreloadData from '@/components/PreloadData';
import ConditionalFooter from '@/components/ConditionalFooter';
import PageWrapper from './page-wrapper';
import Navbar from '@/components/Navbar';
import KeyboardShortcuts from '@/components/KeyboardShortcuts';


export const metadata: Metadata = {
  metadataBase: new URL('https://namdapha.iitmbs.org'),
  title: {
    default: 'Namdapha House | IIT Madras BS Degree Student Community',
    template: '%s | Namdapha House'
  },
  description: 'Namdapha House is the premier student community at IIT Madras BS Degree program. Join 5000+ students in academics, events, and leadership opportunities.',
  keywords: ['Namdapha House', 'Namdapha House IIT Madras', 'Namdapha House IIT Madras BS', 'IIT Madras BS Degree', 'IIT Madras BS', 'IIT Madras BS Degree Namdapha', 'Namdapha', 'IIT Madras Online Degree', 'IIT Madras BS Student House', 'Namdapha IIT', 'IIT BS Degree Houses'],
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
    title: 'Namdapha House | IIT Madras BS Degree Student Community',
    description: 'Namdapha House is the premier student community at IIT Madras BS Degree program. Join 5000+ students in academics, events, and leadership opportunities.',
    images: [{
      url: '/logo-namdapha.png',
      width: 1200,
      height: 630,
      alt: 'Namdapha House Logo',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Namdapha House | IIT Madras BS Degree Student Community',
    description: 'Namdapha House is the premier student community at IIT Madras BS Degree program. Join 5000+ students in academics, events, and leadership opportunities.',
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
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="canonical" href="https://namdapha.iitmbs.org" />
        <meta name="google-site-verification" content="mpSdF5WiiPmGlysMAibZs4zuVdXTrNi00Teo5ikUe_4" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="192x192" href="/icon-192.png" />
        <link rel="icon" type="image/png" sizes="512x512" href="/icon-512.png" />
        <meta name="theme-color" content="#0A0A0B" />
        <script dangerouslySetInnerHTML={{__html: `
          document.addEventListener('contextmenu', e => e.preventDefault());
          if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
            (function() {
              const noop = () => {};
              ['log', 'debug', 'info', 'warn', 'table', 'trace', 'dir', 'group', 'groupCollapsed', 'clear', 'count', 'assert', 'profile', 'time', 'timeEnd'].forEach(m => console[m] = noop);
              setInterval(() => console.clear(), 1000);
              document.addEventListener('keydown', e => {
                if (e.key === 'F12' || (e.ctrlKey && e.shiftKey && ['I','J','C'].includes(e.key)) || (e.metaKey && e.altKey && ['i','j','c'].includes(e.key))) {
                  e.preventDefault();
                  return false;
                }
              });
            })();
          }
        `}} />
      </head>
      <body
        className={`${manrope.variable} ${montserrat.variable} ${pacifico.variable} ${questrial.variable} ${dancingScript.variable} antialiased`}
      >
        <PreloadData />
        <KeyboardShortcuts />
        <Navbar />
        <PageWrapper>
          {children}
          <ConditionalFooter />
        </PageWrapper>
      </body>
    </html>
  );
}
