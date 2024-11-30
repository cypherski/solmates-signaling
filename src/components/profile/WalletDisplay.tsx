import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Copy, Check, ExternalLink } from 'lucide-react';
import { useProfile } from '../../store/useProfile';

export function WalletDisplay() {
  const { walletAddress } = useProfile();
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    if (!walletAddress) return;
    
    try {
      await navigator.clipboard.writeText(walletAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy address:', error);
    }
  }, [walletAddress]);

  if (!walletAddress) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-black/30 backdrop-blur-lg rounded-xl border border-white/10 p-4"
    >
      <h3 className="text-lg font-semibold mb-4">Your Wallet</h3>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between bg-black/20 rounded-lg p-3">
          <span className="text-sm font-mono">{walletAddress}</span>
          <button
            onClick={handleCopy}
            className="p-2 hover:bg-white/5 rounded-lg transition-colors"
            aria-label={copied ? "Copied!" : "Copy wallet address"}
          >
            {copied ? (
              <Check className="w-4 h-4 text-green-400" />
            ) : (
              <Copy className="w-4 h-4 text-gray-400" />
            )}
          </button>
        </div>

        <a
          href={`https://solscan.io/account/${walletAddress}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 text-sm text-purple-400 hover:text-purple-300 transition-colors p-2 rounded-lg hover:bg-white/5"
        >
          View on Solscan
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>
    </motion.div>
  );
}