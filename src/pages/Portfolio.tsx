import React from 'react';
import { motion } from 'framer-motion';
import { Briefcase, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';

export function Portfolio() {
  const mockAssets = [
    { name: 'Solana', symbol: 'SOL', balance: 12.5, value: 1250, change: 5.2 },
    { name: 'Bonk', symbol: 'BONK', balance: 1000000, value: 500, change: -2.1 },
    { name: 'Jupiter', symbol: 'JUP', balance: 100, value: 300, change: 8.4 }
  ];

  return (
    <div className="pt-20 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold mb-8"
        >
          Portfolio
        </motion.h1>

        <div className="grid gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-black/30 backdrop-blur-lg rounded-xl border border-white/10 p-6"
          >
            <h2 className="text-xl font-bold mb-6">Your Assets</h2>
            <div className="space-y-4">
              {mockAssets.map((asset, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-black/20 rounded-lg"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                      <DollarSign className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{asset.name}</h3>
                      <p className="text-sm text-gray-400">{asset.balance} {asset.symbol}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">${asset.value}</p>
                    <div className="flex items-center gap-1 justify-end">
                      {asset.change >= 0 ? (
                        <TrendingUp className="w-4 h-4 text-green-400" />
                      ) : (
                        <TrendingDown className="w-4 h-4 text-red-400" />
                      )}
                      <span className={asset.change >= 0 ? 'text-green-400' : 'text-red-400'}>
                        {Math.abs(asset.change)}%
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}