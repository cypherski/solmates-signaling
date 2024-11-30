import React from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, Swords, Trophy, Star } from 'lucide-react';

const activities = [
  {
    type: 'battle',
    icon: Swords,
    title: 'Won Trading Battle',
    description: 'Victory against CryptoWhale',
    time: '2m ago'
  },
  {
    type: 'achievement',
    icon: Trophy,
    title: 'New Achievement',
    description: 'Diamond Hands: Held through -30%',
    time: '15m ago'
  },
  {
    type: 'social',
    icon: MessageCircle,
    title: 'Signal Shared',
    description: 'SOL breakout analysis',
    time: '1h ago'
  }
];

export function ActivityFeed() {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
        <span className="text-sm text-gray-500">Real-time updates</span>
      </div>
      
      <div className="space-y-4">
        {activities.map((activity, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="p-2 bg-gray-100 rounded-lg">
              <activity.icon className="w-4 h-4 text-gray-600" />
            </div>
            
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-900">{activity.title}</p>
              <p className="text-sm text-gray-400">{activity.description}</p>
              <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}