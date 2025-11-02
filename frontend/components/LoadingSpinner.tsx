import Image from 'next/image';

export default function LoadingSpinner() {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center animate-in fade-in duration-200">
      <div className="absolute inset-0">
        <Image
          src="/councilbg.svg"
          alt="Background"
          fill
          className="object-cover"
          priority
        />
      </div>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm"></div>
      
      <div className="relative animate-in zoom-in-50 duration-300">
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
