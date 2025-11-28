export interface Contributor {
    id: string;
    name: string;
    role: string;
    team: string;
    description: string;
    imageUrl: string;
    socials?: {
        linkedin?: string;
        github?: string;
        twitter?: string;
        instagram?: string;
    };
}

export const CONTRIBUTORS: Contributor[] = [
    // Web Operations Team
    // {
    //     id: "1",
    //     name: "Harshita Dudeja",
    //     role: "Web Administrator",
    //     team: "Web Operations Team",
    //     description: "Handles routine platform oversight, monitors daily activity and supports basic maintenance tasks. Assists the technical team by ensuring smooth day-to-day website operations.",
    //     imageUrl: "https://res.cloudinary.com/dogq9gvo8/image/upload/v1764064167/hr_kuecrj.webp",
    //     socials: {
    //         linkedin: "#"
    //     }
    // },
    {
        id: "2",
        name: "Shivang Saraswat",
        role: "Operations Lead",
        team: "Web Operations Team",
        description: "Leads all technical and operational aspects of the platform. Designed the system architecture, manages DevOps pipelines, oversees deployments and security, and maintains the admin dashboard. Leads key technical decisions and guides the overall operational direction of the platform.",
        imageUrl: "https://res.cloudinary.com/dolduvvij/image/upload/v1763641007/WhatsApp_Image_2025-11-05_at_16.48.45_xcksjc.png",
        socials: {
            linkedin: "#",
            github: "#"
        }
    },
    {
        id: "3",
        name: "Uttkarsh Patel",
        role: "Frontend Developer",
        team: "Web Operations Team",
        description: "Developed major user-facing components and contributed to the overall interface architecture. Focused on building responsive layouts, clean interactions and an efficient client-side experience that aligns with modern standards.",
        imageUrl: "https://res.cloudinary.com/dogq9gvo8/image/upload/v1764064168/utraksh_ronowy.jpg",
        socials: {
            linkedin: "#",
            github: "#"
        }
    },
    // {
    //     id: "4",
    //     name: "Jagadish Prasad",
    //     role: "Backend Developer",
    //     team: "Web Operations Team",
    //     description: "Worked on backend modules and core service logic. Assisted in shaping API structures, integrating backend processes and improving the reliability and performance of server-side components.",
    //     imageUrl: "https://res.cloudinary.com/dogq9gvo8/image/upload/v1764064167/jk_fub8cg.jpg",
    //     socials: {
    //         linkedin: "#",
    //         github: "#"
    //     }
    // },
    // {
    //     id: "5",
    //     name: "Arya Sinha",
    //     role: "UI/UX Designer",
    //     team: "Web Operations Team",
    //     description: "Played a key role in shaping the early user experience direction. Contributed to user flows, wireframes and initial interface concepts that guided the visual and functional evolution of the platform.",
    //     imageUrl: "https://res.cloudinary.com/dogq9gvo8/image/upload/v1764066908/arya_axmqyk.png",
    //     socials: {
    //         linkedin: "#"
    //     }
    // },
    // {
    //     id: "6",
    //     name: "Devansh Malhotra",
    //     role: "House Secretary",
    //     team: "Web Operations Team",
    //     description: "Managed and curated all informational resources for the platform, including PYQs, notes, reference material and essential academic documents. Ensured that all content was collected, verified, organized and made readily accessible for integration into the website.",
    //     imageUrl: "https://res.cloudinary.com/dogq9gvo8/image/upload/v1764064167/devansh_diikdf.jpg",
    //     socials: {
    //         linkedin: "#"
    //     }
    // },
    // Multimedia Team
    {
        id: "7",
        name: "Prashant Tiwari",
        role: "Multimedia Lead",
        team: "Multimedia Team",
        description: "Directed the creative vision for the platform's visual and media assets. Ensured a cohesive design language across all materials and oversaw the production of graphics, visual elements and multimedia content.",
        imageUrl: "https://res.cloudinary.com/dogq9gvo8/image/upload/v1764064167/prashnat_bhy0xf.jpg",
        socials: {
            linkedin: "#"
        }
    },
    {
        id: "8",
        name: "Deepika Kumari",
        role: "Graphic Designer",
        team: "Multimedia Team",
        description: "Produced high-quality graphics, illustrations and flashcards that shaped the platform's visual identity. Focused on creating clean, engaging designs tailored to enhance user understanding and overall experience.",
        imageUrl: "https://res.cloudinary.com/dogq9gvo8/image/upload/v1764064167/deepika_lod2fa.jpg",
        socials: {
            linkedin: "#"
        }
    }
];
