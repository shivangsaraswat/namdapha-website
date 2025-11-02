'use client'
import { useState, useEffect } from 'react'
import Image from 'next/image'

const events = [
  {
    title: "React Native Firebase Roadmap",
    description: "Join us for an exciting workshop on Firebase integration and modern app development. Learn best practices and hands-on techniques.",
    image: "/bgmi.jpg",
    date: "Dec 15, 2024",
    time: "6:00 PM - 8:00 PM",
    venue: "Hall A, IIT Madras",
    meetLink: "meet.google.com/abc-defg-hij"
  },
  {
    title: "Tech Talk Series: AI & ML",
    description: "Explore the latest trends in Artificial Intelligence and Machine Learning with industry experts. Interactive Q&A session included.",
    image: "/bgmi.jpg",
    date: "Dec 20, 2024",
    time: "5:30 PM - 7:30 PM",
    venue: "Hall B, IIT Madras",
    meetLink: "meet.google.com/xyz-abcd-efg"
  },
  {
    title: "Web Development Bootcamp",
    description: "A comprehensive bootcamp covering modern web technologies including Next.js, React, and TypeScript. Perfect for beginners and intermediates.",
    image: "/bgmi.jpg",
    date: "Dec 25, 2024",
    time: "4:00 PM - 7:00 PM",
    venue: "Online Event",
    meetLink: "meet.google.com/web-boot-camp"
  }
]

export default function EventCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % events.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const currentEvent = events[currentIndex]

  return (
    <div className="w-full max-w-5xl mx-auto mb-10">
      <div className="relative bg-gray-900/50 border border-gray-700 rounded-3xl overflow-hidden flex flex-col md:flex-row transition-all duration-500">
        {/* Left side - Image */}
        <div className="md:w-2/5 h-64 md:h-80 relative">
          <Image 
            src={currentEvent.image} 
            alt={currentEvent.title} 
            fill 
            className="object-cover transition-opacity duration-500" 
          />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-gray-900/50 md:to-gray-900/80" />
        </div>

        {/* Right side - Information */}
        <div className="md:w-3/5 p-6 md:p-8 flex flex-col justify-between">
          <div>
            <h4 className="text-2xl md:text-3xl font-semibold text-white mb-3">{currentEvent.title}</h4>
            <p className="text-sm md:text-base text-gray-300 leading-relaxed mb-6">{currentEvent.description}</p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-3 text-sm text-gray-300">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>{currentEvent.date} • {currentEvent.time}</span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-sm text-gray-300">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>{currentEvent.venue}</span>
              </div>
              <a href={`https://${currentEvent.meetLink}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                Join Google Meet
              </a>
            </div>
          </div>
        </div>

        {/* Indicator dots */}
        <div className="absolute bottom-4 right-4 flex gap-2">
          {events.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentIndex ? 'bg-white w-6' : 'bg-gray-500'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
