import type { Metadata } from "next";

export const metadata: Metadata = {
    title: 'WhatsApp Community',
    description: 'Join the official Namdapha House WhatsApp community. Connect with 5000+ IIT Madras BS Degree students, get instant updates, and engage in meaningful discussions.',
    keywords: ['Namdapha WhatsApp', 'IIT Madras BS WhatsApp', 'Student Community', 'WhatsApp Group', 'Student Network'],
    openGraph: {
        type: 'website',
        locale: 'en_US',
        url: 'https://namdapha.iitmbs.org/whatsapp',
        siteName: 'Namdapha House',
        title: 'WhatsApp Community | Namdapha House',
        description: 'Join the official Namdapha House WhatsApp community. Connect with 5000+ IIT Madras BS Degree students, get instant updates, and engage in meaningful discussions.',
        images: [{
            url: '/logo-namdapha.png',
            width: 1200,
            height: 630,
            alt: 'Namdapha House WhatsApp Community',
        }],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'WhatsApp Community | Namdapha House',
        description: 'Join the official Namdapha House WhatsApp community. Connect with 5000+ IIT Madras BS Degree students, get instant updates, and engage in meaningful discussions.',
        images: ['/logo-namdapha.png'],
    },
};

export default function WhatsAppLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
