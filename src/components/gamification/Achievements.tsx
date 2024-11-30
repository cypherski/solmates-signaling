import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Target, Users, Star } from 'lucide-react';

export function Achievements() {
  const achievements = [
    {
      icon: Trophy,
      title: 'Daily Quests',
      progress: 3,
      total: 5,
      rewards: '50 $MATE'
    },
    {
      icon: Target,
      title: 'Weekly Challenges',
      progress: 2,
      total: 7,
      rewards: '200 $MATE'
    },
    {
      icon: Users,
      title: 'Community Goals',
      progress: 15000,
      total: 20000,
      rewards: '1000 $MATE'
    },
    {
      icon: Star,
      title: 'Special Events',
      progress: 1,
      total: 3,
      rewards: '500 $MATE'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {achievements.map((achievement, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-black/30 backdrop-blur-lg rounded-xl border border-white/10 p-6"
        >
          <div className="flex items-center gap-4 mb-4">
            <achievement.icon className="w-8 h-8 text-purple-400" />
            <div>
              <h3 className="font-semibold">{achievement.title}</h3>
              <p className="text-sm text-gray-400">Rewards: {achievement.rewards}</p>
            </div>
          </div>
          
          <div className="w-full bg-black/50 rounded-full h-2 mb-2">
            <div
              className="bg-purple-500 h-2 rounded-full"
              style={{
                width: `${(achievement.progress / achievement.total) * 100}%`
              }}
            />
          </div>
          
          <p className="text-sm text-right text-gray-400">
            {achievement.progress} / {achievement.total}
          </p>
        </motion.div>
      ))}
    </div>
  );
}