'use client'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import { collection, getDocs, query, where } from 'firebase/firestore'
import { db } from '@/lib/firebase'

interface Event {
  id: string
  title: string
  description: string
  image: string
  date: string
  time?: string
  venue?: string
  meetLink?: string
  category: string
}

export default function EventCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [events, setEvents] = useState<Event[]>([])
  const [isUpcoming, setIsUpcoming] = useState(true)

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const upcomingQuery = query(collection(db, 'events'), where('type', '==', 'upcoming'), where('status', '==', 'active'))
        const upcomingSnap = await getDocs(upcomingQuery)
        const upcoming = upcomingSnap.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          image: doc.data().imageUrl
        })) as Event[]

        if (upcoming.length > 0) {
          setEvents(upcoming.sort((a, b) => ((a as Event & {order: number}).order || 0) - ((b as Event & {order: number}).order || 0)))
          setIsUpcoming(true)
        } else {
          const pastQuery = query(collection(db, 'events'), where('type', '==', 'past'), where('status', '==', 'active'))
          const pastSnap = await getDocs(pastQuery)
          const past = pastSnap.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            image: doc.data().imageUrl
          })) as Event[]
          
          const shuffled = past.sort(() => Math.random() - 0.5).slice(0, 15)
          setEvents(shuffled)
          setIsUpcoming(false)
        }
      } catch (error) {
        console.error('Error fetching events:', error)
      }
    }
    fetchEvents()
  }, [])

  useEffect(() => {
    if (events.length === 0) return
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % events.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [events.length])

  if (events.length === 0) return null

  const currentEvent = events[currentIndex]

  return (
    <div className="w-full max-w-5xl mx-auto mb-10">
      <h3 className="text-3xl font-title font-medium mb-8 bg-[radial-gradient(89.47%_51.04%_at_44.27%_50%,_#E2E3E9_0%,_#D4D6DE_52.73%,_#3D3F4C_100%)] bg-clip-text text-transparent text-center">
        {isUpcoming ? 'Upcoming Events' : 'Past Events'}
      </h3>
      <div className="relative bg-gray-900/50 border border-gray-700 rounded-3xl overflow-hidden flex flex-col md:flex-row transition-all duration-500">
        {/* Image side */}
        <div className={`h-64 md:h-80 relative overflow-hidden ${isUpcoming ? 'md:w-2/5' : 'md:w-2/5'}`}>
          <Image 
            src={currentEvent.image} 
            alt={currentEvent.title} 
            fill 
            className="object-cover" 
            priority
            sizes="(max-width: 768px) 100vw, 40vw"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-gray-900/50 md:to-gray-900/80" />
        </div>

        {/* Information side */}
        <div className="md:w-3/5 p-6 md:p-8 flex flex-col justify-between">
          <div>
            <h4 className="text-2xl md:text-3xl font-semibold text-white mb-3">{currentEvent.title}</h4>
            <p className="text-sm md:text-base text-gray-300 leading-relaxed mb-6 line-clamp-4">{currentEvent.description}</p>
          </div>
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-sm text-gray-300">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>{isUpcoming && currentEvent.time ? `${currentEvent.date} • ${currentEvent.time}` : currentEvent.date}</span>
            </div>
            {isUpcoming && (
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-sm text-gray-300">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>{currentEvent.venue}</span>
                </div>
                {currentEvent.meetLink && (
                  <a href={`https://${currentEvent.meetLink}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    Join Google Meet
                  </a>
                )}
              </div>
            )}
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
