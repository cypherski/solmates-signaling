import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Copy, Check, ExternalLink } from 'lucide-react';
import { useWallet } from '@solana/wallet-adapter-react';
import { Button } from "@/components/ui/button";
import { formatAddress } from '../../utils/wallet';
import { cn } from "@/lib/utils";

interface ProfileDisplayProps {
  className?: string;
}

export function ProfileDisplay({ className = '' }: ProfileDisplayProps) {
  const { publicKey, connected } = useWallet();
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  const handleCopy = useCallback(async () => {
    if (!publicKey) return;
    
    try {
      await navigator.clipboard.writeText(publicKey.toString());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy address:', error);
    }
  }, [publicKey]);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.profile-popup')) {
        setIsOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  if (!connected || !publicKey) {
    return null;
  }

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(true)}
        className={cn(
          "flex items-center gap-2 px-4 py-2 rounded-lg",
          "bg-white/50 hover:bg-white/80",
          "border border-gray-200/50 shadow-sm",
          "text-sm font-medium text-gray-600",
          "transition-all"
        )}
      >
        <User className="w-4 h-4" />
        <span>View Wallet</span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="profile-popup absolute right-0 top-full mt-2 w-72 bg-white/95 backdrop-blur-lg rounded-xl border border-gray-200/50 shadow-lg p-4 z-50"
            role="dialog"
            aria-label="Profile information"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Your Wallet</h3>
                <p className="text-sm text-gray-500">{formatAddress(publicKey.toString())}</p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between bg-gray-100 rounded-lg p-2">
                <span className="text-sm text-gray-600">
                  {formatAddress(publicKey.toString())}
                </span>
                <button
                  onClick={handleCopy}
                  className="p-1.5 hover:bg-gray-200 rounded-lg transition-colors"
                  aria-label={copied ? "Copied!" : "Copy wallet address"}
                >
                  {copied ? (
                    <Check className="w-4 h-4 text-green-400" />
                  ) : (
                    <Copy className="w-4 h-4 text-gray-500" />
                  )}
                </button>
              </div>

              <a
                href={`https://solscan.io/account/${publicKey.toString()}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 text-sm text-purple-600 hover:text-purple-700 transition-colors"
              >
                View on Solscan
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}