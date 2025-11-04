import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs, Timestamp } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const activitiesData = [
  {
    name: "Valorant Vanguards",
    description: "Tactical minds meet here — participate in Valorant tournaments, discussions, and team-building for the win.",
    logo: "/5_20251023_223111_0004.svg",
    poster: "/valorant.jpg",
    category: "Gaming & Strategy",
    registrationLink: "",
    isVisible: true,
    order: 1
  },
  {
    name: "Clanforge",
    description: "Build, battle, and bond — unite with fellow strategists for casual and competitive Clash of Clans gaming.",
    logo: "/2_20251023_223111_0001.svg",
    poster: "/coc.jpg",
    category: "Gaming & Strategy",
    registrationLink: "",
    isVisible: true,
    order: 2
  },
  {
    name: "The Battleground",
    description: "Squad up for high-octane BGMI matches — from fun room games to intense competitions, we play it all.",
    logo: "/8_20251023_223111_0007.svg",
    poster: "/bgmi.jpg",
    category: "Gaming & Strategy",
    registrationLink: "",
    isVisible: true,
    order: 3
  },
  {
    name: "Knights64",
    description: "Check your mind and master your moves through tournaments, puzzles, and engaging chess discussions.",
    logo: "/7_20251023_223111_0006.svg",
    poster: "/chess.jpg",
    category: "Gaming & Strategy",
    registrationLink: "",
    isVisible: true,
    order: 4
  },
  {
    name: "FireStorm",
    description: "For those who live for the thrill of battle — join casual and competitive Free Fire matches with your housemates.",
    logo: "/FreeStorm.png",
    poster: "/freefire.jpg",
    category: "Gaming & Strategy",
    registrationLink: "",
    isVisible: true,
    order: 5
  },
  {
    name: "Geek Squad",
    description: "A reserved circle for true tech enthusiasts — coding, hackathons, robotics, and serious team collaborations await.",
    logo: "/4_20251023_223111_0003.svg",
    poster: "/freefire.jpg",
    category: "Tech & Innovation",
    registrationLink: "",
    isVisible: true,
    order: 6
  },
  {
    name: "ElectroSphere",
    description: "A dedicated space for ES students of our house — connect, collaborate, and share course updates and opportunities.",
    logo: "/11_20251023_223111_0010.svg",
    poster: "/freefire.jpg",
    category: "Tech & Innovation",
    registrationLink: "",
    isVisible: true,
    order: 7
  },
  {
    name: "Trivia Titans",
    description: "Fuel your curiosity with quizzes, trivia nights, and practice sessions designed to challenge and excite your mind.",
    logo: "/6_20251023_223111_0005.svg",
    poster: "/freefire.jpg",
    category: "Tech & Innovation",
    registrationLink: "",
    isVisible: true,
    order: 8
  },
  {
    name: "Kavya",
    description: "A haven for poets, storytellers, and writers - let your imagination flow through verses, tales, and creative expression.",
    logo: "/9_20251023_223111_0008.svg",
    poster: "/freefire.jpg",
    category: "Arts, Expression & Public Speaking",
    registrationLink: "",
    isVisible: true,
    order: 9
  },
  {
    name: "Pulse of Arts",
    description: "Where creativity comes alive — showcase your talent in photography, dance, music, sketching, and all things artistic.",
    logo: "/10_20251023_223111_0009.svg",
    poster: "/photography.jpg",
    category: "Arts, Expression & Public Speaking",
    registrationLink: "",
    isVisible: true,
    order: 10
  },
  {
    name: "The Podium",
    description: "Where words win wars — join for debates, JAMs, and public speaking sessions that sharpen your expression and confidence.",
    logo: "/3_20251023_223111_0002.svg",
    poster: "/freefire.jpg",
    category: "Arts, Expression & Public Speaking",
    registrationLink: "",
    isVisible: true,
    order: 11
  },
];

async function seedActivities() {
  try {
    // Check if activities already exist
    const activitiesRef = collection(db, 'activities');
    const snapshot = await getDocs(activitiesRef);
    
    if (snapshot.size > 0) {
      console.log('Activities already exist. Skipping seed.');
      return;
    }

    // Add all activities
    for (const activity of activitiesData) {
      await addDoc(activitiesRef, {
        ...activity,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });
      console.log(`Added: ${activity.name}`);
    }

    console.log('✅ Successfully seeded all activities!');
  } catch (error) {
    console.error('Error seeding activities:', error);
  }
}

seedActivities();
