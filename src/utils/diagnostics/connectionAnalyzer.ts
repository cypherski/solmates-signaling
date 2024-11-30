import { ConnectionMetrics, IceStats } from '../../types/diagnostics';

export class ConnectionAnalyzer {
  private static readonly CONNECTION_THRESHOLDS = {
    maxRoundTripTime: 300, // ms
    minBandwidth: 500000, // bps
    maxJitter: 50 // ms
  };

  static async analyzeConnection(peerConnection: RTCPeerConnection): Promise<ConnectionMetrics> {
    const stats = await peerConnection.getStats();
    const metrics: ConnectionMetrics = {
      roundTripTime: 0,
      bandwidth: 0,
      jitter: 0,
      packetLoss: 0,
      iceState: peerConnection.iceConnectionState,
      connectionState: peerConnection.connectionState
    };

    stats.forEach(stat => {
      if (stat.type === 'candidate-pair' && stat.state === 'succeeded') {
        metrics.roundTripTime = stat.currentRoundTripTime * 1000 || 0;
        metrics.bandwidth = stat.availableOutgoingBitrate || 0;
      }
      if (stat.type === 'inbound-rtp') {
        metrics.jitter = stat.jitter * 1000 || 0;
        metrics.packetLoss = stat.packetsLost ? 
          (stat.packetsLost / (stat.packetsReceived + stat.packetsLost)) * 100 : 0;
      }
    });

    return metrics;
  }

  static async getIceStats(peerConnection: RTCPeerConnection): Promise<IceStats> {
    const stats = await peerConnection.getStats();
    const iceStats: IceStats = {
      localCandidates: [],
      remoteCandidates: [],
      selectedPair: null
    };

    stats.forEach(stat => {
      if (stat.type === 'local-candidate') {
        iceStats.localCandidates.push({
          type: stat.candidateType,
          protocol: stat.protocol,
          address: stat.address,
          port: stat.port
        });
      }
      if (stat.type === 'remote-candidate') {
        iceStats.remoteCandidates.push({
          type: stat.candidateType,
          protocol: stat.protocol,
          address: stat.address,
          port: stat.port
        });
      }
      if (stat.type === 'candidate-pair' && stat.state === 'succeeded') {
        iceStats.selectedPair = {
          local: stat.localCandidateId,
          remote: stat.remoteCandidateId,
          roundTripTime: stat.currentRoundTripTime * 1000
        };
      }
    });

    return iceStats;
  }

  static validateConnectionQuality(metrics: ConnectionMetrics): boolean {
    return (
      metrics.roundTripTime <= this.CONNECTION_THRESHOLDS.maxRoundTripTime &&
      metrics.bandwidth >= this.CONNECTION_THRESHOLDS.minBandwidth &&
      metrics.jitter <= this.CONNECTION_THRESHOLDS.maxJitter &&
      metrics.packetLoss <= 5 // 5% packet loss threshold
    );
  }

  static getConnectionStatus(metrics: ConnectionMetrics): 'excellent' | 'good' | 'poor' | 'failed' {
    if (!this.validateConnectionQuality(metrics)) {
      return 'failed';
    }

    if (
      metrics.roundTripTime <= 100 &&
      metrics.bandwidth >= 2000000 &&
      metrics.jitter <= 20 &&
      metrics.packetLoss <= 1
    ) {
      return 'excellent';
    }

    if (
      metrics.roundTripTime <= 200 &&
      metrics.bandwidth >= 1000000 &&
      metrics.jitter <= 30 &&
      metrics.packetLoss <= 2
    ) {
      return 'good';
    }

    return 'poor';
  }
}