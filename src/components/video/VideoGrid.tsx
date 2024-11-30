import React from 'react';
import { VideoStream } from './VideoStream';

interface VideoGridProps {
  localStream: MediaStream | null;
  remoteStream: MediaStream | null;
}

export function VideoGrid({ localStream, remoteStream }: VideoGridProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="aspect-video">
        <VideoStream
          stream={localStream}
          label="You"
          muted={true}
        />
      </div>
      <div className="aspect-video">
        <VideoStream
          stream={remoteStream}
          label="Peer"
        />
      </div>
    </div>
  );
}