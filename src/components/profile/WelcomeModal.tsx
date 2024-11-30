import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader } from 'lucide-react';
import { useProfile } from '../../store/useProfile';
import { useNavigate } from 'react-router-dom';

export function WelcomeModal() {
  const navigate = useNavigate();
  const { setDisplayName, error } = useProfile();
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showError, setShowError] = useState(false);

  React.useEffect(() => {
    if (error) {
      setShowError(true);
      const timer = setTimeout(() => {
        setShowError(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      setIsSubmitting(true);
      await setDisplayName(name.trim());
      navigate('/video');
    } catch (err) {
      console.error('Failed to set display name:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-black/80 backdrop-blur-lg rounded-2xl p-8 w-full max-w-md mx-4 border border-purple-500/20"
      >
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold mb-3 bg-gradient-to-r from-purple-400 to-pink-500 text-transparent bg-clip-text">
            Welcome to SolMates!
          </h2>
          <p className="text-gray-300">Enter your display name to join the trading community</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <input
              type="text"
              maxLength={20}
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-black/30 border border-purple-500/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
              placeholder="Enter your display name"
              autoFocus
            />
            <AnimatePresence>
              {error && showError && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="mt-2 text-sm text-red-400"
                  role="alert"
                >
                  {error}
                </motion.p>
              )}
            </AnimatePresence>
            <p className="mt-2 text-sm text-gray-400">
              Display name must be 3-20 characters long
            </p>
          </div>

          <button
            type="submit"
            disabled={!name.trim() || isSubmitting}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg py-3 font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg"
          >
            {isSubmitting ? (
              <>
                <Loader className="w-4 h-4 animate-spin" />
                Setting name...
              </>
            ) : (
              'Start Chatting'
            )}
          </button>
        </form>
      </motion.div>
    </motion.div>
  );
}