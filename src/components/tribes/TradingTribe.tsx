import React from 'react';
import { motion } from 'framer-motion';
import { Users, Wallet, TrendingUp, Activity } from 'lucide-react';

interface TradingTribeProps {
  name: string;
  members: number;
  maxMembers: number;
  treasury: number;
  performance: number;
  activities: Array<{
    type: string;
    message: string;
    time: string;
  }>;
}

export function TradingTribe({ name, members, maxMembers, treasury, performance, activities }: TradingTribeProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-black/30 backdrop-blur-lg rounded-xl border border-white/10 p-6"
    >
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-xl font-bold mb-2">{name}</h3>
          <div className="flex items-center gap-4 text-sm text-gray-400">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span>{members}/{maxMembers}</span>
            </div>
            <div className="flex items-center gap-2">
              <Wallet className="w-4 h-4" />
              <span>{treasury} SOL</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <TrendingUp className={`w-4 h-4 ${performance >= 0 ? 'text-green-400' : 'text-red-400'}`} />
          <span className={`font-semibold ${performance >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {performance}%
          </span>
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="font-semibold text-sm text-gray-400">Recent Activity</h4>
        {activities.map((activity, index) => (
          <div key={index} className="flex items-center gap-3 text-sm">
            <Activity className="w-4 h-4 text-purple-400 flex-shrink-0" />
            <span className="flex-1">{activity.message}</span>
            <span className="text-gray-500">{activity.time}</span>
          </div>
        ))}
      </div>

      <button className="w-full mt-6 bg-purple-600 hover:bg-purple-700 text-white rounded-lg py-2 transition-colors">
        Join Tribe
      </button>
    </motion.div>
  );
}