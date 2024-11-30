import React from 'react';
import { motion } from 'framer-motion';

interface StatItemProps {
  value: string;
  label: string;
  delay: number;
}

function StatItem({ value, label, delay }: StatItemProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="text-center"
    >
      <div className="text-4xl font-bold mb-2 bg-gradient-to-r from-purple-400 to-pink-500 text-transparent bg-clip-text">
        {value}
      </div>
      <div className="text-gray-400">{label}</div>
    </motion.div>
  );
}

export function Stats() {
  return (
    <div className="bg-black/50 backdrop-blur-lg py-16">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <StatItem value="10K+" label="Active Users" delay={0} />
          <StatItem value="$2M+" label="Total Value Locked" delay={0.1} />
          <StatItem value="50K" label="Daily Messages" delay={0.2} />
          <StatItem value="1000+" label="Alpha Calls" delay={0.3} />
        </div>
      </div>
    </div>
  );
}