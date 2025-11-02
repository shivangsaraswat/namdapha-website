'use client'
import Image from 'next/image'
import React, { useState } from 'react'
import { motion } from 'motion/react'

const dummyData = [
    {
        name: "Valorant Vanguards",
        description: "Tactical minds meet here — participate in Valorant tournaments, discussions, and team-building for the win.",
        logo: "5_20251023_223111_0004.svg",
        poster: "/valorant.jpg",
        category: "Gaming & Strategy"
    },
    {
        name: "Clanforge",
        description: "Build, battle, and bond — unite with fellow strategists for casual and competitive Clash of Clans gaming.",
        logo: "2_20251023_223111_0001.svg",
        poster: "/coc.jpg",
        category: "Gaming & Strategy"
    },
    {
        name: "The Battleground",
        description: "Squad up for high-octane BGMI matches — from fun room games to intense competitions, we play it all.",
        logo: "8_20251023_223111_0007.svg",
        poster: "/bgmi.jpg",
        category: "Gaming & Strategy"
    },
    {
        name: "Knights64",
        description: "Check your mind and master your moves through tournaments, puzzles, and engaging chess discussions.",
        logo: "7_20251023_223111_0006.svg",
        poster: "/chess.jpg",
        category: "Gaming & Strategy"
    },
    {
        name: "FireStorm",
        description: "For those who live for the thrill of battle — join casual and competitive Free Fire matches with your housemates.",
        logo: "/FreeStorm.png",
        poster: "/freefire.jpg",
        category: "Gaming & Strategy"
    },
    {
        name: "Geek Squad",
        description: "A reserved circle for true tech enthusiasts — coding, hackathons, robotics, and serious team collaborations await.",
        logo: "/4_20251023_223111_0003.svg",
        poster: "/freefire.jpg",
        category: "Tech & Innovation"
    },
    {
        name: "ElectroSphere",
        description: "A dedicated space for ES students of our house — connect, collaborate, and share course updates and opportunities.",
        logo: "/11_20251023_223111_0010.svg",
        poster: "/freefire.jpg",
        category: "Tech & Innovation"
    },
    {
        name: "Trivia Titans",
        description: "Fuel your curiosity with quizzes, trivia nights, and practice sessions designed to challenge and excite your mind.",
        logo: "/6_20251023_223111_0005.svg",
        poster: "/freefire.jpg",
        category: "Tech & Innovation"
    },
    {
        name: "Kavya",
        description: "A haven for poets, storytellers, and writers - let your imagination flow through verses, tales, and creative expression.",
        logo: "/9_20251023_223111_0008.svg",
        poster: "/freefire.jpg",
        category: "Arts, Expression & Public Speaking"
    },
    {
        name: "Pulse of Arts",
        description: "Where creativity comes alive — showcase your talent in photography, dance, music, sketching, and all things artistic.",
        logo: "/10_20251023_223111_0009.svg",
        poster: "/photography.jpg",
        category: "Arts, Expression & Public Speaking"
    },
    {
        name: "The Podium",
        description: "Where words win wars — join for debates, JAMs, and public speaking sessions that sharpen your expression and confidence.",
        logo: "/3_20251023_223111_0002.svg",
        poster: "/freefire.jpg",
        category: "Arts, Expression & Public Speaking"
    },
]

export default function Activites() {
    const [activityCategory, setCategory] = useState('Gaming & Strategy')

    return (
        <section className='flex flex-col items-center z-10 relative justify-center text-white bg-black overflow-hidden'>
            {/* Sparkling Stars Across Entire Section */}
            <div className='absolute inset-0 pointer-events-none'>
                {[...Array(50)].map((_, i) => (
                    <div
                        key={i}
                        className='absolute w-1 h-1 bg-white rounded-full animate-twinkle'
                        style={{
                            top: `${Math.random() * 100}%`,
                            left: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 3}s`,
                            animationDuration: `${2 + Math.random() * 2}s`
                        }}
                    />
                ))}
            </div>
            {/* Curved Divider */}
            <div className='w-full overflow-hidden leading-[0]'>
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

                    {/* Right Side - 2x2 Grid of Cards */}
                    <div className='w-full lg:w-3/5 relative'>
                        
                        <motion.div className='grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-8 max-w-2xl mx-auto' variants={{ initial: { display: 'none', opacity: 0, scale: 0.8 }, selected: { opacity: 1, scale: 1, display: 'grid', transition: { delay: 0.3, ease: 'easeIn' } } }} transition={{ duration: 0.4 }} animate={activityCategory == "Gaming & Strategy" ? 'selected' : 'initial'}>
                            {dummyData.filter((element) => element.category == "Gaming & Strategy").slice(0, 4).map((element) => (
                                <div key={element.name} className='relative rounded-xl border border-gray-700 bg-black overflow-visible'>
                                    <div className='absolute -inset-[1px] rounded-xl bg-pink-700 blur-lg animate-border-glow'></div>
                                    <div className='relative bg-black rounded-xl flex flex-col justify-center items-center'>
                                        <Image src={element.poster} alt={element.name} width={50} height={50} className='h-48 w-full rounded-t-[10px] object-cover mb-2' />
                                        <Image src={element.logo} alt={element.name} width={50} height={50} className='h-22 w-22 rounded-full -mt-13 bg-black object-cover' />
                                        <h4 className='text-base mb-2 font-medium lg:text-lg w-full text-start px-4'>{element.name}</h4>
                                        <p className='text-gray-300 text-xs lg:text-sm w-full text-start pl-4 pr-4 text-pretty line-clamp-3'>{element.description}</p>
                                        <div className='flex w-full px-4 my-4'>
                                            <button className='bg-black border text-white px-2 py-1 rounded-md w-full cursor-pointer'>Register</button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </motion.div>
                        
                        <motion.div className='grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-8 max-w-2xl mx-auto' variants={{ initial: { display: 'none', opacity: 0, scale: 0.8 }, selected: { opacity: 1, scale: 1, display: 'grid', transition: { delay: 0.3, ease: 'easeIn' } } }} transition={{ duration: 0.4 }} animate={activityCategory == "Tech & Innovation" ? 'selected' : 'initial'}>
                            {dummyData.filter((element) => element.category == "Tech & Innovation").slice(0, 4).map((element) => (
                                <div key={element.name} className='relative rounded-xl border border-gray-700 bg-black overflow-visible'>
                                    <div className='absolute -inset-[1px] rounded-xl bg-pink-700 blur-lg animate-border-glow'></div>
                                    <div className='relative bg-black rounded-xl flex flex-col justify-center items-center'>
                                        <Image src={element.poster} alt={element.name} width={50} height={50} className='h-48 w-full rounded-t-[10px] object-cover bg-transparent mb-2' />
                                        <Image src={element.logo} alt={element.name} width={50} height={50} className='h-22 w-22 rounded-full -mt-13 bg-black object-cover' />
                                        <h4 className='text-base mb-2 font-medium lg:text-lg w-full text-start px-4'>{element.name}</h4>
                                        <p className='text-gray-300 text-xs lg:text-sm w-full text-start pl-4 pr-4 text-pretty line-clamp-3'>{element.description}</p>
                                        <div className='flex w-full px-4 my-4'>
                                            <button className='bg-black border text-white px-2 py-1 rounded-md w-full cursor-pointer'>Register</button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </motion.div>
                        
                        <motion.div className='grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-8 max-w-2xl mx-auto' variants={{ initial: { display: 'none', opacity: 0, scale: 0.8 }, selected: { opacity: 1, scale: 1, display: 'grid', transition: { delay: 0.3, ease: 'easeIn' } } }} transition={{ duration: 0.4 }} animate={activityCategory == "Arts, Expression & Public Speaking" ? 'selected' : 'initial'}>
                            {dummyData.filter((element) => element.category == "Arts, Expression & Public Speaking").slice(0, 4).map((element) => (
                                <div key={element.name} className='relative rounded-xl border border-gray-700 bg-black overflow-visible'>
                                    <div className='absolute -inset-[1px] rounded-xl bg-pink-700 blur-lg animate-border-glow'></div>
                                    <div className='relative bg-black rounded-xl flex flex-col justify-center items-center'>
                                        <Image src={element.poster} alt={element.name} width={50} height={50} className='h-48 w-full rounded-t-[10px] object-cover mb-2' />
                                        <Image src={element.logo} alt={element.name} width={50} height={50} className='h-22 w-22 rounded-full -mt-13 bg-black object-cover' />
                                        <h4 className='text-base mb-2 font-medium lg:text-lg w-full text-start px-4'>{element.name}</h4>
                                        <p className='text-gray-300 text-xs lg:text-sm w-full text-start pl-4 pr-4 text-pretty line-clamp-3'>{element.description}</p>
                                        <div className='flex w-full px-4 my-4'>
                                            <button className='bg-black border text-white px-2 py-1 rounded-md w-full cursor-pointer'>Register</button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </motion.div>
                    </div>
                </div>
            </div>
            
            {/* Curved Divider at Bottom - Inverted */}
            <div className='w-full overflow-hidden leading-[0]'>
                <svg className='relative block w-full h-[100px] md:h-[150px]' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1440 120' preserveAspectRatio='none'>
                    <path d='M0,120 C240,20 480,20 720,70 C960,120 1200,120 1440,70 L1440,120 L0,120 Z' fill='#000000'></path>
                </svg>
            </div>
        </section>
    )
}
