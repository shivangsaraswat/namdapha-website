"use client";

const column1Images = [
  "/_MG_0268.jpg",
  "/_MG_0296.jpg",
  "/_MG_0303.jpg",
];

const column2Images = [
  "/_MG_0307.jpg",
  "/_MG_0312.jpg",
  "/whatsapp-1.jpg",
];

const column3Images = [
  "/_MG_0354.jpg",
  "/_MG_0355.jpg",
  "/_MG_0464.jpg",
];

const column4Images = [
  "/_MG_0268.jpg",
  "/_MG_0336.jpg",
  "/whatsapp-2.jpg",
];

const column5Images = [
  "/_MG_0303.jpg",
  "/_MG_0336.jpg",
  "/_MG_0296.jpg",
];

export default function AnimatedGallery() {
  return (
    <>
      <style jsx global>{`
        @keyframes scrollUp {
          from { transform: translateY(0); }
          to { transform: translateY(-33.333%); }
        }
        @keyframes scrollDown {
          from { transform: translateY(-33.333%); }
          to { transform: translateY(0); }
        }
      `}</style>
      
      <div className="fixed inset-0 z-0 pointer-events-none" style={{ opacity: 0.3 }}>
        <div className="flex gap-4 h-screen overflow-hidden">
          {/* Column 1 */}
          <div className="flex-1 flex flex-col gap-4" style={{ animation: 'scrollUp 60s linear infinite' }}>
            {[...column1Images, ...column1Images, ...column1Images].map((img, i) => (
              <div key={i} className="w-full h-64 flex-shrink-0" style={{ transform: 'rotate(6deg)' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={img} 
                  alt="" 
                  className="w-full h-full object-cover rounded-xl"
                  style={{ filter: 'grayscale(100%)' }}
                />
              </div>
            ))}
          </div>

          {/* Column 2 */}
          <div className="flex-1 flex flex-col gap-4" style={{ animation: 'scrollDown 60s linear infinite' }}>
            {[...column2Images, ...column2Images, ...column2Images].map((img, i) => (
              <div key={i} className="w-full h-64 flex-shrink-0" style={{ transform: 'rotate(-6deg)' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={img} 
                  alt="" 
                  className="w-full h-full object-cover rounded-xl"
                  style={{ filter: 'grayscale(100%)' }}
                />
              </div>
            ))}
          </div>

          {/* Column 3 */}
          <div className="flex-1 flex flex-col gap-4" style={{ animation: 'scrollUp 60s linear infinite', animationDelay: '-10s' }}>
            {[...column3Images, ...column3Images, ...column3Images].map((img, i) => (
              <div key={i} className="w-full h-64 flex-shrink-0" style={{ transform: 'rotate(3deg)' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={img} 
                  alt="" 
                  className="w-full h-full object-cover rounded-xl"
                  style={{ filter: 'grayscale(100%)' }}
                />
              </div>
            ))}
          </div>

          {/* Column 4 */}
          <div className="flex-1 flex flex-col gap-4" style={{ animation: 'scrollDown 60s linear infinite', animationDelay: '-20s' }}>
            {[...column4Images, ...column4Images, ...column4Images].map((img, i) => (
              <div key={i} className="w-full h-64 flex-shrink-0" style={{ transform: 'rotate(-3deg)' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={img} 
                  alt="" 
                  className="w-full h-full object-cover rounded-xl"
                  style={{ filter: 'grayscale(100%)' }}
                />
              </div>
            ))}
          </div>

          {/* Column 5 */}
          <div className="flex-1 flex flex-col gap-4" style={{ animation: 'scrollUp 60s linear infinite', animationDelay: '-30s' }}>
            {[...column5Images, ...column5Images, ...column5Images].map((img, i) => (
              <div key={i} className="w-full h-64 flex-shrink-0" style={{ transform: 'rotate(6deg)' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={img} 
                  alt="" 
                  className="w-full h-full object-cover rounded-xl"
                  style={{ filter: 'grayscale(100%)' }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
