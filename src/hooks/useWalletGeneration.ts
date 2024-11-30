import { useState, useCallback } from 'react';
import { WalletService } from '../services/wallet';
import { WalletError } from '../services/wallet/errors';

export function useWalletGeneration() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateWallet = useCallback(async (userId: string) => {
    setIsGenerating(true);
    setError(null);

    try {
      const walletAddress = await WalletService.generateWallet(userId);
      return walletAddress;
    } catch (err) {
      const errorMessage = err instanceof WalletError 
        ? err.message 
        : 'Failed to generate wallet';
      setError(errorMessage);
      throw err;
    } finally {
      setIsGenerating(false);
    }
  }, []);

  return {
    generateWallet,
    isGenerating,
    error,
  };
}