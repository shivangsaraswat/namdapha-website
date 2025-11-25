import type { Metadata } from "next";

export const metadata: Metadata = {
    title: 'Council',
    description: 'Meet the Namdapha House Council - the student leaders driving our community forward. Learn about our council members, their roles, and how they serve 5000+ IIT Madras BS students.',
    keywords: ['Namdapha Council', 'Student Council', 'House Leaders', 'IIT Madras BS Leadership', 'Student Government'],
    openGraph: {
        type: 'website',
        locale: 'en_US',
        url: 'https://namdapha.iitmbs.org/council',
        siteName: 'Namdapha House',
        title: 'Council | Namdapha House',
        description: 'Meet the Namdapha House Council - the student leaders driving our community forward. Learn about our council members, their roles, and how they serve 5000+ IIT Madras BS students.',
        images: [{
            url: '/logo-namdapha.png',
            width: 1200,
            height: 630,
            alt: 'Namdapha House Council',
        }],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Council | Namdapha House',
        description: 'Meet the Namdapha House Council - the student leaders driving our community forward. Learn about our council members, their roles, and how they serve 5000+ IIT Madras BS students.',
        images: ['/logo-namdapha.png'],
    },
};

export default function CouncilLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
