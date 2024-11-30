export interface WebRTCConfig {
  iceServers: RTCIceServer[];
  iceCandidatePoolSize: number;
}

export interface PeerMessage {
  type: 'text' | 'signal';
  payload: any;
}

export interface SignalingMessage {
  type: 'offer' | 'answer' | 'candidate';
  payload: any;
  from: string;
  to?: string;
}