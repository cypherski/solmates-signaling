import React from 'react';
import { motion } from 'framer-motion';
import { Users, Wallet, TrendingUp, Lock } from 'lucide-react';

export function TradingTribes() {
  const tribes = [
    {
      name: 'Alpha Hunters',
      members: 76,
      maxMembers: 100,
      treasury: 1250,
      performance: 15.4,
      description: 'Elite traders focused on alpha generation',
      comingSoon: true
    },
    {
      name: 'DeFi Explorers',
      members: 45,
      maxMembers: 50,
      treasury: 850,
      performance: 8.2,
      description: 'Deep dive into DeFi protocols and yield strategies',
      comingSoon: true
    },
    {
      name: 'NFT Collective',
      members: 120,
      maxMembers: 150,
      treasury: 2000,
      performance: 22.1,
      description: 'NFT trading signals and market analysis',
      comingSoon: true
    }
  ];

  return (
    <div className="pt-20 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <h1 className="text-3xl font-bold">Trading Tribes</h1>
          <div className="bg-purple-600/20 text-purple-400 px-4 py-2 rounded-full text-sm">
            Coming Soon
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tribes.map((tribe, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group bg-black/30 backdrop-blur-lg rounded-xl border border-white/10 p-6 relative overflow-hidden"
            >
              {tribe.comingSoon && (
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
                  <div className="text-center">
                    <Lock className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                    <p className="text-lg font-semibold">Coming Soon</p>
                  </div>
                </div>
              )}

              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold">{tribe.name}</h3>
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-green-400" />
                  <span className="text-green-400">+{tribe.performance}%</span>
                </div>
              </div>

              <p className="text-gray-400 mb-4">{tribe.description}</p>

              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-400">
                    {tribe.members}/{tribe.maxMembers}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Wallet className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-400">
                    {tribe.treasury} SOL
                  </span>
                </div>
              </div>

              <button 
                disabled={tribe.comingSoon}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white rounded-lg py-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Join Tribe
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}