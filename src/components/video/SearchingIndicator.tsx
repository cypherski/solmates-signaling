import React from 'react';
import { Loader } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface SearchingIndicatorProps {
  onCancel: () => void;
}

export function SearchingIndicator({ onCancel }: SearchingIndicatorProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50"
    >
      <div className={cn(
        "flex items-center gap-3 px-6 py-3",
        "bg-white/95 backdrop-blur-sm rounded-full",
        "border border-purple-200/50 shadow-lg",
        "animate-pulse"
      )}>
        <Loader className="w-5 h-5 animate-spin text-purple-500" />
        <span className="text-sm font-medium bg-gradient-to-r from-purple-600 to-pink-600 text-transparent bg-clip-text">
          Looking for someone to chat with...
        </span>
        <button
          onClick={onCancel}
          className={cn(
            "ml-2 px-3 py-1 rounded-full",
            "bg-white hover:bg-gray-50",
            "text-sm text-purple-600 hover:text-purple-700",
            "transition-all focus:outline-none",
            "border border-purple-200/50"
          )}
        >
          Cancel
        </button>
      </div>
    </motion.div>
  );
}