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
        <section className='flex flex-col items-center z-10 relative justify-center text-white bg-black py-10 max-sm:px-8 md:px-10'>
            <div className=' md:w-10/12 lg:w-8/12 xl:w-6/12 flex flex-col justify-center items-center gap-6'>
                <h2 className='text-4xl md:text-5xl text-center xl:text-6xl font-bold bg-[radial-gradient(89.47%_51.04%_at_44.27%_50%,_#E2E3E9_0%,_#D4D6DE_52.73%,_#3D3F4C_100%)] bg-clip-text text-transparent'>Namdapha Activites</h2>
                <p className='text-center text-sm lg:text-base font-light text-gray-300 text-pretty'>Namdapha Activities brings together a vibrant mix of 11 communities — from gaming and coding to art, storytelling, and debate. It’s where students connect, collaborate, and grow by pursuing what they love beyond the classroom.</p>
            </div>
            <div className='flex text-sm lg:text-base text-pretty rounded-xl border border-gray-600 divide-x-2 divide-gray-600 relative my-6'>
                <p onClick={() => setCategory('Gaming & Strategy')} aria-checked={activityCategory == "Gaming & Strategy"} className='cursor-pointer text-center px-2 py-2 lg:px-4 aria-checked:shadow-[0px_0px_30px_10px_rgba(59,12,187,1)] rounded-l-xl'>Gaming Arena</p>
                <p onClick={() => setCategory('Tech & Innovation')} aria-checked={activityCategory == "Tech & Innovation"} className='cursor-pointer text-center px-2 py-2 lg:px-4 aria-checked:shadow-[0px_0px_45px_10px_rgba(59,12,187,1)]'>Tech Clubs</p>
                <p onClick={() => setCategory('Arts, Expression & Public Speaking')} aria-checked={activityCategory == "Arts, Expression & Public Speaking"} className='cursor-pointer text-center px-2 py-2 lg:px-4 aria-checked:shadow-[0px_0px_45px_10px_rgba(59,12,187,1)] rounded-r-xl'>Arts & Culture</p>
            </div>
            <div className='flex mx-auto justify-center items-center w-full my-6'>
                <motion.div className='items-start justify-center w-full gap-4 flex-wrap' variants={{ initial: { display: 'none', opacity: 0, scale: 0.8 }, selected: { opacity: 1, scale: 1, display: 'flex', transition: { delay: 0.6, ease: 'easeIn' } } }} transition={{ duration: 0.6 }} animate={activityCategory == "Gaming & Strategy" ? 'selected' : 'initial'}>
                    {dummyData.filter((element) => element.category == "Gaming & Strategy").map((element) => {
                        return (
                            <div className='w-64 min-[500]:w-5/12 md:w-64 relative border border-gray-700 rounded-xl flex flex-col justify-center items-center lg:w-64 bg-black'>
                                <Image src={element.poster} alt='Valorant' width={50} height={50} className='h-32 w-full rounded-xl object-cover mb-2' />
                                <Image src={element.logo} alt='Valorant' width={50} height={50} className='h-22 w-22 rounded-full -mt-13 bg-black object-cover' />
                                <h4 className='text-base mb-2 font-medium lg:text-lg w-full text-start px-4'>{element.name}</h4>
                                <p className='text-gray-300 text-xs lg:text-base w-full text-start pl-4 pr-6 text-pretty'>{element.description}</p>
                                <div className='flex w-full px-4 my-4'>
                                    <button className='bg-black border text-white px-2 py-1 rounded-md w-full cursor-pointer'>Register</button>
                                </div>
                            </div>)
                    })}
                </motion.div>
                <motion.div className='items-start justify-center w-full gap-4 flex-wrap' variants={{ initial: { display: 'none', opacity: 0, scale: 0.8 }, selected: { opacity: 1, scale: 1, display: 'flex', transition: { delay: 0.6, ease: 'easeIn' } } }} transition={{ duration: 0.6 }} animate={activityCategory == "Tech & Innovation" ? 'selected' : 'initial'}>
                    {dummyData.filter((element) => element.category == "Tech & Innovation").map((element) => {
                        return (
                            <div className='w-64 relative border border-gray-700 rounded-xl flex flex-col justify-center items-center lg:w-64 bg-black'>
                                <Image src={element.poster} alt='Valorant' width={50} height={50} className='h-32 w-full rounded-xl object-cover bg-transparent mb-2' />
                                <Image src={element.logo} alt='Valorant' width={50} height={50} className='h-22 w-22 rounded-full -mt-13 bg-black object-cover' />
                                <h4 className='text-base mb-2 font-medium lg:text-xl w-full text-start px-4'>{element.name}</h4>
                                <p className='text-gray-300 text-xs lg:text-base w-full text-start pl-4 pr-6 text-pretty'>{element.description}</p>
                                <div className='flex w-full px-4 my-4'>
                                    <button className='bg-black border text-white px-2 py-1 rounded-md w-full cursor-pointer'>Register</button>
                                </div>
                            </div>)
                    })}
                </motion.div>
                <motion.div className='items-start justify-center w-full gap-4 flex-wrap' variants={{ initial: { display: 'none', opacity: 0, scale: 0.8 }, selected: { opacity: 1, scale: 1, display: 'flex', transition: { delay: 0.6, ease: 'easeIn' } } }} transition={{ duration: 0.6 }} animate={activityCategory == "Arts, Expression & Public Speaking" ? 'selected' : 'initial'}>
                    {dummyData.filter((element) => element.category == "Arts, Expression & Public Speaking").map((element) => {
                        return (
                            <div className='w-64 relative border border-gray-700 rounded-xl flex flex-col justify-center items-center lg:w-64 bg-black'>
                                <Image src={element.poster} alt='Valorant' width={50} height={50} className='h-32 w-full rounded-xl object-cover mb-2' />
                                <Image src={element.logo} alt='Valorant' width={50} height={50} className='h-22 w-22 rounded-full -mt-13 bg-black object-cover' />
                                <h4 className='text-base mb-2 font-medium lg:text-xl w-full text-start px-4'>{element.name}</h4>
                                <p className='text-gray-300 text-xs lg:text-base w-full text-start pl-4 pr-6 text-pretty'>{element.description}</p>
                                <div className='flex w-full px-4 my-4'>
                                    <button className='bg-black border text-white px-2 py-1 rounded-md w-full cursor-pointer'>Register</button>
                                </div>
                            </div>)
                    })}
                </motion.div>
            </div >
        </section >
    )
}
