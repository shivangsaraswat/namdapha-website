import Image from 'next/image';
import React from 'react'

export default function ImageGallery() {
    const items = ['/_MG_0268.jpg', '/_MG_0296.jpg', '/_MG_0303.jpg', '/_MG_0307.jpg', '/_MG_0312.jpg', '/_MG_0336.jpg', '/_MG_0354.jpg', '/_MG_0355.jpg', '/_MG_0464.jpg']
    const rotations = ['-rotate-1', 'rotate-1', '-rotate-3']
    const margins = ['', 'ml-2', 'ml-2']

    return (
        <div className="w-full md:w-[58%] grid grid-cols-3 gap-2 md:gap-4 relative max-md:h-[20rem] max-md:overflow-hidden md:h-[40rem] lg:h-[50rem] md:order-1 md:ml-8 contain-paint">
            <div className='w-full h-5 absolute -top-1 bg-white z-10 blur-[10px] md:hidden'/>
            <div className='w-full h-5 absolute -bottom-1 bg-white z-10 blur-[10px] md:hidden'/>
            {[0, 1, 2].map((col) => (
                <div
                    key={col}
                    className={`flex flex-col gap-4 animate-marquee md:${rotations[col]} ${margins[col] ? `md:${margins[col]}` : ''} ${col % 2 == 1 ? "direction-down" : "direction-up"
                        }`}
                >
                    {[...items, ...items].map((link, i) => (
                        <React.Fragment key={`${col}-${i}`}>
                            <Image width={500} height={500} alt=' ' src={link} className='h-auto w-auto rounded-2xl md:hidden' loading={i < 3 ? 'eager' : 'lazy'} />
                            <div className='relative w-full aspect-[3/4] hidden md:block'>
                                <Image fill alt=' ' src={link} className='object-cover rounded-2xl' loading={i < 3 ? 'eager' : 'lazy'} sizes="33vw" />
                            </div>
                        </React.Fragment>
                    ))}
                </div>
            ))}
        </div>
    )
}
