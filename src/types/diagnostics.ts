export interface MediaQualityMetrics {
  frameRate?: number;
  resolution?: {
    width: number;
    height: number;
  };
  sampleRate?: number;
  channelCount?: number;
  deviceId: string;
  constraints: {
    maxFrameRate?: number;
    maxResolution?: {
      width: number;
      height: number;
    };
    maxSampleRate?: number;
    maxChannels?: number;
  };
  active: boolean;
}

export interface StreamStats {
  video: {
    packetsLost: number;
    packetsReceived: number;
    bytesReceived: number;
    framesDecoded: number;
    frameRate: number;
    jitter: number;
  };
  audio: {
    packetsLost: number;
    packetsReceived: number;
    bytesReceived: number;
    jitter: number;
    roundTripTime: number;
  };
}

export interface ConnectionMetrics {
  roundTripTime: number;
  bandwidth: number;
  jitter: number;
  packetLoss: number;
  iceState: RTCIceConnectionState;
  connectionState: RTCPeerConnectionState;
}

export interface IceCandidate {
  type: string;
  protocol: string;
  address: string;
  port: number;
}

export interface IceCandidatePair {
  local: string;
  remote: string;
  roundTripTime: number;
}

export interface IceStats {
  localCandidates: IceCandidate[];
  remoteCandidates: IceCandidate[];
  selectedPair: IceCandidatePair | null;
}