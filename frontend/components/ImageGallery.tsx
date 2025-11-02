import Image from 'next/image';
import React from 'react'

export default function ImageGallery() {
    const items = ['/bgmi.jpg', '/chess.jpg', '/valorant.jpg', '/freefire.jpg', '/coc.jpg', '/photography.jpg', '/devansh.jpeg']

    return (
        <div className="w-full md:w-[58%] grid grid-cols-3 gap-2 md:gap-4 relative max-md:h-[16rem] md:h-[28rem] lg:h-[36rem] overflow-hidden md:order-1">
            <div className='w-full h-5 absolute -top-1 bg-black z-10 blur-[10px]'/>
            <div className='w-full h-5 absolute -bottom-1 bg-black z-10 blur-[10px]'/>
            {[0, 1, 2].map((col) => (
                <div
                    key={col}
                    className={`flex flex-col gap-4 animate-marquee ${col % 2 == 1 ? "direction-down" : "direction-up"
                        }`}
                >
                    {[...items, ...items].map((link, i) => (
                        <Image width={500} height={500} alt=' ' src={link} className='h-auto w-auto'></Image>
                    ))}
                </div>
            ))}
        </div>
    )
}
