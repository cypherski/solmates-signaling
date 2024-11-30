import React from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, UserPlus, BarChart2 } from 'lucide-react';

interface FriendCardProps {
  avatar: string;
  username: string;
  status: string;
  activity: string;
  stats: {
    trades: number;
    winRate: number;
  };
}

export function FriendCard({ avatar, username, status, activity, stats }: FriendCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-black/30 backdrop-blur-lg rounded-xl border border-white/10 p-4"
    >
      <div className="flex items-center gap-4">
        <img
          src={avatar}
          alt={username}
          className="w-12 h-12 rounded-full border-2 border-purple-500"
        />
        <div className="flex-1">
          <h3 className="font-semibold">{username}</h3>
          <div className="flex items-center gap-2 text-sm">
            <span className={`w-2 h-2 rounded-full ${
              status === 'online' ? 'bg-green-500' : 'bg-gray-500'
            }`} />
            <span className="text-gray-400">{activity}</span>
          </div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
        <div className="flex items-center gap-2">
          <BarChart2 className="w-4 h-4 text-purple-400" />
          <span>{stats.trades} trades</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-green-400">{stats.winRate}% win rate</span>
        </div>
      </div>

      <div className="mt-4 flex justify-end gap-2">
        <button className="p-2 rounded-lg hover:bg-white/5">
          <MessageCircle className="w-5 h-5" />
        </button>
        <button className="p-2 rounded-lg hover:bg-white/5">
          <UserPlus className="w-5 h-5" />
        </button>
      </div>
    </motion.div>
  );
}