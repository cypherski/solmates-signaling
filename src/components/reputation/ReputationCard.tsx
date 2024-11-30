import React from 'react';
import { motion } from 'framer-motion';
import { Award, TrendingUp, Heart, Star } from 'lucide-react';

interface ReputationCardProps {
  tradingScore: number;
  helperPoints: number;
  communityRank: string;
  badges: Array<{
    name: string;
    icon: typeof Award;
    color: string;
  }>;
}

export function ReputationCard({ tradingScore, helperPoints, communityRank, badges }: ReputationCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-black/30 backdrop-blur-lg rounded-xl border border-white/10 p-6"
    >
      <h3 className="text-xl font-bold mb-6">Reputation Stats</h3>
      
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="p-4 bg-black/20 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5 text-green-400" />
            <span className="text-sm text-gray-400">Trading Score</span>
          </div>
          <p className="text-2xl font-bold">{tradingScore}</p>
        </div>
        
        <div className="p-4 bg-black/20 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Heart className="w-5 h-5 text-red-400" />
            <span className="text-sm text-gray-400">Helper Points</span>
          </div>
          <p className="text-2xl font-bold">{helperPoints}</p>
        </div>
      </div>

      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <Star className="w-5 h-5 text-yellow-400" />
          <span className="text-sm text-gray-400">Community Rank</span>
        </div>
        <p className="text-xl font-bold">{communityRank}</p>
      </div>

      <div>
        <h4 className="text-sm text-gray-400 mb-3">Badges Earned</h4>
        <div className="flex flex-wrap gap-2">
          {badges.map((badge, index) => (
            <div
              key={index}
              className="flex items-center gap-2 px-3 py-1.5 bg-black/20 rounded-full"
            >
              <badge.icon className={`w-4 h-4 ${badge.color}`} />
              <span className="text-sm">{badge.name}</span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}