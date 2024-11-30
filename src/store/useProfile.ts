import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ProfileState {
  walletAddress: string | null;
  error: string | null;
  setWalletAddress: (address: string) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

export const useProfile = create<ProfileState>()(
  persist(
    (set) => ({
      walletAddress: null,
      error: null,

      setWalletAddress: (walletAddress: string) => {
        set({ walletAddress });
      },

      setError: (error: string | null) => {
        set({ error });
      },

      reset: () => {
        set({
          walletAddress: null,
          error: null
        });
      }
    }),
    {
      name: 'solmates-profile',
    }
  )
);