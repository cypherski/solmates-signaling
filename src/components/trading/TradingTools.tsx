import React from 'react';
import { motion } from 'framer-motion';
import { LineChart, Share2, Bell, Zap } from 'lucide-react';

export function TradingTools() {
  const tools = [
    { icon: LineChart, label: 'Price Charts', description: 'Real-time market data' },
    { icon: Share2, label: 'Portfolio Sharing', description: 'Share your positions' },
    { icon: Bell, label: 'Signal Creation', description: 'Create trading signals' },
    { icon: Zap, label: 'Quick Swap', description: 'Instant token swaps' }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {tools.map((tool, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-black/30 backdrop-blur-lg rounded-xl border border-white/10 p-6"
        >
          <tool.icon className="w-8 h-8 text-purple-400 mb-4" />
          <h3 className="font-semibold mb-2">{tool.label}</h3>
          <p className="text-sm text-gray-400">{tool.description}</p>
        </motion.div>
      ))}
    </div>
  );
}