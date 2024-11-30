import { useState, useCallback } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useProfile } from '../../store/useProfile';
import { WalletService } from '../../services/wallet';

export function useWalletConnection() {
  const { connected, connecting, publicKey, signMessage } = useWallet();
  const { setWalletAddress, setUserId } = useProfile();
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const connect = useCallback(async () => {
    if (!publicKey || !signMessage) {
      throw new Error('Wallet not connected');
    }

    try {
      setIsConnecting(true);
      setError(null);

      // Generate and set user ID
      const userId = crypto.randomUUID();
      setUserId(userId);
      setWalletAddress(publicKey.toString());

      // Generate wallet if needed
      await WalletService.generateWallet(userId);

      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to connect wallet';
      setError(errorMessage);
      throw err;
    } finally {
      setIsConnecting(false);
    }
  }, [publicKey, signMessage, setWalletAddress, setUserId]);

  return {
    connect,
    error,
    isConnected: connected,
    isConnecting: isConnecting || connecting,
    publicKey: publicKey?.toString()
  };
}