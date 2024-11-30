import React from 'react';
import { Mic, SkipForward } from 'lucide-react';
import { ControlButton } from './ControlButton';
import { cn } from '@/lib/utils';

interface VideoControlsProps {
  isAudioEnabled: boolean;
  onToggleAudio: () => void;
  onNext: () => void;
}

export function VideoControls({
  isAudioEnabled,
  onToggleAudio,
  onNext,
}: VideoControlsProps) {
  return (
    <div className="flex justify-center gap-4 mt-6">
      <ControlButton
        onClick={onToggleAudio}
        icon={Mic}
        active={isAudioEnabled}
        variant="primary"
        className={cn(
          isAudioEnabled 
            ? "bg-green-500 hover:bg-green-600" 
            : "bg-red-500 hover:bg-red-600",
          "transition-colors"
        )}
        iconClassName={cn(
          "text-white w-4 h-4"
        )}
      />
      <ControlButton
        onClick={onNext}
        icon={SkipForward}
        variant="primary"
        className={cn(
          "bg-purple-600 hover:bg-purple-700",
          "shadow-md shadow-purple-500/20",
          "text-white"
        )}
        iconClassName="w-4 h-4"
      />
    </div>
  );
}