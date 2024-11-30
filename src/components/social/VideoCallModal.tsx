import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mic, MicOff, Camera, CameraOff, PhoneOff, Monitor, Minimize2 } from 'lucide-react';

interface VideoCallModalProps {
  isOpen: boolean;
  friendId: string;
  friendName: string;
  onClose: () => void;
}

export function VideoCallModal({ isOpen, friendId, friendName, onClose }: VideoCallModalProps) {
  const [isMinimized, setIsMinimized] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    let stream: MediaStream | null = null;

    const startVideo = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error('Error accessing media devices:', error);
      }
    };

    if (isOpen && !isCameraOff) {
      startVideo();
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [isOpen, isCameraOff]);

  const handleScreenShare = async () => {
    try {
      const screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: true
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = screenStream;
      }
      
      setIsScreenSharing(true);
      
      screenStream.getVideoTracks()[0].onended = () => {
        setIsScreenSharing(false);
      };
    } catch (error) {
      console.error('Error sharing screen:', error);
      setIsScreenSharing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className={`fixed ${isMinimized ? 'bottom-4 right-4' : 'inset-0'} z-50 flex items-end justify-end`}
      >
        <motion.div
          initial={isMinimized ? { y: 0, width: '300px', height: '60px' } : { y: 20, opacity: 0 }}
          animate={isMinimized 
            ? { y: 0, width: '300px', height: '60px', opacity: 1 }
            : { y: 0, width: '100%', height: '100%', opacity: 1 }
          }
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className={`bg-gray-900/95 backdrop-blur-lg ${
            isMinimized ? 'rounded-lg' : 'w-full md:w-[800px] h-full'
          }`}
        >
          {isMinimized ? (
            <button
              onClick={() => setIsMinimized(false)}
              className="w-full h-full flex items-center justify-between px-4"
            >
              <span className="font-medium">Call with {friendName}</span>
              <X className="w-5 h-5" onClick={(e) => {
                e.stopPropagation();
                onClose();
              }} />
            </button>
          ) : (
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between p-4 border-b border-white/10">
                <h2 className="text-lg font-semibold">Call with {friendName}</h2>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsMinimized(true)}
                    className="p-2 rounded-lg hover:bg-white/5"
                  >
                    <Minimize2 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={onClose}
                    className="p-2 rounded-lg hover:bg-white/5"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="flex-1 p-4">
                <div className="relative h-full bg-black rounded-lg overflow-hidden">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                  />
                  {isCameraOff && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
                      <Camera className="w-16 h-16 text-gray-600" />
                    </div>
                  )}
                </div>
              </div>

              <div className="p-4 border-t border-white/10">
                <div className="flex justify-center gap-4">
                  <button
                    onClick={() => setIsMuted(!isMuted)}
                    className={`p-3 rounded-full ${
                      isMuted ? 'bg-red-600 hover:bg-red-700' : 'bg-white/10 hover:bg-white/20'
                    }`}
                  >
                    {isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
                  </button>
                  
                  <button
                    onClick={() => setIsCameraOff(!isCameraOff)}
                    className={`p-3 rounded-full ${
                      isCameraOff ? 'bg-red-600 hover:bg-red-700' : 'bg-white/10 hover:bg-white/20'
                    }`}
                  >
                    {isCameraOff ? <CameraOff className="w-6 h-6" /> : <Camera className="w-6 h-6" />}
                  </button>
                  
                  <button
                    onClick={handleScreenShare}
                    className={`p-3 rounded-full ${
                      isScreenSharing ? 'bg-purple-600 hover:bg-purple-700' : 'bg-white/10 hover:bg-white/20'
                    }`}
                  >
                    <Monitor className="w-6 h-6" />
                  </button>
                  
                  <button
                    onClick={onClose}
                    className="p-3 rounded-full bg-red-600 hover:bg-red-700"
                  >
                    <PhoneOff className="w-6 h-6" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}