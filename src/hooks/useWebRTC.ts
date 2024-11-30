import { useEffect, useRef, useState, useCallback } from 'react';
import SimplePeer from 'simple-peer';
import { useWallet } from '../store/useWallet';
import { socket, connectToSignalingServer, emitReady, emitNext } from '../services/socket';

const configuration = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:global.stun.twilio.com:3478' }
  ]
};

export function useWebRTC() {
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [mediaError, setMediaError] = useState<string | null>(null);
  const peerRef = useRef<SimplePeer.Instance | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const { isConnected: isWalletConnected, publicKey } = useWallet();

  const initializeMedia = useCallback(async () => {
    try {
      // Stop any existing tracks
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }

      const constraints = {
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          frameRate: { ideal: 30 }
        },
        audio: true
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;
      setLocalStream(stream);
      setMediaError(null);
      return stream;
    } catch (error) {
      console.error('Error accessing media devices:', error);
      setMediaError(error instanceof Error ? error.message : 'Failed to access camera/microphone');
      return null;
    }
  }, []);

  const initializePeer = useCallback((initiator: boolean = false) => {
    if (!streamRef.current || !publicKey) return;

    if (peerRef.current) {
      peerRef.current.destroy();
    }

    peerRef.current = new SimplePeer({
      initiator,
      stream: streamRef.current,
      trickle: false,
      config: configuration
    });

    peerRef.current.on('signal', data => {
      socket.emit(initiator ? 'offer' : 'answer', {
        signal: data,
        from: publicKey.toString()
      });
    });

    peerRef.current.on('stream', stream => {
      setRemoteStream(stream);
      setIsConnected(true);
      setIsSearching(false);
    });

    peerRef.current.on('close', () => {
      setIsConnected(false);
      setRemoteStream(null);
    });

    peerRef.current.on('error', (err) => {
      console.error('Peer error:', err);
      setIsConnected(false);
      setRemoteStream(null);
    });
  }, [publicKey]);

  useEffect(() => {
    if (!isWalletConnected || !publicKey) return;

    let mounted = true;

    const setup = async () => {
      if (mounted) {
        await initializeMedia();
        connectToSignalingServer();
      }
    };

    setup();

    socket.on('matched', ({ initiator }) => {
      if (mounted) {
        initializePeer(initiator);
      }
    });

    socket.on('signal', ({ signal }) => {
      if (mounted && peerRef.current) {
        peerRef.current.signal(signal);
      }
    });

    return () => {
      mounted = false;
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      if (peerRef.current) {
        peerRef.current.destroy();
      }
      socket.off('matched');
      socket.off('signal');
    };
  }, [isWalletConnected, publicKey, initializePeer, initializeMedia]);

  const startSearching = useCallback(async () => {
    if (!publicKey) return;
    
    if (!streamRef.current) {
      await initializeMedia();
    }
    
    setIsSearching(true);
    emitReady(publicKey.toString());
  }, [publicKey, initializeMedia]);

  const nextPeer = useCallback(async () => {
    if (!publicKey) return;
    
    if (peerRef.current) {
      peerRef.current.destroy();
    }
    
    setRemoteStream(null);
    setIsConnected(false);
    setIsSearching(true);
    
    if (!streamRef.current) {
      await initializeMedia();
    }
    
    emitNext(publicKey.toString());
  }, [publicKey, initializeMedia]);

  const toggleVideo = useCallback(() => {
    if (streamRef.current) {
      const videoTrack = streamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
      }
    }
  }, []);

  const toggleAudio = useCallback(() => {
    if (streamRef.current) {
      const audioTrack = streamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
      }
    }
  }, []);

  return {
    localStream,
    remoteStream,
    isConnected,
    isSearching,
    mediaError,
    startSearching,
    nextPeer,
    toggleVideo,
    toggleAudio,
  };
}