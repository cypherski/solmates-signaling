import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LineChart, TrendingUp } from 'lucide-react';
import { TokenGrid } from './watchtower/TokenGrid';
import { AlertBanner } from './watchtower/AlertBanner';
import { AlertList } from './watchtower/AlertList';
import { CommunitySignals } from './watchtower/CommunitySignals';
import { useTokenData } from '@/hooks/useTokenData';
import { cn } from '@/lib/utils';

export function WatchTower() {
  const { assets, alerts, isLoading, error, markAlertAsRead } = useTokenData();
  const [selectedToken, setSelectedToken] = React.useState<string | null>(null);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-7xl mx-auto space-y-6"
    >
      <div className={cn( 
        "bg-white/80 backdrop-blur-lg rounded-xl border border-gray-200/50 p-6 shadow-lg",
        isLoading && "animate-pulse"
      )}>
        <AlertBanner 
          alerts={alerts} 
          onAlertClick={markAlertAsRead}
        />

        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <LineChart className="w-6 h-6 text-purple-500" />
            <h2 className="text-2xl font-bold text-gray-900">Market Overview</h2>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <TrendingUp className="w-4 h-4" />
            <span>Live Updates</span>
          </div>
        </div>

        {error ? (
          <div className="text-center py-8 text-red-400">
            <p>{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-4 text-sm underline hover:text-red-300"
            >
              Retry
            </button>
          </div>
        ) : (
          <TokenGrid
            tokens={assets}
            isLoading={isLoading}
            onTokenSelect={setSelectedToken}
          />
        )}
      </div>

      <div className="bg-white/80 backdrop-blur-lg rounded-xl border border-gray-200/50 p-6 shadow-lg">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Community Signals</h2>
        <CommunitySignals
          signals={[
            { type: 'buy', strength: 75, count: 156 },
            { type: 'sell', strength: 25, count: 42 },
            { type: 'hold', strength: 50, count: 89 }
          ]}
        />
      </div>

      <div className="bg-white/80 backdrop-blur-lg rounded-xl border border-gray-200/50 p-6 shadow-lg">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Alerts</h2>
        <AlertList 
          alerts={alerts}
          onMarkAsRead={markAlertAsRead}
        />
      </div>
    </motion.div>
  );
}