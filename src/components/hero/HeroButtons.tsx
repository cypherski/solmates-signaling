import React from 'react';
import { motion } from 'framer-motion';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useNavigate } from 'react-router-dom';
import { useProfile } from '../../store/useProfile';
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface HeroButtonsProps {
  onError: (error: string) => void;
}

export function HeroButtons({ onError }: HeroButtonsProps) {
  const navigate = useNavigate();
  const { connected, connecting, publicKey } = useWallet();
  const { setWalletAddress } = useProfile();

  const handleVideoChat = async () => {
    try {
      if (!connected || !publicKey) {
        onError('Please connect your wallet first');
        return;
      }

      setWalletAddress(publicKey.toString());
      navigate('/video');
    } catch (err) {
      console.error('Failed to start video chat:', err);
      onError(err instanceof Error ? err.message : 'Failed to initialize. Please try again.');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.6 }}
      className="flex flex-col sm:flex-row items-center justify-center gap-6"
    >
      {!connected ? (
        <WalletMultiButton className={cn(
          "!bg-gradient-to-r !from-purple-400 !via-pink-500 !to-red-500",
          "!text-white !px-8 !py-4 !rounded-xl",
          "!font-medium !text-lg",
          "hover:!opacity-90 !transition-all",
          "!w-full sm:!w-auto !shadow-xl"
        )} />
      ) : (
        <>
          <Button
            variant="default"
            size="lg"
            onClick={handleVideoChat}
            disabled={connecting}
            className={cn(
              "bg-gradient-to-r from-purple-400 via-pink-500 to-red-500",
              "text-white px-8 py-4 text-lg",
              "font-medium rounded-xl",
              "hover:opacity-90 transition-all",
              "w-full sm:w-auto shadow-xl"
            )}
          >
            Video Chat
          </Button>
          <Button
            variant="default"
            size="lg"
            onClick={() => navigate('/degen')}
            disabled={connecting}
            className={cn(
              "bg-gradient-to-r from-purple-400 via-pink-500 to-red-500",
              "text-white px-8 py-4 text-lg",
              "font-medium rounded-xl",
              "hover:opacity-90 transition-all",
              "w-full sm:w-auto shadow-xl"
            )}
          >
            Degen Den
          </Button>
        </>
      )}
    </motion.div>
  );
}