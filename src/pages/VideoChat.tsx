import React from 'react';
import { useVideoChat } from '@/hooks/useVideoChat';
import { VideoLayout } from '@/components/video/VideoLayout';
import { VideoInitializer } from '@/components/video/VideoInitializer';
import { WalletGuard } from '@/components/video/WalletGuard';
import { useWallet } from '@solana/wallet-adapter-react';
import { useNavigate } from 'react-router-dom';

export function VideoChat() {
  const { connected, publicKey } = useWallet();
  const navigate = useNavigate();
  const [retryAttempt, setRetryAttempt] = React.useState(0);
  const maxRetries = 3;

  const {
    localStream,
    remoteStream,
    isAudioEnabled,
    isSearching,
    isInitialized,
    permissionState,
    messages,
    error,
    initializeStream,
    toggleAudio,
    startSearching,
    nextPeer,
    disconnect,
    sendMessage
  } = useVideoChat();

  React.useEffect(() => {
    if (!connected) {
      navigate('/');
      return;
    }

    if (connected && !isInitialized && !error && !isSearching) {
      initializeStream(true).then((success) => {
        if (success && publicKey) {
          startSearching(publicKey.toString());
        }
      }).catch(() => {
        setRetryAttempt(prev => prev + 1);
      });
    }
  }, [connected, navigate, isInitialized, error, isSearching, initializeStream, startSearching, publicKey]);

  const handleRetry = React.useCallback(async () => {
    setRetryAttempt(prev => prev + 1);
    const success = await initializeStream(true);
    if (success && publicKey) {
      await startSearching(publicKey.toString());
    }
  }, [initializeStream, startSearching, publicKey]);

  const handleNext = React.useCallback(() => {
    if (publicKey) {
      startSearching(publicKey.toString());
    }
  }, [startSearching, publicKey]);

  if (!connected) {
    return <WalletGuard />;
  }

  return (
    <div className="min-h-screen bg-white pt-20">
      <VideoInitializer
        error={error}
        isInitializing={!isInitialized && !isSearching}
        onRetry={handleRetry}
        retryAttempt={retryAttempt}
        maxRetries={maxRetries}
        showRetryButton={retryAttempt >= maxRetries}
        permissionState={permissionState}
      />

      <VideoLayout
        localStream={localStream}
        remoteStream={remoteStream}
        isAudioEnabled={isAudioEnabled}
        isSearching={isSearching}
        onToggleAudio={toggleAudio}
        messages={messages}
        onNext={handleNext}
        onSendMessage={sendMessage}
      />
    </div>
  );
}