import type { Metadata } from "next";

export const metadata: Metadata = {
    title: 'About Us',
    description: 'Learn about Namdapha House, the premier student community at IIT Madras BS Degree program. Discover our mission, vision, and how we support 5000+ students in their academic journey.',
    keywords: ['About Namdapha', 'Namdapha House Mission', 'IIT Madras BS Community', 'Student House', 'Academic Support'],
    openGraph: {
        type: 'website',
        locale: 'en_US',
        url: 'https://namdapha.iitmbs.org/about',
        siteName: 'Namdapha House',
        title: 'About Us | Namdapha House',
        description: 'Learn about Namdapha House, the premier student community at IIT Madras BS Degree program. Discover our mission, vision, and how we support 5000+ students in their academic journey.',
        images: [{
            url: '/logo-namdapha.png',
            width: 1200,
            height: 630,
            alt: 'About Namdapha House',
        }],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'About Us | Namdapha House',
        description: 'Learn about Namdapha House, the premier student community at IIT Madras BS Degree program. Discover our mission, vision, and how we support 5000+ students in their academic journey.',
        images: ['/logo-namdapha.png'],
    },
};

export default function AboutLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
