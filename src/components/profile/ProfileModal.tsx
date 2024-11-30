import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertCircle, Loader } from 'lucide-react';
import { useProfile } from '../../store/useProfile';
import { useWallet as useSolanaWallet } from '@solana/wallet-adapter-react';

export function ProfileModal() {
  const { publicKey } = useSolanaWallet();
  const { isProfileModalOpen, setProfileModalOpen, username, setUsername, error } = useProfile();
  const [inputValue, setInputValue] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (username) {
      setInputValue(username);
    }
  }, [username]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!publicKey || !inputValue.trim()) return;

    try {
      setIsSubmitting(true);
      await setUsername(inputValue.trim());
      if (!error) {
        setProfileModalOpen(false);
      }
    } catch (err) {
      console.error('Failed to set username:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isValid = inputValue.length >= 3 && inputValue.length <= 20 && /^[a-zA-Z0-9]+$/.test(inputValue);

  if (!isProfileModalOpen || !publicKey) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-gray-900 rounded-2xl p-6 w-full max-w-md mx-4 border border-white/10"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">Set Username</h2>
            <button 
              onClick={() => setProfileModalOpen(false)}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label htmlFor="username" className="block text-sm font-medium text-gray-400 mb-2">
                Username (3-20 characters, alphanumeric only)
              </label>
              <input
                type="text"
                id="username"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Enter your username"
                disabled={isSubmitting}
                autoFocus
              />
              {error && (
                <div className="mt-2 flex items-center gap-2 text-red-400">
                  <AlertCircle className="w-4 h-4" />
                  <p className="text-sm">{error}</p>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setProfileModalOpen(false)}
                className="px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!isValid || isSubmitting}
                className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isSubmitting && <Loader className="w-4 h-4 animate-spin" />}
                Save
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}