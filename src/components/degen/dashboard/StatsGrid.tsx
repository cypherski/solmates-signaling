import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Trophy, Users, Star } from 'lucide-react';

const stats = [
  { 
    icon: TrendingUp,
    label: 'Trading Volume',
    value: '$123.4K',
    change: '+12.3%',
    isPositive: true
  },
  {
    icon: Trophy,
    label: 'Win Rate',
    value: '68%',
    change: '+5.2%',
    isPositive: true
  },
  {
    icon: Users,
    label: 'Community Rank',
    value: '#42',
    change: '-3',
    isPositive: false
  },
  {
    icon: Star,
    label: 'Battle Score',
    value: '1,234',
    change: '+89',
    isPositive: true
  }
];

export function StatsGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-gray-600">{stat.label}</span>
            <stat.icon className="w-5 h-5 text-gray-400" />
          </div>
          
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-bold text-gray-900">{stat.value}</span>
            <span className={`text-sm ${stat.isPositive ? 'text-green-400' : 'text-red-400'}`}>
              {stat.change}
            </span>
          </div>
        </motion.div>
      ))}
    </div>
  );
}