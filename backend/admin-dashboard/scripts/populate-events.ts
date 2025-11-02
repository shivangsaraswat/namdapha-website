import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBqGVLKZXxJxZxJxZxJxZxJxZxJxZxJxZx",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const upcomingEvents = [
  {
    title: "DevEx 101: Developer Experience Workshop",
    description: "Learn the fundamentals of developer experience and how to improve it in your organization.",
    imageUrl: "/devansh.jpeg",
    category: "Workshops",
    date: "2025-03-15",
    time: "14:00",
    venue: "Conference Hall A",
    meetLink: "meet.google.com/abc-defg-hij",
    type: "upcoming",
    status: "active",
    order: 0,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Flutter Testing Masterclass",
    description: "Master testing in Flutter applications with comprehensive examples and best practices.",
    imageUrl: "/devansh.jpeg",
    category: "Workshops",
    date: "2025-03-22",
    time: "15:00",
    venue: "Lab 201",
    meetLink: "meet.google.com/xyz-abcd-efg",
    type: "upcoming",
    status: "active",
    order: 1,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Firebase Extensions Workshop",
    description: "Build powerful backends with Firebase Extensions.",
    imageUrl: "/devansh.jpeg",
    category: "Workshops",
    date: "2025-04-01",
    time: "16:00",
    venue: "Innovation Hub",
    meetLink: "meet.google.com/firebase-workshop",
    type: "upcoming",
    status: "active",
    order: 2,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

const pastEvents = [
  {
    title: "DevEx 101: Developer Experience Explained",
    description: "Learn about the fundamentals of developer experience.",
    imageUrl: "/devansh.jpeg",
    category: "Paradox",
    date: "2025-02-05",
    type: "past",
    status: "active",
    order: 0,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Assertions in Dart and Flutter tests",
    description: "A comprehensive guide to testing in Flutter applications.",
    imageUrl: "/devansh.jpeg",
    category: "Workshops",
    date: "2023-02-02",
    type: "past",
    status: "active",
    order: 1,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Sending emails using Firestore",
    description: "How to implement email functionality using Firebase Extensions.",
    imageUrl: "/devansh.jpeg",
    category: "Meetups",
    date: "2022-10-06",
    type: "past",
    status: "active",
    order: 2,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "React Native Firebase Roadmap",
    description: "Discover the future of React Native Firebase.",
    imageUrl: "/devansh.jpeg",
    category: "Paradox",
    date: "2024-08-27",
    type: "past",
    status: "active",
    order: 3,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Enable Genkit Monitoring",
    description: "Learn how to implement monitoring for AI-powered applications.",
    imageUrl: "/devansh.jpeg",
    category: "Workshops",
    date: "2024-07-02",
    type: "past",
    status: "active",
    order: 4,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Cloud Functions Streaming in Flutter",
    description: "Implement real-time streaming with Cloud Functions.",
    imageUrl: "/devansh.jpeg",
    category: "Meetups",
    date: "2024-06-11",
    type: "past",
    status: "active",
    order: 5,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Advanced Flutter Animations",
    description: "Master complex animations in Flutter.",
    imageUrl: "/devansh.jpeg",
    category: "Paradox",
    date: "2024-05-15",
    type: "past",
    status: "active",
    order: 6,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Web Development Bootcamp",
    description: "Comprehensive bootcamp covering modern web technologies.",
    imageUrl: "/devansh.jpeg",
    category: "Workshops",
    date: "2024-04-10",
    type: "past",
    status: "active",
    order: 7,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Tech Networking Evening",
    description: "Connect with fellow tech enthusiasts.",
    imageUrl: "/devansh.jpeg",
    category: "Other Events",
    date: "2024-03-20",
    type: "past",
    status: "active",
    order: 8,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Hackathon 2024",
    description: "24-hour coding challenge with amazing prizes.",
    imageUrl: "/devansh.jpeg",
    category: "Paradox",
    date: "2024-02-28",
    type: "past",
    status: "active",
    order: 9,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

async function populateEvents() {
  console.log('Populating events...');
  
  try {
    for (const event of upcomingEvents) {
      await addDoc(collection(db, 'events'), event);
      console.log(`✓ ${event.title}`);
    }
    
    for (const event of pastEvents) {
      await addDoc(collection(db, 'events'), event);
      console.log(`✓ ${event.title}`);
    }
    
    console.log('\n✅ Done! All events added to Firebase.');
  } catch (error) {
    console.error('Error:', error);
  }
}

populateEvents();
