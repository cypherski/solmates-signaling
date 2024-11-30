import React from 'react';
import { motion } from 'framer-motion';
import { Wallet } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

export function WalletGuard() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn(
          "text-center p-8 bg-black/30 backdrop-blur-lg",
          "rounded-xl border border-white/10"
        )}
      >
        <Wallet className="w-16 h-16 text-purple-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-4">Wallet Required</h2>
        <p className="text-gray-400 mb-6">
          Please connect your wallet to access video chat
        </p>
        <button
          onClick={() => navigate('/')}
          className={cn(
            "px-6 py-3 rounded-lg",
            "bg-purple-600 hover:bg-purple-700",
            "text-white font-medium",
            "transition-colors"
          )}
        >
          Connect Wallet
        </button>
      </motion.div>
    </div>
  );
}