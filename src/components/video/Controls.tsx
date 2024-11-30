import React from 'react';
import { motion } from 'framer-motion';
import { Camera, Mic, PlayCircle, X } from 'lucide-react';

interface ControlsProps {
  onToggleVideo: () => void;
  onToggleAudio: () => void;
  onNext: () => void;
  onEnd: () => void;
  isVideoEnabled: boolean;
  isAudioEnabled: boolean;
}

export function Controls({
  onToggleVideo,
  onToggleAudio,
  onNext,
  onEnd,
  isVideoEnabled,
  isAudioEnabled,
}: ControlsProps) {
  const controls = [
    {
      icon: Camera,
      onClick: onToggleVideo,
      active: isVideoEnabled,
      label: 'Toggle Video',
    },
    {
      icon: Mic,
      onClick: onToggleAudio,
      active: isAudioEnabled,
      label: 'Toggle Audio',
    },
    {
      icon: PlayCircle,
      onClick: onNext,
      isBlue: true,
      label: 'Next User',
    },
    {
      icon: X,
      onClick: onEnd,
      isRed: true,
      label: 'End Call',
    },
  ];

  return (
    <div className="flex justify-center gap-4 mt-auto pb-4">
      {controls.map((control, index) => (
        <motion.button
          key={index}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.1 }}
          onClick={control.onClick}
          className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
            control.isRed ? 'bg-red-600 hover:bg-red-700' :
            control.isBlue ? 'bg-blue-600 hover:bg-blue-700' :
            control.active ? 'bg-white/10 hover:bg-white/20' : 'bg-red-600 hover:bg-red-700'
          }`}
          aria-label={control.label}
        >
          <control.icon className="w-5 h-5 text-white" />
        </motion.button>
      ))}
    </div>
  );
}