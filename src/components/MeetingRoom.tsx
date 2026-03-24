'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';
import { useAuth } from '@/contexts/AuthContext';

function randomID(len: number): string {
  let result = '';
  if (result) return result;
  const chars = '12345qwertyuiopasdfgh67890jklmnbvcxzMNBVCZXASDQWERTYHGFUIOLKJP';
  const maxPos = chars.length;
  len = len || 5;
  for (let i = 0; i < len; i++) {
    result += chars.charAt(Math.floor(Math.random() * maxPos));
  }
  return result;
}

export default function MeetingRoom() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const containerRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const zpInstanceRef = useRef<any>(null);
  const [showTimeoutModal, setShowTimeoutModal] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const roomID = params.roomID as string;

  // Timer effect for 5-minute limit
  useEffect(() => {
    if (timeLeft > 0) {
      timerRef.current = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    } else {
      // Time's up - show timeout modal and end meeting
      setShowTimeoutModal(true);
      if (zpInstanceRef.current) {
        zpInstanceRef.current.destroy();
        zpInstanceRef.current = null;
      }
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [timeLeft]);

  useEffect(() => {
    const initializeMeeting = async () => {
      if (!containerRef.current) return;

      try {
        // Clean up any existing instance
        if (zpInstanceRef.current) {
          zpInstanceRef.current.destroy();
          zpInstanceRef.current = null;
        }

        // Clear the container
        if (containerRef.current) {
          containerRef.current.innerHTML = '';
        }

        // Generate Kit Token
        const rawAppId = process.env.NEXT_PUBLIC_ZEGO_APP_ID || '';
        const appID = Number(String(rawAppId).replace(/[^0-9]/g, ''));
        const serverSecret = String(process.env.NEXT_PUBLIC_ZEGO_SERVER_SECRET || '')
          .replace(/^\"|\"$/g, '')
          .trim();

        if (!appID || !serverSecret) {
          throw new Error('Zego credentials missing or invalid. Check environment variables NEXT_PUBLIC_ZEGO_APP_ID and NEXT_PUBLIC_ZEGO_SERVER_SECRET');
        }
        
        // Use authenticated user's information
        const userID = user?.id || randomID(5);
        const userName = user ? `${user.firstName} ${user.lastName}` : randomID(5);
        
        const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(appID, serverSecret, roomID, userID, userName);

        // Create instance object from Kit Token.
        const zp = ZegoUIKitPrebuilt.create(kitToken);
        zpInstanceRef.current = zp;
        
        // start the call
        zp.joinRoom({
          container: containerRef.current,
          sharedLinks: [
            {
              name: 'Personal link',
              url: `${window.location.protocol}//${window.location.host}/meeting/${roomID}`,
            },
          ],
          scenario: {
            mode: ZegoUIKitPrebuilt.VideoConference,
          },
          showRoomTimer: true,
          showLeavingView: true,
          showScreenSharingButton: true,
          maxUsers: 3,
          videoResolutionDefault: ZegoUIKitPrebuilt.VideoResolution_360P,
          onLeaveRoom: () => {
            // Clean up instance before navigating
            if (zpInstanceRef.current) {
              zpInstanceRef.current.destroy();
              zpInstanceRef.current = null;
            }
            // Navigate back to home when leaving the room
            router.push('/');
          }
        });
      } catch (error) {
        console.error('Error initializing meeting:', error);
        // Clean up on error
        if (zpInstanceRef.current) {
          zpInstanceRef.current.destroy();
          zpInstanceRef.current = null;
        }
        // Navigate back to home on error
        router.push('/');
      }
    };

    initializeMeeting();

    // Cleanup function
    return () => {
      if (zpInstanceRef.current) {
        zpInstanceRef.current.destroy();
        zpInstanceRef.current = null;
      }
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      if (containerRef.current) {
        try { 
          containerRef.current.innerHTML = ''; 
        } catch (_) {}
      }
    };
  }, [roomID, router, user]);

  // Ensure destruction when navigating with browser back/forward or leaving the page
  useEffect(() => {
    const hardCleanup = () => {
      if (zpInstanceRef.current) {
        try { zpInstanceRef.current.destroy(); } catch (_) {}
        zpInstanceRef.current = null;
      }
      if (containerRef.current) {
        try { containerRef.current.innerHTML = ''; } catch (_) {}
      }
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };

    const onPopState = () => hardCleanup();
    const onBeforeUnload = () => hardCleanup();
    const onPageHide = () => hardCleanup();

    window.addEventListener('popstate', onPopState);
    window.addEventListener('beforeunload', onBeforeUnload);
    window.addEventListener('pagehide', onPageHide);

    return () => {
      window.removeEventListener('popstate', onPopState);
      window.removeEventListener('beforeunload', onBeforeUnload);
      window.removeEventListener('pagehide', onPageHide);
    };
  }, []);

  const handleTimeoutClose = () => {
    setShowTimeoutModal(false);
    router.push('/');
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <>
      <div
        className="myCallContainer"
        ref={containerRef}
        style={{ width: '100vw', height: '100vh' }}
      />

      {/* Timeout Modal */}
      {showTimeoutModal && (
        <div className="fixed inset-0 bg-slate-900/90 backdrop-blur-sm flex items-center justify-center z-50 p-5">
          <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-10 max-w-md w-full shadow-2xl border border-white/30 text-center">
            {/* Icon */}
            <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" fill="white"/>
              </svg>
            </div>

            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              Meeting Time Expired
            </h2>

            <p className="text-base text-slate-600 mb-8 leading-relaxed">
              This is a development mode application with a 5-minute time limit per meeting. The meeting has automatically ended.
            </p>

            <button
              onClick={handleTimeoutClose}
              className="px-8 py-4 text-base font-semibold bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl hover:from-indigo-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
            >
              Return to Home
            </button>
          </div>
        </div>
      )}
    </>
  );
}
