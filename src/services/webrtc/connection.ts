import { WebRTCConfig } from './types';

const config: WebRTCConfig = {
  iceServers: [
    {
      urls: 'stun:stun.l.google.com:19302'
    },
    {
      urls: 'turn:turn.solmates.club:3478',
      username: 'solmates',
      credential: 'solmates123'
    },
  ],
  iceCandidatePoolSize: 10,
  iceTransportPolicy: 'all',
  bundlePolicy: 'max-bundle',
  rtcpMuxPolicy: 'require'
};

export class WebRTCConnection {
  private peerConnection: RTCPeerConnection | null = null;
  private dataChannel: RTCDataChannel | null = null;
  private onMessageCallback: ((message: string) => void) | null = null;
  private onStreamCallback: ((stream: MediaStream) => void) | null = null;
  private onStateChangeCallback: ((state: RTCPeerConnectionState) => void) | null = null;

  constructor() {
    this.peerConnection = new RTCPeerConnection(config);
    this.setupConnectionHandlers();
  }

  private setupConnectionHandlers() {
    if (!this.peerConnection) return;

    this.peerConnection.onconnectionstatechange = () => {
      console.log('Connection state:', this.peerConnection?.connectionState);
      if (this.onStateChangeCallback && this.peerConnection) {
        this.onStateChangeCallback(this.peerConnection.connectionState);
      }
    };

    this.peerConnection.oniceconnectionstatechange = () => {
      const state = this.peerConnection?.iceConnectionState;
      console.log('ICE Connection State:', state);
      if (state === 'failed' || state === 'disconnected') {
        this.restartIce();
      }
    };

    this.peerConnection.onicegatheringstatechange = () => {
      console.log('ICE gathering state:', this.peerConnection?.iceGatheringState);
    };

    this.peerConnection.onnegotiationneeded = async () => {
      try {
        const offer = await this.peerConnection!.createOffer();
        await this.peerConnection!.setLocalDescription(offer);
      } catch (err) {
        console.error('Negotiation failed:', err);
      }
    };

    this.peerConnection.ontrack = (event) => {
      if (this.onStreamCallback && event.streams[0]) {
        this.onStreamCallback(event.streams[0]);
      }
    };

    this.peerConnection.onconnectionstatechange = () => {
      if (this.onStateChangeCallback && this.peerConnection) {
        this.onStateChangeCallback(this.peerConnection.connectionState);
      }
    };

    this.peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        // Handle ICE candidate
        console.log('New ICE candidate:', event.candidate);
      }
    };

    this.peerConnection.ondatachannel = (event) => {
      this.dataChannel = event.channel;
      this.setupDataChannel();
    };
  }

  private setupDataChannel() {
    if (!this.dataChannel) return;

    this.dataChannel.onmessage = (event) => {
      if (this.onMessageCallback) {
        this.onMessageCallback(event.data);
      }
    };

    this.dataChannel.onopen = () => {
      console.log('Data channel opened');
    };
    
    this.dataChannel.onerror = (error) => {
      console.error('Data channel error:', error);
    };

    this.dataChannel.onclose = () => {
      console.log('Data channel closed');
    };
  }

  public async createOffer(): Promise<RTCSessionDescriptionInit> {
    if (!this.peerConnection) throw new Error('Peer connection not initialized');

    // Create data channel before offer
    if (!this.dataChannel) {
      this.dataChannel = this.peerConnection.createDataChannel('chat', {
        ordered: true
      });
      this.setupDataChannel();
    }

    const offer = await this.peerConnection.createOffer();
    await this.peerConnection.setLocalDescription(offer);
    return offer;
  }

  private async restartIce() {
    if (!this.peerConnection) return;
    try {
      const offer = await this.peerConnection.createOffer({ iceRestart: true });
      await this.peerConnection.setLocalDescription(offer);
    } catch (error) {
      console.error('ICE restart failed:', error);
    }
  }

  public async handleOffer(offer: RTCSessionDescriptionInit): Promise<RTCSessionDescriptionInit> {
    if (!this.peerConnection) throw new Error('Peer connection not initialized');

    await this.peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
    const answer = await this.peerConnection.createAnswer();
    await this.peerConnection.setLocalDescription(answer);
    return answer;
  }

  public async handleAnswer(answer: RTCSessionDescriptionInit): Promise<void> {
    if (!this.peerConnection) throw new Error('Peer connection not initialized');
    await this.peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
  }

  public async addIceCandidate(candidate: RTCIceCandidateInit): Promise<void> {
    if (!this.peerConnection) throw new Error('Peer connection not initialized');
    await this.peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
  }

  public sendMessage(message: string): boolean {
    if (this.dataChannel?.readyState === 'open') {
      this.dataChannel.send(message);
      return true;
    }
    return false;
  }

  public onMessage(callback: (message: string) => void): void {
    this.onMessageCallback = callback;
  }

  public onStream(callback: (stream: MediaStream) => void): void {
    this.onStreamCallback = callback;
  }

  public onStateChange(callback: (state: RTCPeerConnectionState) => void): void {
    this.onStateChangeCallback = callback;
  }

  public close(): void {
    if (this.dataChannel) {
      this.dataChannel.close();
    }
    if (this.peerConnection) {
      this.peerConnection.close();
    }
  }
}