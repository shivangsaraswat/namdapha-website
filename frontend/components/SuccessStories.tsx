'use client'
import React, { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'

const SSList = [{
    id: 0,
    name: 'Devansh',
    profielpic: '/devansh.jpeg',
    story: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Aliquid inventore enim nisi, unde labore recusandae laudantium repudiandae reiciendis ipsam voluptates?"
},
{
    id: 1,
    name: 'Devansh',
    profielpic: '/devansh.jpeg',
    story: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Aliquid inventore enim nisi, unde labore recusandae laudantium repudiandae reiciendis ipsam voluptates?"
},
{
    id: 2,
    name: 'Devansh',
    profielpic: '/devansh.jpeg',
    story: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Aliquid inventore enim nisi, unde labore recusandae laudantium repudiandae reiciendis ipsam voluptates?"
},
{
    id: 3,
    name: 'Devansh',
    profielpic: '/devansh.jpeg',
    story: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Aliquid inventore enim nisi, unde labore recusandae laudantium repudiandae reiciendis ipsam voluptates?"
},
{
    id: 4,
    name: 'Devansh',
    profielpic: '/devansh.jpeg',
    story: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Aliquid inventore enim nisi, unde labore recusandae laudantium repudiandae reiciendis ipsam voluptates?"
},
{
    id: 5,
    name: 'Devansh',
    profielpic: '/devansh.jpeg',
    story: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Aliquid inventore enim nisi, unde labore recusandae laudantium repudiandae reiciendis ipsam voluptates?"
}
]

export default function SuccessStories() {
    const [hoverCard, setHover] = useState(2)
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    const find_card_state = (id: number, currentHover: number) => {
        if (id == currentHover) {
            return "hover"
        }
        if (id == currentHover - 1 || id == currentHover + 1) {
            return "beside_hover"
        }
        else {
            return "hidden"
        }
    }

    const debounce = (list: typeof SSList) => {
        if (timerRef.current) clearInterval(timerRef.current);

        // Start new interval
        timerRef.current = setInterval(() => {
            setHover((prev) => {
                return prev == list[list.length - 1]?.id ? 0 : prev + 1
            });
        }, 3000);

        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }

    useEffect(() => {
        debounce(SSList)
    }, [hoverCard])

    return (
        <div className='flex flex-col justify-center items-center'>
            <div className='grid auto-cols-max grid-flow-col justify-around items-center h-[30rem] w-full max-[600px]:h-[20rem] max-sm:mb-4 xl:h-[34rem]'>
                {SSList && SSList.map((story) => {
                    return (
                        <motion.div
                            key={story.id}
                            variants={{
                                hidden: { display: 'var(--non-hover-card-display)', width: 'var(--non-hover-card-width)', height: 'var(--non-hover-card-height)', transition: { delay: 0 }, opacity: 0.3 },
                                hover: {
                                    height: 'var(--hover-height)',
                                    width: 'var(--hover-width)',
                                    display: 'flex',
                                    transition: { delay: 0.1 },
                                    alignItems: 'end',
                                    flexDirection: 'column',
                                    justifyContent: 'end',
                                    opacity: 1
                                },
                                beside_hover: {
                                    height: 'var(--beside-hover-height)',
                                    width: 'var(--beside-hover-width)',
                                    display: 'block',
                                    transition: { delay: 0.1 },
                                    opacity: 0.7,
                                    justifyContent: 'start'
                                }
                            }}
                            initial='hidden'
                            animate={find_card_state(story.id, hoverCard)}
                            exit={find_card_state(story.id, hoverCard)}
                            onMouseEnter={() => window.innerWidth >= 768 && setHover(story.id)}
                            className='group border-2 border-gray-600 flex rounded-2xl bg-center bg-cover overflow-hidden relative
                            [--non-hover-card-display:none] md:[--non-hover-card-display:block]
                            [--non-hover-card-width:0] md:[--non-hover-card-width:8vw] lg:[--non-hover-card-width:10vw] xl:[--non-hover-card-width:10vw] 2xl:[--non-hover-card-width:8vw]
                            [--non-hover-card-height:0] md:[--non-hover-card-height:18rem] xl:[--non-hover-card-height:22rem]

                            [--hover-width:40vw] min-[425px]:[--hover-width:44vw] md:[--hover-width:32vw] lg:[--hover-width:28vw] xl:[--hover-width:26vw] 2xl:[--hover-width:20vw]
                            [--hover-height:18rem] min-[600px]:[--hover-height:24rem] lg:[--hover-height:30rem] xl:[--hover-height:32rem]

                            [--beside-hover-width:18vw] min-[425px]:[--beside-hover-width:20vw] md:[--beside-hover-width:15vw] xl:[--beside-hover-width:13vw] 2xl:[--beside-hover-width:10vw]
                            [--beside-hover-height:15rem] min-[600px]:[--beside-hover-height:18rem] lg:[--beside-hover-height:24rem] xl:[--beside-hover-height:26rem]'
                            style={{ backgroundImage: `url(${story.profielpic})`, justifyContent: "center", alignItems: "end" }}>
                            <motion.div
                                transition={{ duration: 0.25 }}
                                className='flex flex-col justify-center items-center origin-top-left max-sm:gap-1 absolute overflow-hidden h-fit rounded-xl
                                [--intro-bottom:0rem] md:[--intro-bottom:0rem] lg:[--intro-bottom:0rem]

                                [--intro-rotated-left:25%] md:[--intro-rotated-left:25%] lg:[--intro-rotated-left:30%]

                                [--non-hover-text-top:16rem] lg:[--non-hover-text-top:17rem] xl:[--non-hover-text-top:21rem]

                                [--rotated-text-top:13rem] min-[600px]:[--rotated-text-top:15.5rem] md:[--rotated-text-top:16rem] lg:[--rotated-text-top:20rem] xl:[--rotated-text-top:22rem]'
                                animate={hoverCard == story.id ? { rotate: 0, bottom: "var(--intro-bottom) !important", top: 'auto', backdropFilter: 'blur(12px)', backgroundColor: 'rgba(255,255,255,0.1)', padding: '8px 0 0 0', width: "90%", margin: '10px 0', left: '5%' } : { rotate: -90, top: (hoverCard == story.id + 1 || hoverCard == story.id - 1) ? 'var(--rotated-text-top)' : 'var(--non-hover-text-top)', left: 'var(--intro-rotated-left)', width: 'fit-content' }}
                            >
                                <motion.p
                                    animate={hoverCard == story.id ? { fontSize: 'var(--normal-text-size)' } : { fontSize: 'var(--rotated-text-size)' }}
                                    className='w-fit line-clamp-3 text-white/80 h-fit font-extrabold max-sm:tracking-[0.06rem] font-["BBH_Sans_Bartle"]
                                    [--normal-text-size:0.70rem] min-[600px]:[--normal-text-size:1.2rem]

                                    [--rotated-text-size:1.1rem] min-[600px]:[--rotated-text-size:1.4rem] md:[--rotated-text-size:1.5rem] lg:[--rotated-text-size:1.8rem] xl:[--rotated-text-size:2.2rem]'>{story.name}</motion.p>
                                <motion.p
                                    animate={hoverCard == story.id ? { height: 'var(--disc-height)' } : { height: 0 }}
                                    transition={hoverCard == story.id ? { duration: 1 } : { delay: 0, duration: 0 }}
                                    className='overflow-hidden px-4 text-center mb-3 max-sm:text-[9px] max-sm:px-1 [--disc-height:5rem] min-[425px]:[--disc-height:4rem] min-[600px]:text-xs lg:text-sm md:[--disc-height:6rem] xl:text-base'>{story.story}</motion.p>
                            </motion.div>
                        </motion.div>
                    )
                })}
            </div>
            <div className='flex gap-6 md:hidden'>
                <button
                    onClick={() => setHover(prev => prev - 1 >= 0 ? prev - 1 : SSList[SSList.length - 1].id)}
                    className="w-8 h-8 relative bg-gray-800/50 hover:bg-gray-700/70 hover:scale-110 rounded-full flex justify-center items-center shrink-0 cursor-pointer transition-all duration-300 border border-gray-600/30">
                    <svg className="w-5 h-5 lg:w-6 lg:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
                <button
                    onClick={() => setHover(prev => prev+1 <= SSList[SSList.length-1].id ? prev + 1 : 0)}
                    className="w-8 h-8 relative bg-gray-800/50 hover:bg-gray-700/70 hover:scale-110 rounded-full flex justify-center items-center shrink-0 cursor-pointer transition-all duration-300 backdrop-blur-sm border border-gray-600/30">
                    <svg className="w-5 h-5 lg:w-6 lg:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </button>
            </div>
        </div>
    )
}
