import { useState, useCallback, useRef, useEffect } from 'react';

interface StreamState {
  localStream: MediaStream | null;
  remoteStream: MediaStream | null;
  isCameraEnabled: boolean;
  isAudioEnabled: boolean;
  isSearching: boolean;
  isInitialized: boolean;
  permissionDenied: boolean;
  isConnecting: boolean;
  permissionState: 'prompt' | 'granted' | 'denied' | null;
}

export const useVideoChat = () => {
  const [state, setState] = useState<StreamState>({
    localStream: null,
    remoteStream: null,
    isCameraEnabled: false,
    isAudioEnabled: true,
    isSearching: false,
    isInitialized: false,
    permissionDenied: false,
    isConnecting: false,
    permissionState: null
  });

  const [isInitialized, setIsInitialized] = useState(false);
  const [permissionDenied, setPermissionDenied] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [hasAttemptedInit, setHasAttemptedInit] = useState(false);
  const [initAttempts, setInitAttempts] = useState(0);
  const [permissionState, setPermissionState] = useState<'prompt' | 'granted' | 'denied' | null>(null);

  const mountedRef = useRef(true);
  const streamRef = useRef<MediaStream | null>(null);
  const trackStateRef = useRef({ video: false, audio: true });
  const stateUpdateTimeoutRef = useRef<NodeJS.Timeout>();
  const initTimeoutRef = useRef<NodeJS.Timeout>();
  const trackCheckIntervalRef = useRef<NodeJS.Timeout>();
  const permissionCheckIntervalRef = useRef<NodeJS.Timeout>();

  const updateState = useCallback((updates: Partial<StreamState>) => {
    if (mountedRef.current) {
      if (stateUpdateTimeoutRef.current) {
        clearTimeout(stateUpdateTimeoutRef.current);
      }
      stateUpdateTimeoutRef.current = setTimeout(() => {
        setState(prev => {
          const newState = { ...prev, ...updates };
          // Ensure camera enabled state is consistent with stream state
          if (updates.localStream === null) {
            newState.isCameraEnabled = false;
            newState.isInitialized = false;
          }
          return newState;
        });
      }, 50);
    }
  }, []);

  const enableCamera = useCallback(async () => {
    try {
      if (!mountedRef.current) return false;
      setHasAttemptedInit(true);
      setInitAttempts(prev => prev + 1);

      // Clear existing streams
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
        await new Promise(resolve => setTimeout(resolve, 500));
      }

      // Update state to loading
      setState(prev => ({
        ...prev,
        isInitialized: false,
        isCameraEnabled: false,
        isConnecting: true
      }));

      // Check permission state
      const permissionStatus = await navigator.permissions.query({ name: 'camera' as PermissionName });
      
      if (permissionStatus.state === 'denied') {
        updateState({
          permissionDenied: true,
          permissionState: 'denied',
          isInitialized: false,
          isConnecting: false
        });
        return false;
      }

      // Request media stream
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: {
          facingMode: 'user',
          width: { ideal: 1280, max: 1920 },
          height: { ideal: 720, max: 1080 },
          frameRate: { ideal: 30, max: 60 }
        },
        audio: {
          autoGainControl: true,
          echoCancellation: true, 
          noiseSuppression: true,
          autoGainControl: true,
          sampleRate: 48000,
          channelCount: 2
        }
      });

      if (!mountedRef.current) {
        stream.getTracks().forEach(track => track.stop());
        return false;
      }

      const videoTrack = stream.getVideoTracks()[0];
      const audioTrack = stream.getAudioTracks()[0]; 

      if (videoTrack) {
        await new Promise(resolve => setTimeout(resolve, 250));
        videoTrack.enabled = true;
        trackStateRef.current.video = true;
      }

      if (audioTrack) {
        await audioTrack.applyConstraints({
          echoCancellation: true,
          noiseSuppression: true
        });
        audioTrack.enabled = trackStateRef.current.audio;
      }

      streamRef.current = stream;

      // Update state after successful initialization
      setState(prev => ({ 
        ...prev,
        ...prev,
        localStream: stream,
        isCameraEnabled: true,
        isAudioEnabled: true,
        isInitialized: true,
        permissionDenied: false,
        permissionState: 'granted',
        isConnecting: false
      }));

      return true;
    } catch (error) {
      console.error('Camera initialization error:', error);
      const isPermissionError = error instanceof DOMException && 
        (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError' || error.name === 'NotFoundError');
      
      if (isPermissionError) {
        updateState({ 
          permissionDenied: true,
          permissionState: 'denied',
          isInitialized: false,
          isCameraEnabled: false,
          isConnecting: false,
          hasAttemptedInit: true
        });
      } else {
        updateState({
          isInitialized: false,
          isCameraEnabled: false,
          isConnecting: false
        });
      }
      return false;
    }
  }, [updateState]);

  const toggleVideo = useCallback(() => {
    const stream = streamRef.current;
    if (!stream) return;

    const videoTrack = stream.getVideoTracks()[0];
    if (videoTrack) {
      const newEnabled = !videoTrack.enabled;
      videoTrack.enabled = newEnabled;
      trackStateRef.current.video = newEnabled;
      
      setState(prev => ({ 
        ...prev, 
        isCameraEnabled: newEnabled,
        isInitialized: true 
      }));
    }
  }, []);

  const toggleAudio = useCallback(() => {
    const stream = streamRef.current;
    if (!stream) return;
    
    const audioTrack = stream.getAudioTracks()[0];
    if (audioTrack) {
      const newEnabled = !audioTrack.enabled;
      audioTrack.enabled = newEnabled;
      trackStateRef.current.audio = newEnabled;
      
      setState(prev => ({ ...prev, isAudioEnabled: newEnabled }));
    }
  }, []);

  const startSearching = useCallback(async () => {
    try {
      if (!mountedRef.current) return false;
      if (!hasAttemptedInit) {
        const success = await enableCamera();
        if (!success) return false;
      }

      setState(prev => ({
        ...prev,
        isSearching: true,
        isInitialized: true
      }));

      if (!streamRef.current) {
        const success = await enableCamera();
        if (!success) {
          setState(prev => ({ 
            ...prev,
            isSearching: false,
            isInitialized: false
          }));
          return false;
        }
      }

      return true;
    } catch (error) {
      console.error('Failed to start searching:', error);
      updateState({ 
        isSearching: false,
        isInitialized: false 
      });
      return false;
    }
  }, [enableCamera, updateState]);

  const disconnect = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }

    updateState({
      localStream: null,
      remoteStream: null,
      isCameraEnabled: false,
      isAudioEnabled: true,
      isSearching: false,
      isInitialized: false,
      isConnecting: false
    });
  }, [updateState]);

  // Monitor track states
  useEffect(() => {
    const checkTrackStates = () => {
      if (!mountedRef.current || !streamRef.current) return;

      const videoTrack = streamRef.current.getVideoTracks()[0];
      const audioTrack = streamRef.current.getAudioTracks()[0];
      const updates: Partial<StreamState> = {};

      if (videoTrack) {
        const isVideoEnabled = videoTrack.enabled && videoTrack.readyState === 'live';
        if (trackStateRef.current.video !== isVideoEnabled) {
          trackStateRef.current.video = isVideoEnabled;
          updates.isCameraEnabled = isVideoEnabled;
        }
      }

      if (audioTrack) {
        const isAudioEnabled = audioTrack.enabled && audioTrack.readyState === 'live';
        if (trackStateRef.current.audio !== isAudioEnabled) {
          trackStateRef.current.audio = isAudioEnabled;
          updates.isAudioEnabled = isAudioEnabled;
        }
      }

      if (Object.keys(updates).length > 0) {
        updateState(updates);
      }
    };

    trackCheckIntervalRef.current = setInterval(checkTrackStates, 250);

    return () => {
      if (trackCheckIntervalRef.current) {
        clearInterval(trackCheckIntervalRef.current);
      }
    };
  }, [updateState]);

  // Monitor permission state
  useEffect(() => {
    const checkPermissionState = async () => {
      try {
        const status = await navigator.permissions.query({ name: 'camera' as PermissionName });
        if (mountedRef.current && status.state !== state.permissionState) {
          updateState({ permissionState: status.state });
        }
      } catch (error) {
        console.error('Permission check failed:', error);
      }
    };

    // Check initially and setup interval
    checkPermissionState();
    permissionCheckIntervalRef.current = setInterval(checkPermissionState, 1000);

    return () => {
      if (permissionCheckIntervalRef.current) {
        clearInterval(permissionCheckIntervalRef.current);
      }
    };
  }, [state.permissionState, updateState]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      mountedRef.current = false;
      
      if (stateUpdateTimeoutRef.current) {
        clearTimeout(stateUpdateTimeoutRef.current);
      }
      
      if (initTimeoutRef.current) {
        clearTimeout(initTimeoutRef.current);
      }
      
      if (permissionCheckIntervalRef.current) {
        clearInterval(permissionCheckIntervalRef.current);
      }
      if (trackCheckIntervalRef.current) {
        clearInterval(trackCheckIntervalRef.current);
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
    };
  }, []);

  return {
    ...state,
    enableCamera,
    toggleVideo,
    toggleAudio,
    startSearching,
    disconnect
  };
};