import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Wallet, Shield, AlertCircle, Loader } from 'lucide-react';
import { useWalletGeneration } from '../../hooks/useWalletGeneration';
import { useProfile } from '../../store/useProfile';

export function WalletSetup() {
  const { generateWallet, isGenerating, error } = useWalletGeneration();
  const { userId } = useProfile();
  const [showSuccess, setShowSuccess] = useState(false);

  const handleGenerateWallet = async () => {
    try {
      if (!userId) return;
      await generateWallet(userId);
      setShowSuccess(true);
    } catch (error) {
      console.error('Wallet generation failed:', error);
    }
  };

  return (
    <div className="bg-black/30 backdrop-blur-lg rounded-xl border border-white/10 p-6">
      <div className="flex items-center gap-3 mb-6">
        <Wallet className="w-6 h-6 text-purple-400" />
        <h2 className="text-xl font-bold">Wallet Setup</h2>
      </div>

      {error ? (
        <div className="flex items-center gap-2 text-red-400 mb-4">
          <AlertCircle className="w-5 h-5" />
          <p>{error}</p>
        </div>
      ) : null}

      {showSuccess ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
            <Shield className="w-6 h-6 text-green-400" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Wallet Generated Successfully!</h3>
          <p className="text-gray-400">Your wallet is now ready to use.</p>
        </motion.div>
      ) : (
        <div>
          <p className="text-gray-400 mb-6">
            Generate a secure wallet to start using the platform's features.
          </p>
          <button
            onClick={handleGenerateWallet}
            disabled={isGenerating}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white rounded-lg py-3 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isGenerating ? (
              <>
                <Loader className="w-5 h-5 animate-spin" />
                Generating Wallet...
              </>
            ) : (
              <>
                <Wallet className="w-5 h-5" />
                Generate Wallet
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}