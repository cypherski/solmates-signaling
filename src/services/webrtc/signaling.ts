import { io, Socket } from 'socket.io-client';
import { SignalingMessage } from './types';

export class SignalingService {
  private socket: Socket | null = null;
  private onSignalCallback: ((message: SignalingMessage) => void) | null = null;
  private onMatchCallback: ((peerId: string) => void) | null = null;

  constructor(private url: string) {}

  public connect(walletAddress: string): void {
    this.socket = io(this.url, {
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      timeout: 10000,
      autoConnect: true,
      forceNew: true,
      query: { walletAddress }
    });

    this.setupSocketHandlers();
  }

  private setupSocketHandlers(): void {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      console.log('Connected to signaling server');
    });

    this.socket.io.on("reconnect_attempt", () => {
      console.log('Attempting to reconnect...');
    });

    this.socket.io.on("reconnect", () => {
      console.log('Reconnected to signaling server');
    });

    this.socket.on('connect_error', (error) => {
      console.error('Connection error:', error);
    });

    this.socket.on('connect', () => {
      console.log('Connected to signaling server');
    });

    this.socket.on('matched', ({ peer }) => {
      if (this.onMatchCallback) {
        this.onMatchCallback(peer);
      }
    });

    this.socket.on('signal', ({ signal }) => {
      if (this.onSignalCallback) {
        this.onSignalCallback(signal);
      }
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from signaling server');
    });
    
    this.socket.on('error', (error) => {
      console.error('Signaling server error:', error);
    });
  }

  public sendSignal(signal: SignalingMessage): void {
    if (this.socket?.connected) {
      this.socket.emit('signal', { signal });
    }
  }

  public startSearching(walletAddress: string): void {
    if (this.socket?.connected) {
      console.log('Emitting ready signal with wallet:', walletAddress);
      this.socket.emit('ready', { walletAddress });
    } else {
      console.warn('Socket not connected, attempting to reconnect...');
      this.socket?.connect();
    }
  }

  public onSignal(callback: (message: SignalingMessage) => void): void {
    this.onSignalCallback = callback;
  }

  public onMatch(callback: (peerId: string) => void): void {
    this.onMatchCallback = callback;
  }

  public disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }
}