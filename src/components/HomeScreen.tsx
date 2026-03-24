'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

export default function HomeScreen() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [roomInput, setRoomInput] = useState('');

  const createMeeting = () => {
    // Generate a unique room ID with timestamp to ensure uniqueness
    const timestamp = Date.now();
    const randomPart = Math.random().toString(36).substring(2, 7);
    const roomID = `${randomPart}${timestamp}`;
    router.push(`/meeting/${roomID}`);
  };

  const joinMeeting = () => {
    setShowJoinModal(true);
  };

  const handleJoinMeeting = () => {
    if (!roomInput.trim()) return;
    
    let roomID = roomInput.trim();
    
    // Extract room ID from full URL if provided
    if (roomID.includes('/meeting/')) {
      const urlParts = roomID.split('/meeting/');
      if (urlParts.length > 1) {
        roomID = urlParts[1].split('?')[0]; // Remove query parameters if any
      }
    }
    
    // Clean up the room ID (remove any extra characters)
    roomID = roomID.replace(/[^a-zA-Z0-9]/g, '');
    
    if (roomID) {
      router.push(`/meeting/${roomID}`);
      setShowJoinModal(false);
      setRoomInput('');
    }
  };

  const closeJoinModal = () => {
    setShowJoinModal(false);
    setRoomInput('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 flex flex-col font-sans">
      {/* Navbar */}
      <nav className="bg-white/10 backdrop-blur-xl border-b border-white/10 px-4 sm:px-6 py-3 sm:py-4 sticky top-0 z-50">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
              <svg width="20" height="20" className="sm:w-6 sm:h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M17 10.5V7C17 6.45 16.55 6 16 6H4C3.45 6 3 6.45 3 7V17C3 17.55 3.45 18 4 18H16C16.55 18 17 17.55 17 17V13.5L21 17.5V6.5L17 10.5Z" fill="white"/>
              </svg>
            </div>
            <h1 className="text-lg sm:text-2xl font-bold text-white">Meetly</h1>
          </div>

          <div className="flex items-center gap-2 sm:gap-5">
            {user ? (
              <>
                <div className="hidden sm:flex items-center gap-3">
                  <div className="w-9 h-9 bg-indigo-500/20 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                    {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                  </div>
                  <span className="text-white font-medium">
                    {user.firstName} {user.lastName}
                  </span>
                </div>
                {/* Mobile: Show only initials */}
                <div className="sm:hidden w-8 h-8 bg-indigo-500/20 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                  {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                </div>
                <button
                  onClick={logout}
                  className="px-3 py-1.5 sm:px-5 sm:py-2 text-xs sm:text-sm font-semibold bg-red-500/40 text-white border border-white/50 rounded-lg hover:bg-red-500/60 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  Logout
                </button>
              </>
            ) : (
              <div className="flex items-center gap-2 sm:gap-3">
                <Link 
                  href="/login" 
                  className="px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-semibold text-white border border-white/40 rounded-lg hover:bg-white/10 hover:border-white/60 transition-all duration-200"
                >
                  Sign In
                </Link>
                <Link 
                  href="/register" 
                  className="px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-semibold text-slate-900 bg-white rounded-lg hover:bg-gray-50 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-5 min-h-[calc(100vh-200px)]">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 via-purple-500/20 to-pink-500/20 opacity-30" />
        
        <div className="flex flex-col lg:flex-row w-full max-w-6xl min-h-[60vh] bg-white/98 backdrop-blur-xl rounded-3xl shadow-2xl border-2 border-white/30 relative z-10 overflow-hidden">
          {/* Mobile: SVG Image First, Desktop: Left Column - Content */}
          <div className="flex-1 p-8 flex flex-col justify-center items-center text-center order-2 lg:order-1">
            {/* Logo/Icon */}
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center mb-4 shadow-lg">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M17 10.5V7C17 6.45 16.55 6 16 6H4C3.45 6 3 6.45 3 7V17C3 17.55 3.45 18 4 18H16C16.55 18 17 17.55 17 17V13.5L21 17.5V6.5L17 10.5Z" fill="white"/>
              </svg>
            </div>
            
            {/* Main Content */}
            <div className="mb-5">
              <h1 className="text-3xl font-bold text-slate-900 mb-3 leading-tight">
                Video Conferencing
              </h1>
              
              <p className="text-sm text-slate-600 leading-relaxed max-w-md">
                Connect with crystal-clear video quality and seamless collaboration tools.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-3 w-full max-w-80">
              <button 
                onClick={() => {
                  if (!user) { router.push('/login'); return; }
                  createMeeting();
                }}
                className="py-4 px-6 text-base font-semibold bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl hover:from-indigo-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
              >
                Start New Meeting
              </button>

              <button 
                onClick={() => {
                  if (!user) { router.push('/login'); return; }
                  joinMeeting();
                }}
                className="py-4 px-6 text-base font-semibold bg-transparent text-indigo-600 border-2 border-gray-200 rounded-xl hover:bg-indigo-600 hover:text-white hover:border-indigo-600 transition-all duration-200 hover:-translate-y-0.5"
              >
                Join Meeting
              </button>
            </div>
          </div>

          {/* Mobile: SVG Image First, Desktop: Right Column - Image */}
          <div className="flex-1 flex items-center justify-center p-4 lg:p-8 order-1 lg:order-2">
            <img 
              src="/videocall.svg" 
              alt="Video calling illustration" 
              className="w-full h-full object-contain max-w-sm max-h-sm lg:max-w-lg lg:max-h-lg"
            />
          </div>
        </div>
      </div>

      {/* Join Meeting Modal */}
      {showJoinModal && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center z-50 p-5">
          <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-8 max-w-md w-full shadow-2xl border border-white/30 relative">
            {/* Close Button */}
            <button
              onClick={closeJoinModal}
              className="absolute top-4 right-4 w-8 h-8 bg-slate-100 hover:bg-slate-200 rounded-lg flex items-center justify-center text-slate-600 hover:text-slate-800 transition-all duration-200"
            >
              ×
            </button>

            {/* Modal Content */}
            <div className="text-center">
              <h2 className="text-2xl font-bold text-slate-900 mb-2">
                Join Meeting
              </h2>

              <p className="text-sm text-slate-600 mb-6 leading-relaxed">
                Enter room ID or paste meeting link
              </p>

              <div className="mb-5">
                <input
                  type="text"
                  value={roomInput}
                  onChange={(e) => setRoomInput(e.target.value)}
                  placeholder="Room ID or meeting link..."
                  className="w-full px-4 py-3 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-white text-slate-900"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleJoinMeeting();
                    }
                  }}
                />
              </div>

              <div className="flex gap-2">
                <button
                  onClick={closeJoinModal}
                  className="flex-1 py-3 px-5 text-sm font-semibold bg-transparent text-slate-600 border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all duration-200"
                >
                  Cancel
                </button>

                <button
                  onClick={handleJoinMeeting}
                  disabled={!roomInput.trim()}
                  className={`flex-1 py-3 px-5 text-sm font-semibold rounded-xl transition-all duration-200 ${
                    roomInput.trim() 
                      ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700 shadow-lg hover:shadow-xl hover:-translate-y-0.5' 
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  Join
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-white/5 backdrop-blur-xl border-t border-white/10 px-10 py-5 text-center relative z-50">
        <p className="text-white/70 text-sm flex items-center justify-center gap-2">
          Made with <span className="text-red-500 text-base animate-pulse">❤️</span> by{' '}
          <a 
            href="https://www.linkedin.com/in/l-chandra-sekhar/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-white/70 hover:text-white hover:underline font-medium transition-colors duration-200"
          >
            Chandra Sekhar
          </a>
        </p>
      </footer>
    </div>
  );
}
