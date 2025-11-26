import type { Metadata } from "next";

export const metadata: Metadata = {
    title: 'Grade Predictor | Namdapha House',
    description: 'Plan your academic success with precision. Calculate potential grades and requirements for BS Data Science and BS Electronic Systems at IIT Madras.',
    keywords: ['Grade Predictor', 'IIT Madras BS', 'BS Data Science', 'BS Electronic Systems', 'Grade Calculator', 'CGPA Calculator', 'Namdapha House'],
    openGraph: {
        type: 'website',
        locale: 'en_US',
        url: 'https://namdapha.iitmbs.org/resources/grade-predictor',
        siteName: 'Namdapha House',
        title: 'Grade Predictor | Namdapha House',
        description: 'Plan your academic success with precision. Calculate potential grades and requirements for BS Data Science and BS Electronic Systems at IIT Madras.',
        images: [{
            url: '/logo-namdapha.png',
            width: 1200,
            height: 630,
            alt: 'Namdapha House - Grade Predictor',
        }],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Grade Predictor | Namdapha House',
        description: 'Plan your academic success with precision. Calculate potential grades and requirements for BS Data Science and BS Electronic Systems at IIT Madras.',
        images: ['/logo-namdapha.png'],
    },
    robots: {
        index: true,
        follow: true,
    },
};

export default function GradePredictorLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
