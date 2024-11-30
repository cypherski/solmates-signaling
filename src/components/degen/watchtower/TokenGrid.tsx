import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TokenCard } from './TokenCard';
import { cn } from '@/lib/utils';
import { TokenData } from '@/types/token';

interface TokenGridProps {
  tokens: TokenData[];
  isLoading: boolean;
  onTokenSelect?: (token: string) => void;
}

export function TokenGrid({ tokens, isLoading, onTokenSelect }: TokenGridProps) {
  return (
    <div className={cn(
      "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4",
      isLoading && "animate-pulse"
    )}>
      <AnimatePresence mode="popLayout">
        {tokens.map((token) => (
          <motion.div
            key={token.name}
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2, delay: 0.1 }}
          >
            <TokenCard
              name={token.name}
              price={token.price}
              change={token.change}
              volume={token.volume}
              lastUpdate={token.lastUpdate}
              onClick={() => onTokenSelect?.(token.name)}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}