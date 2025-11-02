"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import LoadingSpinner from "@/components/LoadingSpinner";
import { contactService, Contact } from "@/lib/contactService";

export default function ImportantContactsPage() {
  const [leadershipContacts, setLeadershipContacts] = useState<Contact[]>([]);
  const [otherContacts, setOtherContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const data = await contactService.getActiveContacts();
        setLeadershipContacts(data.filter(c => c.type === 'leadership'));
        setOtherContacts(data.filter(c => c.type === 'other'));
      } catch (error) {
        console.error('Error fetching contacts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchContacts();
  }, []);

  return (
    <div className="min-h-screen bg-[rgb(228,229,231)] text-black relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="container relative mx-auto h-full max-w-[1200px]">
          <Image
            src="/bg.svg"
            alt="Background pattern left"
            width={358}
            height={1702}
            className="absolute -top-7 left-[-304px] opacity-10 lg:hidden"
            priority
          />
          <Image
            src="/bg.svg"
            alt="Background pattern right"
            width={358}
            height={1702}
            className="absolute bottom-0 right-[-320px] opacity-10 lg:hidden"
            priority
          />
          <Image
            src="/bg.svg"
            alt="Background pattern desktop"
            width={672}
            height={326}
            className="absolute right-0 top-0 opacity-10 hidden lg:block md:-right-8 md:-top-1.5 sm:top-2"
            priority
          />
        </div>
      </div>

      {/* Hero Section with Navbar */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/bg.svg"
            alt="Hero background"
            fill
            className="object-cover"
            priority
          />
        </div>
        
        <div className="relative z-[60]">
          <Navbar />
        </div>

        <div className="relative z-10 py-20 px-6 md:px-8 lg:px-12">
          <div className="max-w-[1400px] mx-auto text-center">
            <h1 className="text-[3rem] sm:text-[3.5rem] md:text-[4rem] lg:text-[4.5rem] xl:text-[5rem] bg-[radial-gradient(89.47%_51.04%_at_44.27%_50%,_#E2E3E9_0%,_#D4D6DE_52.73%,_#3D3F4C_100%)] bg-clip-text font-medium text-transparent leading-[1.05] tracking-tight">
              Important Contacts
            </h1>
            <p className="mt-6 text-[13px] md:text-[15px] lg:text-[18px] text-gray-300 max-w-3xl mx-auto">
              Get in touch with key personnel and departments
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="relative pt-16 pb-16 px-6 md:px-8 lg:px-12">
        <div className="max-w-[1200px] mx-auto relative z-10 space-y-16">
          {loading && <LoadingSpinner />}
          {!loading && (
            <>
              {/* House Leadership Section */}
              <div>
                
                {leadershipContacts.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-gray-600">No leadership contacts available yet</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {leadershipContacts.map((contact) => (
                      <div
                        key={contact.id}
                        className="relative rounded-xl p-6 shadow-lg hover:shadow-xl transition-all cursor-pointer group overflow-hidden border-2 border-black"
                      >
                        <div className="absolute inset-0 z-0">
                          <Image
                            src="/teamsbg.svg"
                            alt="Card background"
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="relative z-10 flex flex-col items-center text-center">
                          <div className="w-24 h-24 rounded-full bg-white/90 border-2 border-black overflow-hidden mb-4">
                            {contact.photoUrl ? (
                              <Image
                                src={contact.photoUrl}
                                alt={contact.name}
                                width={96}
                                height={96}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-gray-300">
                                <svg className="w-12 h-12 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                                </svg>
                              </div>
                            )}
                          </div>
                          <div className="flex items-center justify-center gap-3 mb-1">
                            <h3 className="text-[20px] font-medium text-white">
                              {contact.name}
                            </h3>
                            <div className="h-4 w-px bg-white/40"></div>
                            <p className="text-[14px] font-medium text-yellow-300">
                              {contact.role}
                            </p>
                          </div>
                          {contact.description && (
                            <p className="text-[13px] text-white/80 mb-3">
                              {contact.description}
                            </p>
                          )}
                          <div className="w-full space-y-2">
                            <a
                              href={`mailto:${contact.email}`}
                              className="flex items-center justify-center gap-2 text-[14px] text-white/90 hover:text-white transition-colors"
                            >
                              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                              </svg>
                              {contact.email}
                            </a>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Other Contacts Section */}
              <div>
                
                {otherContacts.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-gray-600">No other contacts available yet</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {otherContacts.map((contact) => (
                      <div
                        key={contact.id}
                        className="relative rounded-xl p-6 shadow-lg hover:shadow-xl transition-all cursor-pointer group overflow-hidden border-2 border-black"
                      >
                        <div className="absolute inset-0 z-0">
                          <Image
                            src="/teamsbg.svg"
                            alt="Card background"
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="relative z-10 flex items-center gap-4">
                          <div className="w-16 h-16 rounded-full bg-white/90 border-2 border-black overflow-hidden flex-shrink-0">
                            <div className="w-full h-full flex items-center justify-center bg-gray-300">
                              <svg className="w-8 h-8 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                              </svg>
                            </div>
                          </div>
                          <div className="flex-1">
                            <h3 className="text-[18px] font-medium text-white mb-1">
                            {contact.name}
                          </h3>
                            <p className="text-[14px] font-semibold text-white/90 mb-2">
                              {contact.role}
                            </p>
                            <div className="space-y-1">
                            <a
                              href={`mailto:${contact.email}`}
                              className="flex items-center gap-2 text-[14px] text-white/90 hover:text-white transition-colors"
                            >
                              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                              </svg>
                              {contact.email}
                            </a>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
