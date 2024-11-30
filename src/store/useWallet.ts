import { create } from 'zustand';
import { useWallet as useSolanaWallet } from '@solana/wallet-adapter-react';
import { supabase } from '../services/supabase';
import { useWallet as useSolanaWallet } from '@solana/wallet-adapter-react';
import { supabase } from '../services/supabase';

interface WalletState {
  isConnected: boolean;
  isConnecting: boolean;
  publicKey: string | null;
  error: string | null;
  isConnecting: boolean;
  publicKey: string | null;
  error: string | null;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  setError: (error: string | null) => void;
  setError: (error: string | null) => void;
}

export const useWallet = create<WalletState>((set) => {
  const solanaWallet = useSolanaWallet();

  return {
    isConnected: false,
    isConnecting: false,
    publicKey: null,
    error: null,

    connect: async () => {
      try {
        set({ isConnecting: true, error: null });

        if (!solanaWallet.connected) {
          await solanaWallet.connect();
        }

        if (!solanaWallet.publicKey) {
          throw new Error('Wallet connection failed');
        }

        // Sign message for authentication
        const message = `Authenticate with SolMates: ${Date.now()}`;
        const encodedMessage = new TextEncoder().encode(message);
        const signedMessage = await solanaWallet.signMessage(encodedMessage);

        // Authenticate with Supabase
        const { data, error } = await supabase.auth.signInWithWallet({
          publicKey: solanaWallet.publicKey.toString(),
          signature: signedMessage,
          message
        });

        if (error) throw error;

        set({
          isConnected: true,
          publicKey: solanaWallet.publicKey.toString(),
          isConnecting: false
        });
      } catch (error) {
        console.error('Wallet connection error:', error);
        set({
          isConnected: false,
          publicKey: null,
          isConnecting: false,
          error: error instanceof Error ? error.message : 'Failed to connect wallet'
        });
      }
    },

    disconnect: async () => {
      try {
        await solanaWallet.disconnect();
        await supabase.auth.signOut();
        set({
          isConnected: false,
          publicKey: null,
          error: null
        });
      } catch (error) {
        console.error('Wallet disconnect error:', error);
        set({
          error: error instanceof Error ? error.message : 'Failed to disconnect wallet'
        });
      }
    },

    setError: (error: string | null) => set({ error })
  };
});