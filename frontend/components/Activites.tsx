'use client'
import Image from 'next/image'
import React, { useState, useEffect } from 'react'
import { motion } from 'motion/react'
import { activitiesService, Activity } from '@/lib/activitiesService'

const dummyData: Activity[] = [
    {
        name: "Valorant Vanguards",
        description: "Tactical minds meet here — participate in Valorant tournaments, discussions, and team-building for the win.",
        logo: "5_20251023_223111_0004.svg",
        poster: "/valorant.webp",
        category: "Gaming & Strategy",
        isVisible: true,
        order: 0,
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        name: "Clanforge",
        description: "Build, battle, and bond — unite with fellow strategists for casual and competitive Clash of Clans gaming.",
        logo: "2_20251023_223111_0001.svg",
        poster: "/coc.webp",
        category: "Gaming & Strategy",
        isVisible: true,
        order: 1,
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        name: "The Battleground",
        description: "Squad up for high-octane BGMI matches — from fun room games to intense competitions, we play it all.",
        logo: "8_20251023_223111_0007.svg",
        poster: "/bgmi.webp",
        category: "Gaming & Strategy",
        isVisible: true,
        order: 2,
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        name: "Knights64",
        description: "Check your mind and master your moves through tournaments, puzzles, and engaging chess discussions.",
        logo: "7_20251023_223111_0006.svg",
        poster: "/chess.webp",
        category: "Gaming & Strategy",
        isVisible: true,
        order: 3,
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        name: "FireStorm",
        description: "For those who live for the thrill of battle — join casual and competitive Free Fire matches with your housemates.",
        logo: "/FreeStorm.png",
        poster: "/freefire.webp",
        category: "Gaming & Strategy",
        isVisible: true,
        order: 4,
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        name: "Geek Squad",
        description: "A reserved circle for true tech enthusiasts — coding, hackathons, robotics, and serious team collaborations await.",
        logo: "/4_20251023_223111_0003.svg",
        poster: "/freefire.webp",
        category: "Tech & Innovation",
        isVisible: true,
        order: 5,
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        name: "ElectroSphere",
        description: "A dedicated space for ES students of our house — connect, collaborate, and share course updates and opportunities.",
        logo: "/11_20251023_223111_0010.svg",
        poster: "/freefire.webp",
        category: "Tech & Innovation",
        isVisible: true,
        order: 6,
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        name: "Trivia Titans",
        description: "Fuel your curiosity with quizzes, trivia nights, and practice sessions designed to challenge and excite your mind.",
        logo: "/6_20251023_223111_0005.svg",
        poster: "/freefire.webp",
        category: "Tech & Innovation",
        isVisible: true,
        order: 7,
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        name: "Kavya",
        description: "A haven for poets, storytellers, and writers - let your imagination flow through verses, tales, and creative expression.",
        logo: "/9_20251023_223111_0008.svg",
        poster: "/freefire.webp",
        category: "Arts, Expression & Public Speaking",
        isVisible: true,
        order: 8,
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        name: "Pulse of Arts",
        description: "Where creativity comes alive — showcase your talent in photography, dance, music, sketching, and all things artistic.",
        logo: "/10_20251023_223111_0009.svg",
        poster: "/photography.webp",
        category: "Arts, Expression & Public Speaking",
        isVisible: true,
        order: 9,
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        name: "The Podium",
        description: "Where words win wars — join for debates, JAMs, and public speaking sessions that sharpen your expression and confidence.",
        logo: "/3_20251023_223111_0002.svg",
        poster: "/freefire.webp",
        category: "Arts, Expression & Public Speaking",
        isVisible: true,
        order: 10,
        createdAt: new Date(),
        updatedAt: new Date()
    },
]

export default function Activites() {
    const [activityCategory, setCategory] = useState('Gaming & Strategy')
    const [activities, setActivities] = useState<Activity[]>([])
    const [, setLoading] = useState(true)
    const [stars, setStars] = useState<Array<{top: string, left: string, delay: string, duration: string}>>([])
    const [noLinkDialogOpen, setNoLinkDialogOpen] = useState(false)
    const [selectedActivity, setSelectedActivity] = useState('')
    const [detailsDialogOpen, setDetailsDialogOpen] = useState(false)
    const [selectedActivityDetails, setSelectedActivityDetails] = useState<Activity | null>(null)
    const scrollContainerRef = React.useRef<HTMLDivElement>(null)

    useEffect(() => {
        const container = scrollContainerRef.current
        if (!container) return

        const scroll = () => {
            const maxScroll = container.scrollWidth - container.clientWidth
            const currentScroll = container.scrollLeft
            
            if (currentScroll >= maxScroll) {
                container.scrollTo({ left: 0, behavior: 'smooth' })
            } else {
                container.scrollBy({ left: container.clientWidth * 0.65, behavior: 'smooth' })
            }
        }

        const interval = setInterval(scroll, 3000)
        return () => clearInterval(interval)
    }, [activityCategory])

    useEffect(() => {
        const fetchActivities = async () => {
            try {
                const data = await activitiesService.getVisibleActivities()
                setActivities(data)
            } catch (error) {
                console.error('Failed to fetch activities:', error)
            } finally {
                setLoading(false)
            }
        }
        fetchActivities()
    }, [])

    useEffect(() => {
        setStars(Array.from({ length: 50 }, () => ({
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            delay: `${Math.random() * 3}s`,
            duration: `${2 + Math.random() * 2}s`
        })))
    }, [])

    const displayData = activities.length > 0 ? activities : dummyData

    return (
        <section className='flex flex-col items-center z-10 relative justify-center text-white bg-black overflow-hidden transform-gpu contain-paint'>
            {/* Sparkling Stars Across Entire Section */}
            <div className='absolute inset-0 pointer-events-none'>
                {stars.map((star, i) => (
                    <div
                        key={i}
                        className='absolute w-1 h-1 bg-white rounded-full animate-twinkle'
                        style={{
                            top: star.top,
                            left: star.left,
                            animationDelay: star.delay,
                            animationDuration: star.duration
                        }}
                    />
                ))}
            </div>
            {/* Curved Divider */}
            <div className='w-full overflow-hidden leading-[0] transform-gpu'>
                <svg className='relative block w-full h-[100px] md:h-[150px]' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1440 120' preserveAspectRatio='none'>
                    <path d='M0,0 C240,100 480,100 720,50 C960,0 1200,0 1440,50 L1440,0 L0,0 Z' fill='rgb(228,229,231)'></path>
                </svg>
            </div>
            
            <div className='w-full py-10 px-6 md:px-10 lg:px-12'>
                <div className='max-w-7xl mx-auto flex flex-col lg:flex-row gap-8 items-start'>
                    {/* Left Side - Heading and Category Selector */}
                    <div className='w-full lg:w-2/5 flex flex-col gap-6'>
                        <h2 className='text-4xl md:text-5xl xl:text-6xl font-title font-medium bg-[radial-gradient(89.47%_51.04%_at_44.27%_50%,_#E2E3E9_0%,_#D4D6DE_52.73%,_#3D3F4C_100%)] bg-clip-text text-transparent'>Namdapha Activites</h2>
                        <p className='text-sm lg:text-base font-light text-gray-300 text-pretty'>Namdapha Activities brings together a vibrant mix of 11 communities — from gaming and coding to art, storytelling, and debate. It&apos;s where students connect, collaborate, and grow by pursuing what they love beyond the classroom.</p>
                        
                        <div className='flex flex-col gap-3 mt-4'>
                            <button onClick={() => setCategory('Gaming & Strategy')} className={`text-left px-4 py-3 rounded-xl border transition-all ${activityCategory == "Gaming & Strategy" ? 'bg-purple-900/30 border-purple-800/50 shadow-[0px_0px_30px_10px_rgba(59,12,187,0.3)]' : 'border-gray-600 hover:border-gray-500'}`}>Gaming Arena</button>
                            <button onClick={() => setCategory('Tech & Innovation')} className={`text-left px-4 py-3 rounded-xl border transition-all ${activityCategory == "Tech & Innovation" ? 'bg-purple-900/30 border-purple-800/50 shadow-[0px_0px_30px_10px_rgba(59,12,187,0.3)]' : 'border-gray-600 hover:border-gray-500'}`}>Tech Clubs</button>
                            <button onClick={() => setCategory('Arts, Expression & Public Speaking')} className={`text-left px-4 py-3 rounded-xl border transition-all ${activityCategory == "Arts, Expression & Public Speaking" ? 'bg-purple-900/30 border-purple-800/50 shadow-[0px_0px_30px_10px_rgba(59,12,187,0.3)]' : 'border-gray-600 hover:border-gray-500'}`}>Arts & Culture</button>
                        </div>
                    </div>

                    {/* Right Side - Cards */}
                    <div className='w-full lg:w-3/5 relative'>
                        {/* Mobile Horizontal Scroll */}
                        <div className='md:hidden'>
                            {['Gaming & Strategy', 'Tech & Innovation', 'Arts, Expression & Public Speaking'].map(cat => (
                                activityCategory == cat && (
                                    <div key={cat} ref={scrollContainerRef} className='flex overflow-x-auto gap-4 snap-x snap-mandatory scrollbar-hide pb-4'>
                                        {displayData.filter((element) => element.category == cat).slice(0, 4).map((element) => (
                                            <div key={element.name} className='relative rounded-xl border border-gray-700 bg-black overflow-visible contain-paint flex-shrink-0 w-[65vw] snap-start'>
                                                <div className='absolute -inset-[1px] rounded-xl bg-pink-700 blur-lg animate-border-glow'></div>
                                                <div className='relative bg-black rounded-xl flex flex-col justify-center items-center'>
                                                    <Image src={element.poster} alt={element.name} width={400} height={300} className='h-48 w-full rounded-t-[10px] object-cover mb-2' priority />
                                                    <Image src={element.logo} alt={element.name} width={88} height={88} className='h-22 w-22 rounded-full -mt-13 bg-black object-cover' priority />
                                                    <h4 className='text-base mb-2 font-medium lg:text-lg w-full text-start px-4'>{element.name}</h4>
                                                    <p className='text-gray-300 text-xs lg:text-sm w-full text-start pl-4 pr-4 text-pretty line-clamp-3'>{element.description}</p>
                                                    <div className='flex flex-col gap-2 w-full px-4 my-4'>
                                                        <button onClick={() => { setSelectedActivityDetails(element); setDetailsDialogOpen(true); }} className='bg-black border text-white px-2 py-1 rounded-md w-full cursor-pointer hover:bg-gray-900 transition-colors'>View Details</button>
                                                        {element.registrationLink ? (
                                                            <a href={element.registrationLink} target='_blank' rel='noopener noreferrer' className='bg-black border text-white px-2 py-1 rounded-md w-full cursor-pointer text-center hover:bg-gray-900 transition-colors'>Register</a>
                                                        ) : (
                                                            <button onClick={() => { setSelectedActivity(element.name); setNoLinkDialogOpen(true); }} className='bg-black border text-white px-2 py-1 rounded-md w-full cursor-pointer hover:bg-gray-900 transition-colors'>Register</button>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )
                            ))}
                        </div>
                        
                        {/* Desktop Grid */}
                        <div className='hidden md:block'>
                            {['Gaming & Strategy', 'Tech & Innovation', 'Arts, Expression & Public Speaking'].map(cat => (
                            <motion.div key={cat} className='grid grid-cols-2 gap-x-6 gap-y-8 max-w-2xl mx-auto' variants={{ initial: { display: 'none', opacity: 0, scale: 0.8 }, selected: { opacity: 1, scale: 1, display: 'grid', transition: { delay: 0.3, ease: 'easeIn' } } }} transition={{ duration: 0.4 }} animate={activityCategory == cat ? 'selected' : 'initial'}>
                                {displayData.filter((element) => element.category == cat).slice(0, 4).map((element) => (
                                    <div key={element.name} className='relative rounded-xl border border-gray-700 bg-black overflow-visible contain-paint'>
                                        <div className='absolute -inset-[1px] rounded-xl bg-pink-700 blur-lg animate-border-glow'></div>
                                        <div className='relative bg-black rounded-xl flex flex-col justify-center items-center'>
                                            <Image src={element.poster} alt={element.name} width={400} height={300} className='h-48 w-full rounded-t-[10px] object-cover mb-2' priority />
                                            <Image src={element.logo} alt={element.name} width={88} height={88} className='h-22 w-22 rounded-full -mt-13 bg-black object-cover' priority />
                                            <h4 className='text-base mb-2 font-medium lg:text-lg w-full text-start px-4'>{element.name}</h4>
                                            <p className='text-gray-300 text-xs lg:text-sm w-full text-start pl-4 pr-4 text-pretty line-clamp-3'>{element.description}</p>
                                            <div className='flex flex-col gap-2 w-full px-4 my-4'>
                                                <button onClick={() => { setSelectedActivityDetails(element); setDetailsDialogOpen(true); }} className='bg-black border text-white px-2 py-1 rounded-md w-full cursor-pointer hover:bg-gray-900 transition-colors'>View Details</button>
                                                {element.registrationLink ? (
                                                    <a href={element.registrationLink} target='_blank' rel='noopener noreferrer' className='bg-black border text-white px-2 py-1 rounded-md w-full cursor-pointer text-center hover:bg-gray-900 transition-colors'>Register</a>
                                                ) : (
                                                    <button onClick={() => { setSelectedActivity(element.name); setNoLinkDialogOpen(true); }} className='bg-black border text-white px-2 py-1 rounded-md w-full cursor-pointer hover:bg-gray-900 transition-colors'>Register</button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Curved Divider at Bottom - Inverted */}
            <div className='w-full overflow-hidden leading-[0] transform-gpu'>
                <svg className='relative block w-full h-[100px] md:h-[150px]' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1440 120' preserveAspectRatio='none'>
                    <path d='M0,120 C240,20 480,20 720,70 C960,120 1200,120 1440,70 L1440,120 L0,120 Z' fill='#000000'></path>
                </svg>
            </div>

            {/* No Registration Link Dialog */}
            {noLinkDialogOpen && (
                <div className='fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4' onClick={() => setNoLinkDialogOpen(false)}>
                    <div className='bg-black/70 backdrop-blur-sm rounded-2xl p-6 md:p-10 border-2 border-white max-w-md w-full relative' onClick={(e) => e.stopPropagation()}>
                        <button onClick={() => setNoLinkDialogOpen(false)} className='absolute top-4 right-4 bg-white/50 hover:bg-white/70 text-gray-900 rounded-lg px-4 py-2 text-xl transition-colors'>
                            ×
                        </button>
                        <div className='text-center py-6 md:py-8'>
                            <h3 className='text-xl md:text-[28px] font-bold text-white mb-3 md:mb-4'>{selectedActivity}</h3>
                            <p className='text-white/90 text-sm md:text-[16px] whitespace-nowrap'>Registration form is not available yet. Coming soon!</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Activity Details Dialog */}
            {detailsDialogOpen && selectedActivityDetails && (
                <div className='fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 overflow-y-auto' onClick={() => setDetailsDialogOpen(false)}>
                    <div className='bg-black/70 backdrop-blur-sm rounded-2xl p-6 md:p-8 border-2 border-white max-w-4xl w-full relative overflow-hidden my-auto' onClick={(e) => e.stopPropagation()}>
                        <button onClick={() => setDetailsDialogOpen(false)} className='absolute top-4 right-4 z-20 bg-white/50 hover:bg-white/70 text-gray-900 rounded-lg px-4 py-2 text-xl transition-colors'>
                            ×
                        </button>
                        
                        {/* Mobile: Background with poster and logo */}
                        <div className='md:hidden absolute inset-0 z-0'>
                            <Image src={selectedActivityDetails.poster} alt={selectedActivityDetails.name} fill className='object-cover opacity-20' />
                        </div>
                        
                        {/* Desktop: Two column layout */}
                        <div className='flex flex-col md:flex-row gap-6 relative z-10'>
                            {/* Left side - Poster and Logo (Desktop only) */}
                            <div className='hidden md:flex md:w-1/2 flex-col items-center'>
                                <div className='relative w-full mb-8'>
                                    <Image src={selectedActivityDetails.poster} alt={selectedActivityDetails.name} width={400} height={300} className='w-full h-64 rounded-xl object-cover' />
                                    <Image src={selectedActivityDetails.logo} alt={selectedActivityDetails.name} width={88} height={88} className='absolute left-1/2 -translate-x-1/2 -bottom-11 h-22 w-22 rounded-full bg-black object-cover border-4 border-black' />
                                </div>
                            </div>
                            
                            {/* Right side - Content */}
                            <div className='md:w-1/2 flex flex-col items-center py-4 md:py-0'>
                                <h3 className='text-2xl md:text-3xl font-bold text-white mb-4 drop-shadow-lg self-start'>{selectedActivityDetails.name}</h3>
                                <p className='text-white/90 text-sm md:text-base leading-relaxed drop-shadow-md mb-4 self-start'>{selectedActivityDetails.description}</p>
                                <div className='w-1/2'>
                                    {selectedActivityDetails.registrationLink ? (
                                        <a href={selectedActivityDetails.registrationLink} target='_blank' rel='noopener noreferrer' className='block bg-black border text-white px-4 py-2 rounded-md text-center hover:bg-gray-900 transition-colors'>Register</a>
                                    ) : (
                                        <button onClick={() => { setDetailsDialogOpen(false); setSelectedActivity(selectedActivityDetails.name); setNoLinkDialogOpen(true); }} className='w-full bg-black border text-white px-4 py-2 rounded-md hover:bg-gray-900 transition-colors'>Register</button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </section>
    )
}
