"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import LoadingSpinner from "@/components/LoadingSpinner";
import { contactService, Contact } from "@/lib/contactService";
import { Crown, Target, ClipboardList, Drama, Briefcase, Phone, User, Inbox } from "lucide-react";
import { FaCopy } from "react-icons/fa";

const categories = [
  { id: 'leadership', label: 'House Leadership', Icon: Crown },
  { id: 'pods', label: 'PODs', Icon: Target },
  { id: 'sec', label: 'Student Executive Committee', Icon: ClipboardList },
  { id: 'paradox', label: 'Paradox', Icon: Drama },
  { id: 'placement', label: 'Placement', Icon: Briefcase },
  { id: 'others', label: 'Others', Icon: Phone }
];

export default function ImportantContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('leadership');
  const [, setCopiedId] = useState<string | null>(null);

  const copyToClipboard = (email: string, id: string) => {
    navigator.clipboard.writeText(email);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const data = await contactService.getActiveContacts();
        setContacts(data);
      } catch (error) {
        console.error('Error fetching contacts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchContacts();
  }, []);

  const filteredContacts = contacts.filter(c => c.category === activeCategory);

  const getCardHeight = () => {
    if (activeCategory === 'sec' || activeCategory === 'paradox') return 'h-48';
    return 'h-40';
  };

  const getImageWidth = () => {
    if (activeCategory === 'sec' || activeCategory === 'paradox') return 'w-1/3';
    return 'w-2/5';
  };

  const getInfoWidth = () => {
    if (activeCategory === 'sec' || activeCategory === 'paradox') return 'w-2/3';
    return 'w-3/5';
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 overflow-hidden opacity-20">
        <Image
          src="/bg.svg"
          alt="Background pattern"
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Hero Section with Navbar */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 to-transparent" />
        
        <div className="relative z-10 py-16 md:py-20 px-6 md:px-8 lg:px-12 pt-28">
          <div className="max-w-[1400px] mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl bg-[radial-gradient(89.47%_51.04%_at_44.27%_50%,_#E2E3E9_0%,_#D4D6DE_52.73%,_#3D3F4C_100%)] bg-clip-text font-bold text-transparent leading-tight tracking-tight">
              Important Contacts
            </h1>
            <p className="mt-4 text-sm md:text-base lg:text-lg text-gray-400 max-w-2xl mx-auto">
              Connect with key personnel across different departments and committees
            </p>
          </div>
        </div>
      </section>

      {/* Category Tabs */}
      <div className="relative z-10 px-6 md:px-8 lg:px-12 mb-16">
        <div className="max-w-[1200px] mx-auto">
          <div className="flex justify-center flex-wrap gap-3 md:gap-4">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center gap-2 px-5 py-3 font-medium text-sm rounded-md whitespace-nowrap transition-all border ${
                  activeCategory === cat.id
                    ? 'bg-gradient-to-b from-purple-900/30 to-purple-900/10 text-white border-purple-800/50'
                    : 'bg-transparent text-gray-400 border-gray-700 hover:border-gray-600 hover:text-gray-300'
                }`}
              >
                <cat.Icon className="w-4 h-4" />
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="relative pb-24 px-6 md:px-8 lg:px-12">
        <div className="max-w-[1200px] mx-auto relative z-10">
          {filteredContacts.length === 0 ? (
            <div className="text-center py-20">
              <Inbox className="w-16 h-16 mx-auto mb-4 text-gray-600" />
              <p className="text-gray-400 text-lg">No contacts available in this category yet</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredContacts.map((contact) => (
                <div
                  key={contact.id}
                  className={`relative rounded-xl shadow-lg hover:shadow-xl transition-all border-2 border-black overflow-hidden ${getCardHeight()}`}
                >
                  <div className="absolute inset-0 flex">
                    <div className={`${getImageWidth()} relative`}>
                      {contact.photoUrl ? (
                        <Image
                          src={contact.photoUrl}
                          alt={contact.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-200">
                          <User className="w-16 h-16 text-gray-500" />
                        </div>
                      )}
                    </div>
                    <div className={`${getInfoWidth()} relative`}>
                      <Image
                        src="/councilbg.svg"
                        alt="Card background"
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>
                  
                  <div className="relative z-10 h-full flex">
                    <div className={getImageWidth()}></div>
                    <div className={`${getInfoWidth()} p-4 flex flex-col justify-center gap-3`}>
                      <h3 className="text-lg font-bold bg-[radial-gradient(89.47%_51.04%_at_44.27%_50%,_#E2E3E9_0%,_#D4D6DE_52.73%,_#3D3F4C_100%)] bg-clip-text text-transparent leading-tight">
                        {contact.name}
                      </h3>

                      <p className="text-sm font-medium text-white/90">
                        {contact.role || contact.description}
                      </p>

                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2 border border-white/20 min-w-0">
                          <p className="text-xs text-white font-medium break-all">{contact.email}</p>
                        </div>
                        <button
                          onClick={() => copyToClipboard(contact.email, contact.id!)}
                          className="flex-shrink-0 flex items-center justify-center p-2 bg-white hover:bg-gray-100 rounded-lg text-black transition-all border border-black"
                          title="Copy email"
                        >
                          <FaCopy className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
