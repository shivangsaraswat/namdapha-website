import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Community | Namdapha House',
  description: 'Connect with Namdapha House members. Share thoughts, announcements, and engage with the community.',
  openGraph: {
    title: 'Community | Namdapha House',
    description: 'Connect with Namdapha House members. Share thoughts, announcements, and engage with the community.',
  }
};

export default function CommunityPage() {
  return (
    <div className="min-h-screen bg-black text-white pt-32 pb-20 px-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">Community</h1>
        <p className="text-white/70 mb-8">
          Connect, share, and engage with the Namdapha House community
        </p>
        
        <div className="text-center py-20">
          <p className="text-white/50">Community feed coming soon...</p>
        </div>
      </div>
    </div>
  );
}
