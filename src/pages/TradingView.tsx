import React from 'react';
import { motion } from 'framer-motion';
import { BarChart2, TrendingUp, TrendingDown } from 'lucide-react';

export function TradingView() {
  return (
    <div className="pt-20 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold mb-8"
        >
          Trading View
        </motion.h1>

        <div className="bg-black/30 backdrop-blur-lg rounded-xl border border-white/10 p-6">
          <div className="text-center py-12">
            <BarChart2 className="w-16 h-16 text-purple-400 mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">TradingView Integration</h2>
            <p className="text-gray-400">
              Coming soon! Advanced charting and analysis tools.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}