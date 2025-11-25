import type { Metadata } from "next";

export const metadata: Metadata = {
    title: 'Resources Hub',
    description: 'Access comprehensive academic resources for IIT Madras BS Degree students. Find notes, PYQs, video lectures, recommended books, and important contacts all in one place.',
    keywords: ['IIT Madras BS Resources', 'Study Materials', 'Notes', 'PYQs', 'Video Lectures', 'Academic Resources', 'Namdapha Resources'],
    openGraph: {
        type: 'website',
        locale: 'en_US',
        url: 'https://namdapha.iitmbs.org/resources',
        siteName: 'Namdapha House',
        title: 'Resources Hub | Namdapha House',
        description: 'Access comprehensive academic resources for IIT Madras BS Degree students. Find notes, PYQs, video lectures, recommended books, and important contacts all in one place.',
        images: [{
            url: '/logo-namdapha.png',
            width: 1200,
            height: 630,
            alt: 'Namdapha House Resources',
        }],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Resources Hub | Namdapha House',
        description: 'Access comprehensive academic resources for IIT Madras BS Degree students. Find notes, PYQs, video lectures, recommended books, and important contacts all in one place.',
        images: ['/logo-namdapha.png'],
    },
};

export default function ResourcesLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
