import type { Metadata } from "next";

export const metadata: Metadata = {
    title: 'Teams',
    description: 'Discover the diverse teams that make Namdapha House thrive. From technical operations to creative content, meet the students building our community.',
    keywords: ['Namdapha Teams', 'Student Teams', 'House Teams', 'IIT Madras BS Teams', 'Student Organizations'],
    openGraph: {
        type: 'website',
        locale: 'en_US',
        url: 'https://namdapha.iitmbs.org/teams',
        siteName: 'Namdapha House',
        title: 'Teams | Namdapha House',
        description: 'Discover the diverse teams that make Namdapha House thrive. From technical operations to creative content, meet the students building our community.',
        images: [{
            url: '/logo-namdapha.png',
            width: 1200,
            height: 630,
            alt: 'Namdapha House Teams',
        }],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Teams | Namdapha House',
        description: 'Discover the diverse teams that make Namdapha House thrive. From technical operations to creative content, meet the students building our community.',
        images: ['/logo-namdapha.png'],
    },
};

export default function TeamsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
