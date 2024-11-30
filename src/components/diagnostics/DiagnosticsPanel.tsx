import React from 'react';
import { motion } from 'framer-motion';
import { 
  Activity, Signal, Video, Mic, 
  WifiOff, CheckCircle, XCircle, AlertTriangle 
} from 'lucide-react';
import { useDiagnostics } from '../../hooks/useDiagnostics';

interface DiagnosticsPanelProps {
  localStream: MediaStream | null;
  peerConnection: RTCPeerConnection | null;
  isVisible?: boolean;
}

export function DiagnosticsPanel({ 
  localStream, 
  peerConnection, 
  isVisible = true 
}: DiagnosticsPanelProps) {
  const diagnostics = useDiagnostics(localStream, peerConnection);
  const connectionQuality = diagnostics.getConnectionQuality();
  const mediaQuality = diagnostics.validateMediaQuality();

  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-black/30 backdrop-blur-lg rounded-xl border border-white/10 p-4"
    >
      <div className="flex items-center gap-2 mb-4">
        <Activity className="w-5 h-5 text-purple-400" />
        <h3 className="font-semibold">Connection Diagnostics</h3>
      </div>

      <div className="space-y-4">
        {/* Connection Quality */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Signal className="w-4 h-4 text-gray-400" />
            <span>Connection Quality</span>
          </div>
          <div className={`flex items-center gap-1 ${
            connectionQuality === 'excellent' ? 'text-green-400' :
            connectionQuality === 'good' ? 'text-yellow-400' :
            connectionQuality === 'poor' ? 'text-orange-400' :
            'text-red-400'
          }`}>
            {connectionQuality === 'excellent' && <CheckCircle className="w-4 h-4" />}
            {connectionQuality === 'good' && <CheckCircle className="w-4 h-4" />}
            {connectionQuality === 'poor' && <AlertTriangle className="w-4 h-4" />}
            {connectionQuality === 'failed' && <XCircle className="w-4 h-4" />}
            <span className="capitalize">{connectionQuality || 'Unknown'}</span>
          </div>
        </div>

        {/* Video Stats */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Video className="w-4 h-4 text-gray-400" />
            <span>Video Quality</span>
          </div>
          {diagnostics.videoMetrics ? (
            <div className="text-sm">
              {diagnostics.videoMetrics.resolution?.width}x
              {diagnostics.videoMetrics.resolution?.height} @
              {Math.round(diagnostics.videoMetrics.frameRate || 0)}fps
            </div>
          ) : (
            <WifiOff className="w-4 h-4 text-gray-400" />
          )}
        </div>

        {/* Audio Stats */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Mic className="w-4 h-4 text-gray-400" />
            <span>Audio Quality</span>
          </div>
          {diagnostics.audioMetrics ? (
            <div className="text-sm">
              {diagnostics.audioMetrics.sampleRate}Hz
              {diagnostics.audioMetrics.channelCount}ch
            </div>
          ) : (
            <WifiOff className="w-4 h-4 text-gray-400" />
          )}
        </div>

        {/* Network Stats */}
        {diagnostics.connectionMetrics && (
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">Round Trip Time:</span>
              <span>{Math.round(diagnostics.connectionMetrics.roundTripTime)}ms</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Bandwidth:</span>
              <span>{(diagnostics.connectionMetrics.bandwidth / 1000000).toFixed(1)} Mbps</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Packet Loss:</span>
              <span>{diagnostics.connectionMetrics.packetLoss.toFixed(1)}%</span>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}