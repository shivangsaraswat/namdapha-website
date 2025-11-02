"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";

export default function TestContactsPage() {
  const [data, setData] = useState<Record<string, unknown>[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [firebaseConfig, setFirebaseConfig] = useState<Record<string, unknown> | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("Testing Firebase connection...");
        
        setFirebaseConfig({
          projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
          hasApiKey: !!process.env.NEXT_PUBLIC_FIREBASE_API_KEY
        });
        
        const snapshot = await getDocs(collection(db, "contacts"));
        console.log("Snapshot size:", snapshot.size);
        
        const contacts = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        console.log("All contacts:", contacts);
        setData(contacts);
      } catch (err: unknown) {
        console.error("Error:", err);
        setError(err instanceof Error ? err.message : String(err));
      }
    };

    fetchData();
  }, []);

  const clearCache = () => {
    if (typeof window !== 'undefined') {
      Object.keys(localStorage)
        .filter(k => k.startsWith('namdapha_cache_'))
        .forEach(k => localStorage.removeItem(k));
      alert('Cache cleared! Refresh the page.');
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-3xl font-bold mb-4">Firebase Contacts Test</h1>
      
      {firebaseConfig && (
        <div className="bg-blue-900 p-4 rounded mb-4">
          <p className="font-bold">Firebase Config:</p>
          <p>Project ID: {String(firebaseConfig.projectId)}</p>
          <p>Has API Key: {firebaseConfig.hasApiKey ? 'Yes' : 'No'}</p>
        </div>
      )}
      
      {error && (
        <div className="bg-red-900 p-4 rounded mb-4">
          <p className="font-bold">Error:</p>
          <p>{error}</p>
        </div>
      )}
      
      {data && (
        <div className="bg-gray-800 p-4 rounded">
          <p className="font-bold mb-2">Total Contacts: {data.length}</p>
          <pre className="text-xs overflow-auto max-h-96">
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
      )}
      
      {!data && !error && <p>Loading...</p>}
      
      <button
        onClick={clearCache}
        className="fixed bottom-4 right-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
      >
        Clear Cache
      </button>
    </div>
  );
}
