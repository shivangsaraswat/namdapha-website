"use client";

import { useState, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Camera, ArrowRight, Check } from 'lucide-react';
import { uploadImage } from '@/lib/cloudinary';

export default function OnboardingPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: session?.user?.name || '',
    headline: '',
    location: '',
    bio: '',
    website: '',
    profileImage: session?.user?.image || '',
    coverImage: ''
  });

  const profileInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = async (file: File, type: 'profile' | 'cover') => {
    setLoading(true);
    try {
      const result = await uploadImage(file, 'community');
      const url = typeof result === 'string' ? result : result.url;
      setFormData(prev => ({ ...prev, [type === 'profile' ? 'profileImage' : 'coverImage']: url }));
    } catch (error) {
      alert('Failed to upload image');
    } finally {
      setLoading(false);
    }
  };

  const handleComplete = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/community/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!response.ok) throw new Error('Failed to complete onboarding');
      router.push('/community');
    } catch (error) {
      alert('Failed to complete onboarding');
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { number: 1, title: 'Profile Photo', desc: 'Add a photo to help others recognize you' },
    { number: 2, title: 'Basic Info', desc: 'Tell us about yourself' },
    { number: 3, title: 'About You', desc: 'Share your story' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8f9fa] to-[#e9ecef] flex items-center justify-center p-6">
      <div className="w-full max-w-2xl">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-center mb-4">
            {steps.map((s, idx) => (
              <div key={s.number} className="flex items-center">
                <div className={`flex items-center justify-center w-12 h-12 rounded-full border-2 font-semibold transition-all ${
                  step > s.number ? 'bg-[#0a66c2] border-[#0a66c2] text-white' : 
                  step === s.number ? 'border-[#0a66c2] text-[#0a66c2] bg-white' : 
                  'border-[#d0d0d0] text-[#666] bg-white'
                }`}>
                  {step > s.number ? <Check className="w-6 h-6" /> : s.number}
                </div>
                {idx < steps.length - 1 && (
                  <div className={`w-32 h-0.5 mx-4 ${step > s.number ? 'bg-[#0a66c2]' : 'bg-[#d0d0d0]'}`} />
                )}
              </div>
            ))}
          </div>
          <div className="text-center">
            <h2 className="text-2xl font-bold text-[#191919] mb-1">{steps[step - 1].title}</h2>
            <p className="text-sm text-[#666]">{steps[step - 1].desc}</p>
          </div>
        </div>

        {/* Content Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {step === 1 && (
            <div className="space-y-6">
              <div className="flex flex-col items-center">
                <div className="relative mb-6">
                  <div className="w-32 h-32 rounded-full overflow-hidden bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] flex items-center justify-center">
                    {formData.profileImage ? (
                      <Image src={formData.profileImage} alt="Profile" width={128} height={128} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-white text-4xl font-bold">{formData.name[0]?.toUpperCase()}</span>
                    )}
                  </div>
                  <button
                    onClick={() => profileInputRef.current?.click()}
                    disabled={loading}
                    className="absolute bottom-0 right-0 p-3 bg-[#0a66c2] rounded-full text-white hover:bg-[#004182] transition-colors disabled:opacity-50"
                  >
                    <Camera className="w-5 h-5" />
                  </button>
                  <input ref={profileInputRef} type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0], 'profile')} className="hidden" />
                </div>
                <p className="text-sm text-[#666] text-center max-w-md">Upload a professional photo that clearly shows your face</p>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-[#191919] mb-2">Full Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-4 py-3 border border-[#d0d0d0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0a66c2] focus:border-transparent"
                  placeholder="Enter your full name"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#191919] mb-2">Headline *</label>
                <input
                  type="text"
                  value={formData.headline}
                  onChange={(e) => setFormData(prev => ({ ...prev, headline: e.target.value }))}
                  className="w-full px-4 py-3 border border-[#d0d0d0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0a66c2] focus:border-transparent"
                  placeholder="e.g., Software Engineer at Tech Company"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#191919] mb-2">Location</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                  className="w-full px-4 py-3 border border-[#d0d0d0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0a66c2] focus:border-transparent"
                  placeholder="City, Country"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#191919] mb-2">Website</label>
                <input
                  type="url"
                  value={formData.website}
                  onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
                  className="w-full px-4 py-3 border border-[#d0d0d0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0a66c2] focus:border-transparent"
                  placeholder="https://yourwebsite.com"
                />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-[#191919] mb-2">Cover Photo</label>
                <div className="relative h-40 bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460] rounded-lg overflow-hidden">
                  {formData.coverImage && <Image src={formData.coverImage} alt="Cover" fill className="object-cover" />}
                  <button
                    onClick={() => coverInputRef.current?.click()}
                    disabled={loading}
                    className="absolute bottom-4 right-4 px-4 py-2 bg-white rounded-lg text-sm font-semibold hover:bg-[#f3f6f8] transition-colors disabled:opacity-50 flex items-center gap-2"
                  >
                    <Camera className="w-4 h-4" />
                    {formData.coverImage ? 'Change' : 'Add'} Cover
                  </button>
                  <input ref={coverInputRef} type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0], 'cover')} className="hidden" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#191919] mb-2">About *</label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                  rows={6}
                  className="w-full px-4 py-3 border border-[#d0d0d0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0a66c2] focus:border-transparent resize-none"
                  placeholder="Write a brief description about yourself, your experience, and what you're passionate about..."
                />
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-[#e5e7eb]">
            {step > 1 && (
              <button
                onClick={() => setStep(step - 1)}
                className="px-6 py-2.5 text-sm font-semibold text-[#666] hover:text-[#191919] transition-colors"
              >
                Back
              </button>
            )}
            <div className="flex-1" />
            {step < 3 ? (
              <button
                onClick={() => setStep(step + 1)}
                disabled={step === 2 && (!formData.name || !formData.headline)}
                className="px-6 py-2.5 bg-[#0a66c2] text-white rounded-full text-sm font-semibold hover:bg-[#004182] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                Continue
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleComplete}
                disabled={loading || !formData.bio}
                className="px-8 py-2.5 bg-[#0a66c2] text-white rounded-full text-sm font-semibold hover:bg-[#004182] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Completing...' : 'Complete Setup'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
