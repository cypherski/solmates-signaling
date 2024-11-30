import { MediaQualityMetrics, StreamStats } from '../../types/diagnostics';

export class MediaAnalyzer {
  private static readonly QUALITY_THRESHOLDS = {
    video: {
      minFrameRate: 24,
      minResolution: { width: 640, height: 480 },
      maxInitTime: 3000 // ms
    },
    audio: {
      minSampleRate: 44100,
      maxLatency: 150 // ms
    }
  };

  static async analyzeVideoStream(stream: MediaStream): Promise<MediaQualityMetrics> {
    const videoTrack = stream.getVideoTracks()[0];
    const settings = videoTrack.getSettings();
    const capabilities = videoTrack.getCapabilities();

    return {
      frameRate: settings.frameRate || 0,
      resolution: {
        width: settings.width || 0,
        height: settings.height || 0
      },
      deviceId: settings.deviceId || '',
      constraints: {
        maxFrameRate: capabilities.frameRate?.max || 0,
        maxResolution: {
          width: capabilities.width?.max || 0,
          height: capabilities.height?.max || 0
        }
      },
      active: videoTrack.enabled && videoTrack.readyState === 'live'
    };
  }

  static async analyzeAudioStream(stream: MediaStream): Promise<MediaQualityMetrics> {
    const audioTrack = stream.getAudioTracks()[0];
    const settings = audioTrack.getSettings();
    const capabilities = audioTrack.getCapabilities();

    return {
      sampleRate: settings.sampleRate || 0,
      channelCount: settings.channelCount || 0,
      deviceId: settings.deviceId || '',
      constraints: {
        maxSampleRate: capabilities.sampleRate?.max || 0,
        maxChannels: capabilities.channelCount?.max || 0
      },
      active: audioTrack.enabled && audioTrack.readyState === 'live'
    };
  }

  static validateStreamQuality(metrics: MediaQualityMetrics): boolean {
    if ('frameRate' in metrics) {
      return (
        metrics.frameRate >= this.QUALITY_THRESHOLDS.video.minFrameRate &&
        metrics.resolution.width >= this.QUALITY_THRESHOLDS.video.minResolution.width &&
        metrics.resolution.height >= this.QUALITY_THRESHOLDS.video.minResolution.height
      );
    } else {
      return (
        metrics.sampleRate >= this.QUALITY_THRESHOLDS.audio.minSampleRate
      );
    }
  }

  static async getStreamStats(peerConnection: RTCPeerConnection): Promise<StreamStats> {
    const stats = await peerConnection.getStats();
    const results: StreamStats = {
      video: {
        packetsLost: 0,
        packetsReceived: 0,
        bytesReceived: 0,
        framesDecoded: 0,
        frameRate: 0,
        jitter: 0
      },
      audio: {
        packetsLost: 0,
        packetsReceived: 0,
        bytesReceived: 0,
        jitter: 0,
        roundTripTime: 0
      }
    };

    stats.forEach(stat => {
      if (stat.type === 'inbound-rtp') {
        const mediaType = stat.kind as 'video' | 'audio';
        if (mediaType === 'video') {
          results.video = {
            ...results.video,
            packetsLost: stat.packetsLost || 0,
            packetsReceived: stat.packetsReceived || 0,
            bytesReceived: stat.bytesReceived || 0,
            framesDecoded: stat.framesDecoded || 0,
            frameRate: stat.framesPerSecond || 0,
            jitter: stat.jitter || 0
          };
        } else {
          results.audio = {
            ...results.audio,
            packetsLost: stat.packetsLost || 0,
            packetsReceived: stat.packetsReceived || 0,
            bytesReceived: stat.bytesReceived || 0,
            jitter: stat.jitter || 0,
            roundTripTime: stat.roundTripTime || 0
          };
        }
      }
    });

    return results;
  }
}