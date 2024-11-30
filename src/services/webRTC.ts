import SimplePeer from 'simple-peer';
import { sendSignal } from './supabase';

const configuration = {
  iceServers: [
    {
      urls: 'stun:stun.l.google.com:19302'
    }
  ],
  iceCandidatePoolSize: 10
};

export class WebRTCService {
  private peer: SimplePeer.Instance | null = null;
  private stream: MediaStream | null = null;
  private initialized: boolean = false;
  private onStreamCallback: ((stream: MediaStream) => void) | null = null;
  private onCloseCallback = new Set<() => void>();
  private onErrorCallback = new Set<(error: Error) => void>();

  async initialize(initiator: boolean = false, stream: MediaStream): Promise<void> {
    try {
      if (this.peer) {
        this.destroy();
      }
      
      this.stream = stream;
      this.initialized = true;

      this.peer = new SimplePeer({
        initiator,
        stream,
        trickle: false,
        config: configuration
      });

      this.setupPeerEvents();
    } catch (error) {
      console.error('WebRTC initialization failed:', error);
      if (this.onErrorCallback) {
        this.onErrorCallback(error instanceof Error ? error : new Error('Failed to initialize'));
      }
      throw error;
    }
  }

  isInitialized(): boolean {
    return this.initialized;
  }

  setLocalStream(stream: MediaStream): void {
    this.stream = stream;
  }

  private setupPeerEvents(): void {
    if (!this.peer) return;

    this.peer.on('signal', async signal => {
      try {
        await sendSignal({ type: 'signal', payload: signal });
      } catch (error) {
        console.error('Failed to send signal:', error);
        if (this.onErrorCallback) {
          this.onErrorCallback(new Error('Signaling failed'));
        }
      }
    });

    this.peer.on('stream', stream => {
      if (this.onStreamCallback) {
        this.onStreamCallback(stream);
      }
    });

    this.peer.on('close', () => {
      if (this.onCloseCallback) {
        this.onCloseCallback();
      }
    });

    return () => {
      // Cleanup handled by Supabase unsubscribe
    };
  }

  signal(data: any): void {
    if (this.peer) {
      try {
        this.peer.signal(data);
      } catch (error) {
        console.error('Error signaling peer:', error);
        if (this.onErrorCallback) {
          this.onErrorCallback(new Error('Failed to signal peer'));
        }
      }
    };
  }

  onStream(callback: (stream: MediaStream) => void): void {
    this.onStreamCallback = callback;
  }

  addCloseListener(callback: () => void): () => void {
    this.onCloseCallback.add(callback);
    return () => this.onCloseCallback.delete(callback);
  }
  
  addErrorListener(callback: (error: Error) => void): () => void {
    this.onErrorCallback.add(callback);
    return () => this.onErrorCallback.delete(callback);
  }

  getLocalStream(): MediaStream | null {
    return this.stream;
  }

  toggleVideo(enabled: boolean): void {
    if (this.stream) {
      this.stream.getVideoTracks().forEach(track => {
        track.enabled = enabled;
      });
    }
  }

  toggleAudio(enabled: boolean): void {
    if (this.stream) {
      this.stream.getAudioTracks().forEach(track => {
        track.enabled = enabled;
      });
    }
  }

  destroy(): void {
    if (this.peer) {
      this.peer.destroy();
    }
    this.peer = null;
    this.initialized = false;
    this.stream = null;
  }
}