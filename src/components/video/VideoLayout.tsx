import React from 'react';
import { VideoGrid } from './VideoGrid';
import { VideoControls } from './VideoControls';
import { ChatPanel } from './ChatPanel';
import { SearchingIndicator } from './SearchingIndicator';
import { cn } from '@/lib/utils';

interface VideoLayoutProps {
  localStream: MediaStream | null;
  remoteStream: MediaStream | null;
  isAudioEnabled: boolean;
  isSearching: boolean;
  onToggleAudio: () => void;
  onNext: () => void;
  onSendMessage: (message: string) => void;
  messages: Array<{ text: string; isSelf: boolean; timestamp: Date; }>;
}

export function VideoLayout({
  localStream,
  remoteStream,
  isAudioEnabled,
  isSearching,
  onToggleAudio,
  onNext,
  onSendMessage,
  messages
}: VideoLayoutProps) {
  return (
    <div className={cn(
      "max-w-[1200px] mx-auto px-4 py-6",
      "min-h-[calc(100vh-5rem)]",
      "flex items-center justify-center"
    )}>
      <div className="flex gap-6">
        <div className="w-[700px] space-y-6">
          <VideoGrid
            localStream={localStream}
            remoteStream={remoteStream}
          />
          <div className="flex justify-center">
            <VideoControls
              isAudioEnabled={isAudioEnabled}
              onToggleAudio={onToggleAudio}
              onNext={onNext}
            />
          </div>
        </div>
        <div className="w-[350px] h-[700px]">
          <ChatPanel onSendMessage={onSendMessage} messages={messages} />
        </div>
      </div>

      {isSearching && !remoteStream && (
        <SearchingIndicator onCancel={onNext} />
      )}
    </div>
  );
}