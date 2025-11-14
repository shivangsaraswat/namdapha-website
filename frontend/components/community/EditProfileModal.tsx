"use client";

import { useState, useRef } from 'react';
import Image from 'next/image';
import { X, Upload, Camera, Briefcase, MapPin, Link as LinkIcon, FileText, Heart } from 'lucide-react';
import { CommunityUser, communityService } from '@/lib/communityService';
import { uploadImage } from '@/lib/cloudinary';
import { toast } from 'sonner';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: CommunityUser;
  onUpdate: () => void;
}

export default function EditProfileModal({ isOpen, onClose, user, onUpdate }: EditProfileModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: user.name || '',
    username: user.username || '',
    headline: user.headline || '',
    bio: user.bio || '',
    location: user.location || '',
    website: user.website || '',
    hobbies: user.hobbies?.join(', ') || '',
  });
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [profilePreview, setProfilePreview] = useState(user.profileImage || '');
  const [coverPreview, setCoverPreview] = useState(user.coverImage || '');
  const [resumeFile, setResumeFile] = useState<File | null>(null);

  const profileInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);
  const resumeInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileImage(file);
      setProfilePreview(URL.createObjectURL(file));
    }
  };

  const handleCoverImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCoverImage(file);
      setCoverPreview(URL.createObjectURL(file));
    }
  };

  const handleResumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      setResumeFile(file);
      toast.success('Resume selected');
    } else {
      toast.error('Please select a PDF file');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const updates: Partial<CommunityUser> = {
        name: formData.name,
        username: formData.username,
        headline: formData.headline,
        bio: formData.bio,
        location: formData.location,
        website: formData.website,
        hobbies: formData.hobbies.split(',').map(h => h.trim()).filter(Boolean),
      };

      // Upload profile image if changed
      if (profileImage) {
        const result = await uploadImage(profileImage, 'profiles');
        updates.profileImage = result.url;
      }

      // Upload cover image if changed
      if (coverImage) {
        const result = await uploadImage(coverImage, 'covers');
        updates.coverImage = result.url;
      }

      // Upload resume if provided
      if (resumeFile) {
        const result = await uploadImage(resumeFile, 'resumes');
        updates.resume = result.url;
      }

      await communityService.updateUser(user.id!, updates);
      toast.success('Profile updated successfully!');
      onUpdate();
      onClose();
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Edit Profile</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="overflow-y-auto max-h-[calc(90vh-8rem)]">
          <div className="p-6 space-y-6">
            {/* Cover and Profile Images */}
            <div className="relative">
              {/* Cover Image */}
              <div className="h-32 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg overflow-hidden relative group">
                {coverPreview && (
                  <Image src={coverPreview} alt="Cover" fill className="object-cover" />
                )}
                <button
                  type="button"
                  onClick={() => coverInputRef.current?.click()}
                  className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                >
                  <div className="bg-white rounded-full p-3">
                    <Camera className="w-5 h-5 text-gray-700" />
                  </div>
                </button>
                <input
                  ref={coverInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleCoverImageChange}
                  className="hidden"
                />
              </div>

              {/* Profile Image */}
              <div className="absolute -bottom-12 left-6">
                <div className="relative group">
                  {profilePreview ? (
                    <Image
                      src={profilePreview}
                      alt={user.name}
                      width={96}
                      height={96}
                      className="rounded-full border-4 border-white object-cover"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center border-4 border-white">
                      <span className="text-white font-bold text-3xl">
                        {user.name?.[0]?.toUpperCase() || user.username?.[0]?.toUpperCase()}
                      </span>
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => profileInputRef.current?.click()}
                    className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-full flex items-center justify-center"
                  >
                    <Camera className="w-5 h-5 text-white" />
                  </button>
                  <input
                    ref={profileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleProfileImageChange}
                    className="hidden"
                  />
                </div>
              </div>
            </div>

            <div className="pt-14 space-y-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="John Doe"
                />
              </div>

              {/* Username */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Username *
                </label>
                <input
                  type="text"
                  required
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="johndoe"
                />
              </div>

              {/* Headline */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                  <Briefcase className="w-4 h-4" />
                  Headline
                </label>
                <input
                  type="text"
                  value={formData.headline}
                  onChange={(e) => setFormData({ ...formData, headline: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="UI/UX Designer at Company"
                />
              </div>

              {/* Bio */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  About / Bio
                </label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  placeholder="Tell us about yourself..."
                />
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Location
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Chennai, India"
                />
              </div>

              {/* Website */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                  <LinkIcon className="w-4 h-4" />
                  Portfolio Website
                </label>
                <input
                  type="url"
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://yourwebsite.com"
                />
              </div>

              {/* Hobbies */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                  <Heart className="w-4 h-4" />
                  Hobbies (comma-separated)
                </label>
                <input
                  type="text"
                  value={formData.hobbies}
                  onChange={(e) => setFormData({ ...formData, hobbies: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Reading, Coding, Photography"
                />
              </div>

              {/* Resume Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Resume (PDF)
                </label>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => resumeInputRef.current?.click()}
                    className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <Upload className="w-4 h-4" />
                    <span className="text-sm">{resumeFile ? resumeFile.name : 'Choose File'}</span>
                  </button>
                  {user.resume && !resumeFile && (
                    <a
                      href={user.resume}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:underline"
                    >
                      View current resume
                    </a>
                  )}
                </div>
                <input
                  ref={resumeInputRef}
                  type="file"
                  accept=".pdf"
                  onChange={handleResumeChange}
                  className="hidden"
                />
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
