import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Target, Users, Star, Award } from 'lucide-react';

export function Achievements() {
  const achievements = [
    {
      category: "Daily Quests",
      items: [
        { name: "First Trade", progress: 1, total: 1, reward: "50 $MATE", completed: true },
        { name: "Chat Sessions", progress: 3, total: 5, reward: "100 $MATE", completed: false },
        { name: "Signal Sharing", progress: 0, total: 3, reward: "75 $MATE", completed: false }
      ]
    },
    {
      category: "Weekly Challenges",
      items: [
        { name: "Trading Volume", progress: 1000, total: 5000, reward: "200 $MATE", completed: false },
        { name: "Community Help", progress: 5, total: 10, reward: "150 $MATE", completed: false },
        { name: "Successful Trades", progress: 3, total: 5, reward: "250 $MATE", completed: false }
      ]
    },
    {
      category: "Special Events",
      items: [
        { name: "Trading Competition", progress: 0, total: 1, reward: "1000 $MATE", completed: false },
        { name: "Community Event", progress: 1, total: 1, reward: "500 $MATE", completed: true },
        { name: "Alpha Provider", progress: 2, total: 5, reward: "300 $MATE", completed: false }
      ]
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
          <h1 className="text-3xl font-bold">Achievements</h1>
          <div className="flex items-center gap-2 bg-black/30 backdrop-blur-lg rounded-xl px-4 py-2">
            <Trophy className="w-5 h-5 text-yellow-400" />
            <span className="text-lg font-semibold">1,250 $MATE earned</span>
          </div>
        </motion.div>

        <div className="space-y-8">
          {achievements.map((category, categoryIndex) => (
            <motion.div
              key={categoryIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: categoryIndex * 0.1 }}
              className="bg-black/30 backdrop-blur-lg rounded-xl border border-white/10 p-6"
            >
              <h2 className="text-xl font-bold mb-6">{category.category}</h2>
              <div className="space-y-4">
                {category.items.map((item, itemIndex) => (
                  <div
                    key={itemIndex}
                    className="bg-black/20 rounded-lg p-4"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <Award className={`w-5 h-5 ${item.completed ? 'text-yellow-400' : 'text-gray-400'}`} />
                        <h3 className="font-semibold">{item.name}</h3>
                      </div>
                      <span className="text-purple-400">{item.reward}</span>
                    </div>
                    <div className="relative pt-1">
                      <div className="flex mb-2 items-center justify-between">
                        <div>
                          <span className="text-xs font-semibold inline-block text-purple-400">
                            {Math.round((item.progress / item.total) * 100)}%
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="text-xs font-semibold inline-block text-purple-400">
                            {item.progress}/{item.total}
                          </span>
                        </div>
                      </div>
                      <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-purple-200/20">
                        <div
                          style={{ width: `${(item.progress / item.total) * 100}%` }}
                          className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-purple-500"
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}