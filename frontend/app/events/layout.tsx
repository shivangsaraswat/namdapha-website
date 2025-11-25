import type { Metadata } from "next";

export const metadata: Metadata = {
    title: 'Events',
    description: 'Explore upcoming and past events at Namdapha House. Join workshops, competitions, cultural activities, and academic sessions designed for IIT Madras BS Degree students.',
    keywords: ['Namdapha Events', 'IIT Madras BS Events', 'Student Activities', 'Workshops', 'Competitions', 'House Events'],
    openGraph: {
        type: 'website',
        locale: 'en_US',
        url: 'https://namdapha.iitmbs.org/events',
        siteName: 'Namdapha House',
        title: 'Events | Namdapha House',
        description: 'Explore upcoming and past events at Namdapha House. Join workshops, competitions, cultural activities, and academic sessions designed for IIT Madras BS Degree students.',
        images: [{
            url: '/logo-namdapha.png',
            width: 1200,
            height: 630,
            alt: 'Namdapha House Events',
        }],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Events | Namdapha House',
        description: 'Explore upcoming and past events at Namdapha House. Join workshops, competitions, cultural activities, and academic sessions designed for IIT Madras BS Degree students.',
        images: ['/logo-namdapha.png'],
    },
};

export default function EventsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
