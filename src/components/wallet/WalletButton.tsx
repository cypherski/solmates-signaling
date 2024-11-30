import React from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { Button } from '@/components/ui/button';
import { WalletDialog } from './WalletDialog';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface WalletButtonProps {
  className?: string;
}

export function WalletButton({ className = '' }: WalletButtonProps) {
  const { connected } = useWallet();
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        className={cn(
          "bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full font-medium hover:from-purple-700 hover:to-pink-700 transform hover:scale-105",
          className
        )}
      >
        {connected ? "Connected" : "Connect Wallet"}
      </Button>
      <WalletDialog open={open} onOpenChange={setOpen} />
    </>
  );
}