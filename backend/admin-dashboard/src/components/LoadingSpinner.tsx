import Image from 'next/image';

export default function LoadingSpinner() {
  return (
    <div className="fixed inset-0 flex items-center justify-center animate-in fade-in duration-200" style={{ zIndex: 9999999 }}>
      <div className="absolute inset-0 bg-white/70 dark:bg-gray-900/70 backdrop-blur-lg"></div>
      
      <div className="relative animate-in zoom-in-50 duration-300">
        <div className="relative w-32 h-32">
          <div className="absolute inset-0 border-[3px] border-transparent border-t-slate-600 border-r-slate-500 rounded-full animate-[spin_1s_linear_infinite_reverse]"></div>
          <div className="absolute inset-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full border border-gray-200 dark:border-gray-700 shadow-2xl flex items-center justify-center">
            <Image
              src="/namd-new-logo.png"
              alt="Loading..."
              width={100}
              height={100}
              className="object-contain"
              priority
            />
          </div>
        </div>
      </div>
    </div>
  );
}
