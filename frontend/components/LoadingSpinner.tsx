import Image from 'next/image';

export default function LoadingSpinner() {
  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 z-[999999] flex items-center justify-center bg-black/95 backdrop-blur-lg" style={{ isolation: 'isolate', position: 'fixed', width: '100vw', height: '100vh' }}>
      <div className="absolute inset-0 z-0">
        <Image
          src="/councilbg.svg"
          alt="Background"
          fill
          className="object-cover opacity-15"
          priority
        />
      </div>
      
      <div className="relative z-10 animate-in zoom-in-50 duration-300">
        <div className="relative w-48 h-48">
          <div className="absolute inset-0 border-[3px] border-transparent border-t-purple-500 border-r-purple-400 rounded-full animate-[spin_1s_linear_infinite_reverse]"></div>
          <div className="absolute inset-3 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 shadow-2xl flex items-center justify-center">
            <Image
              src="/logo-namdapha.png"
              alt="Loading..."
              width={150}
              height={150}
              className="object-contain"
              priority
            />
          </div>
        </div>
      </div>
    </div>
  );
}
