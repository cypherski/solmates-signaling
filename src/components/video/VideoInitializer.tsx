import React from 'react';
import { Camera, AlertCircle, Loader } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface VideoInitializerProps {
  error: string | null;
  isInitializing: boolean;
  onRetry: () => void;
  retryAttempt: number;
  maxRetries: number;
  showRetryButton: boolean;
  permissionState: 'prompt' | 'granted' | 'denied' | null;
}

export function VideoInitializer({
  error,
  isInitializing,
  onRetry,
  retryAttempt,
  maxRetries,
  showRetryButton,
  permissionState
}: VideoInitializerProps) {
  if (!error && permissionState !== 'prompt') return null;

  return (
    <AnimatePresence>
      {(error || permissionState === 'prompt') && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/95 flex items-center justify-center z-50"
        >
          <div className="text-center max-w-md mx-auto px-4">
            <div className={cn(
              "p-6 rounded-lg mb-4 backdrop-blur-sm",
              error ? "bg-red-500/20 border border-red-500/20" : "bg-purple-500/20 border border-purple-500/20"
            )}>
              {isInitializing || permissionState === 'prompt' ? (
                <>
                  <Loader className="w-12 h-12 text-purple-400 mx-auto mb-2 animate-spin" />
                  <p className="text-purple-400 font-medium mb-2">
                    {permissionState === 'prompt' ? 'Waiting for camera permission...' : 'Initializing camera...'}
                  </p>
                </>
              ) : (
                <>
                  <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-2" />
                  <p className="text-red-500 font-medium mb-2">{error}</p>
                </>
              )}
              {error && retryAttempt < maxRetries && !showRetryButton && (
                <p className="text-gray-400 text-sm">
                  Retrying... ({retryAttempt + 1}/{maxRetries})
                </p>
              )}
            </div>
            {error && (retryAttempt >= maxRetries || showRetryButton) && (
              <button
                onClick={onRetry}
                className="bg-white/10 hover:bg-white/20 px-6 py-3 rounded-lg transition-colors font-medium backdrop-blur-sm"
              >
                Try Again
              </button>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}