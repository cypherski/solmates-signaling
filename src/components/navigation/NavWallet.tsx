import React from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { ProfileDisplay } from '../profile/ProfileDisplay';
import { cn } from "@/lib/utils";

export function NavWallet() {
  const { connected } = useWallet();

  return (
    <div className="flex items-center">
      {connected ? (
        <ProfileDisplay />
      ) : (
        <WalletMultiButton className={cn(
          "!bg-gray-900 hover:!bg-gray-800",
          "!rounded-lg !px-5 !h-10",
          "!text-white !text-sm !font-medium",
          "!transition-colors !duration-200",
          "!border-0"
        )} />
      )}
    </div>
  );
}