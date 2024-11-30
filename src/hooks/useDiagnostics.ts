import { useState, useEffect, useCallback } from 'react';
import { MediaAnalyzer } from '../utils/diagnostics/mediaAnalyzer';
import { ConnectionAnalyzer } from '../utils/diagnostics/connectionAnalyzer';
import { MediaQualityMetrics, StreamStats, ConnectionMetrics, IceStats } from '../types/diagnostics';

interface DiagnosticsState {
  videoMetrics: MediaQualityMetrics | null;
  audioMetrics: MediaQualityMetrics | null;
  streamStats: StreamStats | null;
  connectionMetrics: ConnectionMetrics | null;
  iceStats: IceStats | null;
}

export function useDiagnostics(
  localStream: MediaStream | null,
  peerConnection: RTCPeerConnection | null,
  enabled: boolean = true
) {
  const [diagnostics, setDiagnostics] = useState<DiagnosticsState>({
    videoMetrics: null,
    audioMetrics: null,
    streamStats: null,
    connectionMetrics: null,
    iceStats: null
  });

  const analyzeSources = useCallback(async () => {
    if (!localStream) return;

    const [videoMetrics, audioMetrics] = await Promise.all([
      MediaAnalyzer.analyzeVideoStream(localStream),
      MediaAnalyzer.analyzeAudioStream(localStream)
    ]);

    setDiagnostics(prev => ({
      ...prev,
      videoMetrics,
      audioMetrics
    }));
  }, [localStream]);

  const analyzeConnection = useCallback(async () => {
    if (!peerConnection) return;

    const [streamStats, connectionMetrics, iceStats] = await Promise.all([
      MediaAnalyzer.getStreamStats(peerConnection),
      ConnectionAnalyzer.analyzeConnection(peerConnection),
      ConnectionAnalyzer.getIceStats(peerConnection)
    ]);

    setDiagnostics(prev => ({
      ...prev,
      streamStats,
      connectionMetrics,
      iceStats
    }));
  }, [peerConnection]);

  useEffect(() => {
    if (!enabled) return;

    const interval = setInterval(() => {
      analyzeSources();
      analyzeConnection();
    }, 2000);

    return () => clearInterval(interval);
  }, [enabled, analyzeSources, analyzeConnection]);

  const getConnectionQuality = useCallback(() => {
    if (!diagnostics.connectionMetrics) return null;
    return ConnectionAnalyzer.getConnectionStatus(diagnostics.connectionMetrics);
  }, [diagnostics.connectionMetrics]);

  const validateMediaQuality = useCallback(() => {
    if (!diagnostics.videoMetrics || !diagnostics.audioMetrics) return false;
    return (
      MediaAnalyzer.validateStreamQuality(diagnostics.videoMetrics) &&
      MediaAnalyzer.validateStreamQuality(diagnostics.audioMetrics)
    );
  }, [diagnostics.videoMetrics, diagnostics.audioMetrics]);

  return {
    ...diagnostics,
    getConnectionQuality,
    validateMediaQuality,
    analyze: {
      sources: analyzeSources,
      connection: analyzeConnection
    }
  };
}