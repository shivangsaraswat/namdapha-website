import type { Metadata } from "next";

export const metadata: Metadata = {
    title: 'The Creators - Credits',
    description: 'Meet the talented team behind Namdapha House. Discover the Web Operations, Design, and Content teams who built and maintain this platform for 5000+ IIT Madras BS students.',
    keywords: ['Namdapha Credits', 'Namdapha Team', 'Web Operations Team', 'Design Team', 'Content Team', 'IIT Madras BS Team', 'Student Leadership'],
    openGraph: {
        type: 'website',
        locale: 'en_US',
        url: 'https://namdapha.iitmbs.org/credits',
        siteName: 'Namdapha House',
        title: 'The Creators - Credits | Namdapha House',
        description: 'Meet the talented team behind Namdapha House. Discover the Web Operations, Design, and Content teams who built and maintain this platform for 5000+ IIT Madras BS students.',
        images: [{
            url: '/logo-namdapha.png',
            width: 1200,
            height: 630,
            alt: 'Namdapha House - The Creators',
        }],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'The Creators - Credits | Namdapha House',
        description: 'Meet the talented team behind Namdapha House. Discover the Web Operations, Design, and Content teams who built and maintain this platform for 5000+ IIT Madras BS students.',
        images: ['/logo-namdapha.png'],
    },
    robots: {
        index: true,
        follow: true,
    },
};

export default function CreditsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
