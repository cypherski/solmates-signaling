import { useState, useCallback } from 'react';
import { WalletService } from '../../services/wallet';

export function useWalletGeneration() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateWallet = useCallback(async (userId: string) => {
    if (!userId) {
      setError('User ID is required');
      return null;
    }

    setIsGenerating(true);
    setError(null);

    try {
      const walletAddress = await WalletService.generateWallet(userId);
      return walletAddress;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate wallet';
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