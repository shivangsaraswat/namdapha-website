import Link from 'next/link';
import Image from 'next/image';
import { dancingScript } from '@/app/fonts';

export default function CommunityFooter() {
  return (
    <footer className="bg-white border-t border-[#E5E7EB] mt-8 mb-14 md:mb-0">
      <div className="max-w-6xl mx-auto px-3 sm:px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-2">
              <Image src="/logo-namdapha.png" alt="Namdapha House" width={28} height={28} className="object-contain" />
              <span className={`text-base text-black ${dancingScript.className}`}>Namdapha Community</span>
            </div>
            <p className="text-xs text-[#6B7280] max-w-sm">
              Connect, share, and engage with fellow members of Namdapha House.
            </p>
          </div>

          <div>
            <h3 className="text-xs font-semibold text-[#121317] mb-2">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link href="/" className="text-xs text-[#6B7280] hover:text-[#121317] transition-colors">Home</Link></li>
              <li><Link href="/about" className="text-xs text-[#6B7280] hover:text-[#121317] transition-colors">About</Link></li>
              <li><Link href="/events" className="text-xs text-[#6B7280] hover:text-[#121317] transition-colors">Events</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold text-[#121317] mb-2">Community</h3>
            <ul className="space-y-2">
              <li><Link href="/community" className="text-xs text-[#6B7280] hover:text-[#121317] transition-colors">Feed</Link></li>
              <li><Link href="#" className="text-xs text-[#6B7280] hover:text-[#121317] transition-colors">Guidelines</Link></li>
              <li><Link href="#" className="text-xs text-[#6B7280] hover:text-[#121317] transition-colors">Support</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-[#E5E7EB] flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-xs text-[#6B7280]">
            © {new Date().getFullYear()} Namdapha House. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link href="#" className="text-xs text-[#6B7280] hover:text-[#121317] transition-colors">Privacy</Link>
            <Link href="#" className="text-xs text-[#6B7280] hover:text-[#121317] transition-colors">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
