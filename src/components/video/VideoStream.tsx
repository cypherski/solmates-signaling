import React, { useRef, useEffect } from 'react';
import { Users } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface VideoStreamProps {
  stream: MediaStream | null;
  label: string;
  muted?: boolean;
}

export function VideoStream({ stream, label, muted = false }: VideoStreamProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const videoTrack = stream?.getVideoTracks()[0];
  const hasVideo = videoTrack?.enabled && videoTrack?.readyState === 'live';
  const audioTrack = stream?.getAudioTracks()[0];
  const isAudioEnabled = audioTrack?.enabled ?? false;

  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement || !stream) return;

    videoElement.srcObject = stream;
    
    const playVideo = async () => {
      try {
        await videoElement.play();
        console.log('Video playback started:', {
          hasVideo: stream.getVideoTracks().length > 0,
          videoEnabled: stream.getVideoTracks()[0]?.enabled,
          videoState: stream.getVideoTracks()[0]?.readyState
        });
        console.log('Video playback started');
      } catch (error) {
        console.error('Error playing video:', error);
      }
    };

    playVideo();

    return () => {
      videoElement.srcObject = null;
      videoElement.load();
    };
  }, [stream]);

  if (!stream) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn(
          "w-full h-full bg-gray-100 rounded-xl overflow-hidden",
          "border border-gray-200 shadow-md relative"
        )}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            {label === "Peer" && (
              <p className="text-sm text-gray-500">Looking for someone to chat with...</p>
            )}
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "w-full h-full bg-gray-100 rounded-xl overflow-hidden",
        "border border-gray-200 shadow-md relative"
      )}
    >
      {hasVideo ? (
        <div className="relative w-full h-full">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted={muted}
            style={{ objectFit: 'cover' }}
            className="w-full h-full object-cover bg-black"
          />
          {!isAudioEnabled && (
            <div className="absolute top-3 right-3 bg-red-500/90 text-white text-xs px-2 py-1 rounded">
              Audio Muted
            </div>
          )}
        </div>
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-3">
              <Users className="w-8 h-8 text-purple-500" />
            </div>
            <p className="text-sm font-medium text-gray-600">Audio Only</p>
            {isAudioEnabled && (
              <div className="mt-2">
                <div className="w-16 h-1.5 bg-purple-100 rounded-full mx-auto overflow-hidden">
                  <motion.div 
                    className="h-full bg-purple-500 rounded-full"
                    animate={{ 
                      width: ['0%', '100%']
                    }}
                    transition={{ 
                      duration: 1.5,
                      repeat: Infinity,
                      ease: 'easeInOut',
                      repeatType: 'reverse'
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      
      <div className={cn(
        "absolute bottom-3 left-3",
        "bg-black/70 backdrop-blur-sm",
        "px-3 py-1.5 rounded-lg",
        "text-sm font-medium text-white"
      )}>
        {label}
      </div>
    </motion.div>
  );
}
