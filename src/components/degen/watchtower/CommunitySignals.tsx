import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Pause, Users } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CommunitySignal {
  type: 'buy' | 'sell' | 'hold';
  strength: number;
  count: number;
}

interface CommunitySignalsProps {
  signals: CommunitySignal[];
}

export function CommunitySignals({ signals }: CommunitySignalsProps) {
  const getSignalIcon = (type: CommunitySignal['type']) => {
    switch (type) {
      case 'buy':
        return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'sell':
        return <TrendingDown className="w-4 h-4 text-red-500" />;
      case 'hold':
        return <Pause className="w-4 h-4 text-yellow-500" />;
    }
  };

  const getSignalColor = (type: CommunitySignal['type']) => {
    switch (type) {
      case 'buy':
        return 'text-green-500 bg-green-500';
      case 'sell':
        return 'text-red-500 bg-red-500';
      case 'hold':
        return 'text-yellow-500 bg-yellow-500';
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
      {signals.map((signal, index) => (
        <motion.div
          key={signal.type}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-white rounded-lg p-4 border border-gray-200/50 shadow-sm"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 font-medium">
              {getSignalIcon(signal.type)}
              <span className={cn(
                "capitalize",
                getSignalColor(signal.type).split(' ')[0]
              )}>
                {signal.type}
              </span>
            </div>
            <div className="flex items-center gap-1 text-sm">
              <Users className="w-4 h-4 text-gray-400" />
              <span>{signal.count}</span>
            </div>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${signal.strength}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className={cn(
                "h-full rounded-full",
                getSignalColor(signal.type).split(' ')[1]
              )}
            />
          </div>
        </motion.div>
      ))}
    </div>
  );
}