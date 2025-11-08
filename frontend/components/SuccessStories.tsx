'use client'
import React, { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'

const SSList = [{
    id: 0,
    name: 'Chess Squad Champions',
    profielpic: '/Chess.png',
    story: "Our chess team dominated the inter-house championship, showcasing exceptional strategic thinking and teamwork. Congratulations to all winners!"
},
{
    id: 1,
    name: 'Kho Kho Female Warriors',
    profielpic: '/KhoKho.png',
    story: "The female Kho Kho team delivered outstanding performances, demonstrating speed, agility, and remarkable coordination. A proud moment for Namdapha!"
},
{
    id: 2,
    name: 'IPL Auction Winners',
    profielpic: '/IPLAuction.png',
    story: "Strategic brilliance and quick thinking led our team to victory in the IPL Auction event. Their analytical skills and teamwork were truly exceptional!"
},
{
    id: 3,
    name: 'Sprint Saga & Escape Room',
    profielpic: '/SprintSagaandescaperoom.png',
    story: "Amazing achievements in multiple events! From lightning-fast sprints to solving complex puzzles, our champions proved their versatility and determination!"
},
]

export default function SuccessStories() {
    const [currentIndex, setCurrentIndex] = useState(0)
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    // Rotate to next card
    const rotateCards = () => {
        setCurrentIndex((prev) => (prev + 1) % SSList.length);
    }

    // Auto-rotate every 4 seconds
    useEffect(() => {
        if (timerRef.current) clearInterval(timerRef.current);

        timerRef.current = setInterval(rotateCards, 4000);

        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [])

    // Get the order of cards for display
    const getOrderedCards = () => {
        const ordered = [];
        for (let i = 0; i < SSList.length; i++) {
            const index = (currentIndex + i) % SSList.length;
            ordered.push({ ...SSList[index], position: i });
        }
        return ordered;
    }

    const handlePrevious = () => {
        if (timerRef.current) clearInterval(timerRef.current);
        setCurrentIndex((prev) => (prev - 1 + SSList.length) % SSList.length);
        timerRef.current = setInterval(rotateCards, 4000);
    }

    const handleNext = () => {
        if (timerRef.current) clearInterval(timerRef.current);
        rotateCards();
        timerRef.current = setInterval(rotateCards, 4000);
    }

    return (
        <div className='flex flex-col justify-center items-center md:w-[58%] lg:w-[60%] overflow-hidden contain-paint'>
            {/* Desktop View - Horizontal Carousel */}
            <div className='hidden md:flex items-center justify-center gap-3 lg:gap-4 w-full h-[30rem] lg:h-[34rem] xl:h-[38rem] will-change-transform'>
                {getOrderedCards().map((story, index) => {
                    const isFeatured = index === 0;
                    
                    return (
                        <motion.div
                            key={story.id}
                            layout
                            initial={false}
                            animate={{
                                width: isFeatured ? 'var(--featured-width)' : 'var(--queue-width)',
                                opacity: isFeatured ? 1 : 0.7,
                            }}
                            transition={{
                                layout: { duration: 0.6, ease: [0.4, 0, 0.2, 1] },
                                width: { duration: 0.6, ease: [0.4, 0, 0.2, 1] },
                                opacity: { duration: 0.4 },
                            }}
                            className='relative rounded-2xl overflow-hidden border-2 border-gray-600 cursor-pointer flex-shrink-0
                            [--featured-width:32vw] lg:[--featured-width:30vw] xl:[--featured-width:28vw] 2xl:[--featured-width:26vw]
                            [--queue-width:5vw] lg:[--queue-width:5.5vw] xl:[--queue-width:6vw] 2xl:[--queue-width:6vw]
                            h-[26rem] lg:h-[30rem] xl:h-[34rem]'
                            onClick={() => !isFeatured && handleNext()}
                        >
                            <Image
                                src={story.profielpic}
                                alt={story.name}
                                fill
                                sizes="(max-width: 1024px) 28vw, 24vw"
                                quality={85}
                                loading="lazy"
                                className="object-cover object-center"
                            />
                            
                            {/* Gradient overlay - stronger for queue cards */}
                            <motion.div 
                                initial={false}
                                animate={{
                                    opacity: isFeatured ? 1 : 0.5,
                                }}
                                transition={{ duration: 0.4 }}
                                className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" 
                            />
                            


                            {/* Rotated title for queue cards */}
                            {!isFeatured && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.3, delay: 0.2 }}
                                    className='absolute inset-0 flex items-center justify-center'
                                >
                                    <div className='transform -rotate-90 whitespace-nowrap'>
                                        <p className='text-white font-bold text-base lg:text-lg xl:text-xl drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]'>
                                            {story.name}
                                        </p>
                                    </div>
                                </motion.div>
                            )}
                        </motion.div>
                    );
                })}
            </div>

            {/* Mobile View - Single Card */}
            <div className='md:hidden w-full h-[22rem] relative'>
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentIndex}
                        initial={{ opacity: 0, x: 100 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -100 }}
                        transition={{ duration: 0.5 }}
                        className='absolute inset-0 rounded-2xl overflow-hidden border-2 border-gray-600'
                    >
                        <Image
                            src={SSList[currentIndex].profielpic}
                            alt={SSList[currentIndex].name}
                            fill
                            sizes="100vw"
                            quality={85}
                            className="object-cover object-center"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                        

                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Navigation Buttons */}
            <div className='flex gap-6 mt-6 md:mt-8'>
                <button
                    onClick={handlePrevious}
                    className="w-10 h-10 lg:w-12 lg:h-12 relative bg-gray-800/50 hover:bg-gray-700/70 hover:scale-110 rounded-full flex justify-center items-center shrink-0 cursor-pointer transition-all duration-300 border border-gray-600/30">
                    <svg className="w-5 h-5 lg:w-6 lg:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
                <button
                    onClick={handleNext}
                    className="w-10 h-10 lg:w-12 lg:h-12 relative bg-gray-800/50 hover:bg-gray-700/70 hover:scale-110 rounded-full flex justify-center items-center shrink-0 cursor-pointer transition-all duration-300 backdrop-blur-sm border border-gray-600/30">
                    <svg className="w-5 h-5 lg:w-6 lg:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </button>
            </div>

            {/* Progress Indicators */}
            <div className='flex gap-2 mt-4'>
                {SSList.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => {
                            if (timerRef.current) clearInterval(timerRef.current);
                            setCurrentIndex(index);
                            timerRef.current = setInterval(rotateCards, 4000);
                        }}
                        className={`h-1.5 rounded-full transition-all duration-300 ${
                            index === currentIndex 
                                ? 'w-8 bg-white' 
                                : 'w-1.5 bg-white/40 hover:bg-white/60'
                        }`}
                    />
                ))}
            </div>
        </div>
    )
}
