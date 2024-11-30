import { useState, useCallback, useRef, useEffect } from 'react';
import { WebRTCConnection } from '../services/webrtc/connection';
import { SignalingService } from '../services/webrtc/signaling';

interface VideoState {
  localStream: MediaStream | null;
  remoteStream: MediaStream | null;
  isCameraEnabled: boolean;
  isAudioEnabled: boolean;
  isSearching: boolean;
  isInitialized: boolean;
  permissionDenied: boolean;
  isConnecting: boolean;
  permissionState: 'prompt' | 'granted' | 'denied' | null;
  error: string | null;
  messages: Array<{ text: string; isSelf: boolean; timestamp: Date; }>;
}

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL;

if (!SOCKET_URL) {
  throw new Error('VITE_SOCKET_URL environment variable is not set');
}

export function useVideoChat() {
  const [state, setState] = useState<VideoState>({
    localStream: null,
    remoteStream: null,
    isCameraEnabled: true,
    isAudioEnabled: true,
    isSearching: false,
    isInitialized: false,
    permissionDenied: false,
    isConnecting: false,
    permissionState: null,
    error: null,
    messages: []
  });

  const [hasVideoDevices, setHasVideoDevices] = useState(false);
  const [deviceId, setDeviceId] = useState<string | null>(null);
  const [hasCamera, setHasCamera] = useState<boolean>(false);

  const webrtcRef = useRef<WebRTCConnection | null>(null);
  const signalingRef = useRef<SignalingService | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    async function checkDevices() {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter(device => device.kind === 'videoinput');
        setHasVideoDevices(videoDevices.length > 0);
        setHasCamera(videoDevices.length > 0);
        
        if (videoDevices.length > 0) {
          setDeviceId(videoDevices[0].deviceId);
        }
      } catch (error) {
        console.error('Failed to enumerate devices:', error);
      }
    }
    
    checkDevices();

    return () => {
      mountedRef.current = false;
    };
  }, []);

  const handlePeerMessage = useCallback((message: string) => {
    setState(prev => ({
      ...prev,
      messages: [...prev.messages, {
        text: message,
        isSelf: false,
        timestamp: new Date()
      }]
    }));
  }, []);

  const sendMessage = useCallback((message: string) => {
    if (!webrtcRef.current) return false;
    
    const sent = webrtcRef.current.sendMessage(message);
    if (sent) {
      setState(prev => ({
        ...prev,
        messages: [...prev.messages, {
          text: message,
          isSelf: true,
          timestamp: new Date()
        }]
      }));
      return true;
    }
    return false;
  }, []);

  const initializeStream = useCallback(async (audioOnly: boolean = false) => {
    try {
      if (!mountedRef.current) return false;

      // Stop any existing streams
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }

      const constraints: MediaStreamConstraints = {
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        },
        video: !audioOnly && hasCamera ? {
          deviceId: deviceId ? { exact: deviceId } : undefined,
          facingMode: 'user',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        } : false
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);

      if (!mountedRef.current) {
        stream.getTracks().forEach(track => track.stop());
        return false;
      }

      streamRef.current = stream;
      const videoTrack = stream.getVideoTracks()[0];
      const hasVideoTrack = videoTrack && !audioOnly;
      
      if (hasVideoTrack) {
        setDeviceId(videoTrack.getSettings().deviceId || null);
        videoTrack.enabled = true;
        console.log('Video track enabled:', {
          deviceId: videoTrack.getSettings().deviceId,
          enabled: videoTrack.enabled,
          state: videoTrack.readyState
        });
      }

      setState(prev => ({
        ...prev,
        localStream: stream,
        isCameraEnabled: hasVideoTrack,
        isAudioEnabled: true,
        isInitialized: true,
        permissionState: 'granted',
        permissionDenied: false,
        error: null
      }));

      return true;
    } catch (error) {
      console.error('Stream initialization error:', error);
      const isPermissionError = error instanceof DOMException && 
        (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError');
      
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to initialize audio/video',
        isInitialized: false,
        permissionDenied: isPermissionError,
        permissionState: isPermissionError ? 'denied' : null
      }));
      return false;
    }
  }, [deviceId, hasCamera]);

  const toggleAudio = useCallback(() => {
    if (!streamRef.current) return;
    
    const audioTrack = streamRef.current.getAudioTracks()[0];
    if (audioTrack) {
      audioTrack.enabled = !audioTrack.enabled;
      setState(prev => ({ ...prev, isAudioEnabled: audioTrack.enabled }));
    }
  }, []);

  const startSearching = useCallback(async (walletAddress: string) => {
    if (!mountedRef.current) return false;

    setState(prev => ({ 
      ...prev, 
      isConnecting: true, 
      isSearching: true,
      error: null 
    }));

    try {
      if (!streamRef.current) {
        const success = await initializeStream(false) || await initializeStream(true);
        if (!success) {
          setState(prev => ({ ...prev, isConnecting: false }));
          return false;
        }
      }

      webrtcRef.current = new WebRTCConnection();
      
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => {
          webrtcRef.current?.peerConnection?.addTrack(track, streamRef.current!);
        });
      }
      
      signalingRef.current = new SignalingService(SOCKET_URL);

      webrtcRef.current.onMessage(handlePeerMessage);
      
      webrtcRef.current.onStream((stream) => {
        setState(prev => ({ 
          ...prev, 
          remoteStream: stream,
          isConnecting: false 
        }));
      });
      
      signalingRef.current.onSignal(async (message) => {
        if (!webrtcRef.current) return;

        try {
          switch (message.type) {
            case 'offer':
              const answer = await webrtcRef.current.handleOffer(message.payload);
              signalingRef.current?.sendSignal({
                type: 'answer',
                payload: answer,
                from: walletAddress
              });
              break;
            case 'answer':
              await webrtcRef.current.handleAnswer(message.payload);
              break;
            case 'candidate':
              await webrtcRef.current.addIceCandidate(message.payload);
              break;
          }
        } catch (error) {
          console.error('Signal handling error:', error);
          setState(prev => ({
            ...prev,
            error: 'Connection failed',
            isConnecting: false
          }));
        }
      });

      signalingRef.current.connect(walletAddress);
      signalingRef.current.startSearching(walletAddress);

      return true;
    } catch (error) {
      console.error('Failed to start searching:', error);
      setState(prev => ({
        ...prev,
        isSearching: false,
        isConnecting: false,
        error: error instanceof Error ? error.message : 'Failed to start searching'
      }));
      return false;
    }
  }, [initializeStream, handlePeerMessage]);

  const disconnect = useCallback(() => {
    console.log('Disconnecting video chat...');

    if (webrtcRef.current) {
      webrtcRef.current.close();
      webrtcRef.current = null;
    }

    if (signalingRef.current) {
      console.log('Disconnecting from signaling server...');
      signalingRef.current.disconnect();
      signalingRef.current = null;
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }

    setState({
      localStream: null,
      remoteStream: null,
      isCameraEnabled: true,
      isAudioEnabled: true,
      isSearching: false,
      isInitialized: false,
      permissionDenied: false,
      isConnecting: false,
      permissionState: null,
      error: null,
      messages: []
    });
  }, []);

  useEffect(() => {
    return () => {
      mountedRef.current = false;
      disconnect();
    };
  }, [disconnect]);

  return {
    ...state,
    hasCamera,
    initializeStream,
    toggleAudio,
    startSearching,
    nextPeer: startSearching,
    disconnect,
    sendMessage
  };
}