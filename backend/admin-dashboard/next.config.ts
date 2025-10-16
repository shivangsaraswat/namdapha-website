import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
    domains: [
      'lh3.googleusercontent.com',
      'avatars.githubusercontent.com',
      'googleusercontent.com',
      'res.cloudinary.com'
    ],
  },
};

export default nextConfig;
