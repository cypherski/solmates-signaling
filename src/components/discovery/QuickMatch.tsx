import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Users, ChartBar, Globe } from 'lucide-react';

const matchOptions = [
  { icon: Zap, label: 'Random Match', description: 'Connect with anyone instantly' },
  { icon: Users, label: 'Interest-Based', description: 'Find traders with similar interests' },
  { icon: ChartBar, label: 'Experience Level', description: 'Match by trading experience' },
  { icon: Globe, label: 'Trading Style', description: 'Connect by trading approach' }
];

export function QuickMatch() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {matchOptions.map((option, index) => (
        <motion.button
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-black/30 backdrop-blur-lg rounded-xl border border-white/10 p-6 text-left hover:bg-white/5 transition-colors"
        >
          <option.icon className="w-8 h-8 text-purple-400 mb-4" />
          <h3 className="text-lg font-semibold mb-2">{option.label}</h3>
          <p className="text-sm text-gray-400">{option.description}</p>
        </motion.button>
      ))}
    </div>
  );
}