"use client";

import { useState, useEffect, useRef } from 'react';
import { X, Send } from 'lucide-react';
import { messagingService, Message, Conversation } from '@/lib/messagingService';
import { communityService, CommunityUser } from '@/lib/communityService';
import Image from 'next/image';

interface MessagingModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUserId: string;
  recipientId?: string;
}

export default function MessagingModal({ isOpen, onClose, currentUserId, recipientId }: MessagingModalProps) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [users, setUsers] = useState<{ [key: string]: CommunityUser }>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      loadConversations();
    }
  }, [isOpen, currentUserId]);

  useEffect(() => {
    if (recipientId && isOpen) {
      startConversation(recipientId);
    }
  }, [recipientId, isOpen]);

  useEffect(() => {
    if (selectedConversation) {
      const unsubscribe = messagingService.subscribeToMessages(selectedConversation, (msgs) => {
        setMessages(msgs);
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      });
      return () => unsubscribe();
    }
  }, [selectedConversation]);

  const loadConversations = async () => {
    const convs = await messagingService.getConversations(currentUserId);
    setConversations(convs);
    
    const userIds = new Set<string>();
    convs.forEach(conv => conv.participants.forEach(p => userIds.add(p)));
    
    const usersData: { [key: string]: CommunityUser } = {};
    for (const userId of userIds) {
      const user = await communityService.getUserByEmail(userId);
      if (user) usersData[userId] = user;
    }
    setUsers(usersData);
  };

  const startConversation = async (recipientId: string) => {
    const convId = await messagingService.getOrCreateConversation(currentUserId, recipientId);
    setSelectedConversation(convId);
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation) return;
    
    const conv = conversations.find(c => c.id === selectedConversation);
    if (!conv) return;
    
    const recipientId = conv.participants.find(p => p !== currentUserId)!;
    await messagingService.sendMessage(selectedConversation, currentUserId, recipientId, newMessage);
    setNewMessage('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl w-full max-w-4xl h-[600px] flex flex-col shadow-2xl">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">Messages</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="flex flex-1 overflow-hidden">
          <div className="w-1/3 border-r overflow-y-auto">
            {conversations.map(conv => {
              const otherUserId = conv.participants.find(p => p !== currentUserId)!;
              const otherUser = users[otherUserId];
              return (
                <button
                  key={conv.id}
                  onClick={() => setSelectedConversation(conv.id!)}
                  className={`w-full p-4 flex items-center gap-3 hover:bg-gray-50 transition-colors ${selectedConversation === conv.id ? 'bg-blue-50' : ''}`}
                >
                  {otherUser?.profileImage ? (
                    <Image src={otherUser.profileImage} alt={otherUser.name} width={48} height={48} className="rounded-full" />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold">
                      {otherUser?.name?.[0] || '?'}
                    </div>
                  )}
                  <div className="flex-1 text-left">
                    <p className="font-semibold text-sm">{otherUser?.name || 'Unknown'}</p>
                    <p className="text-xs text-gray-500 truncate">{conv.lastMessage}</p>
                  </div>
                </button>
              );
            })}
          </div>
          
          <div className="flex-1 flex flex-col">
            {selectedConversation ? (
              <>
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {messages.map(msg => {
                    const isOwn = msg.senderId === currentUserId;
                    return (
                      <div key={msg.id} className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[70%] rounded-2xl px-4 py-2 ${isOwn ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}>
                          <p className="text-sm">{msg.content}</p>
                          <p className={`text-xs mt-1 ${isOwn ? 'text-blue-100' : 'text-gray-500'}`}>
                            {msg.createdAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>
                
                <div className="p-4 border-t">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                      placeholder="Type a message..."
                      className="flex-1 px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button onClick={sendMessage} className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600">
                      <Send className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-gray-400">
                Select a conversation to start messaging
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
