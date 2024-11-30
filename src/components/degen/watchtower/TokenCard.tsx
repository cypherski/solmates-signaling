import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface TokenCardProps {
  name: string;
  price: number;
  change: number;
  volume: string;
  lastUpdate: Date;
  onClick?: () => void;
}

export function TokenCard({ name, price, change, volume, lastUpdate, onClick }: TokenCardProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="group flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200/50 hover:border-purple-200 transition-all cursor-pointer shadow-sm"
    >
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center">
          <span className="font-bold text-purple-500">{name[0]}</span>
        </div>
        <div>
          <h3 className="font-semibold text-gray-900">{name}</h3>
          <p className="text-sm text-gray-500">
            Vol: {volume} • {new Date(lastUpdate).toLocaleTimeString()}
          </p>
        </div>
      </div>
      <div className="text-right">
        <motion.p
          key={price}
          initial={{ scale: 1.2, color: change >= 0 ? '#4ADE80' : '#F87171' }}
          animate={{ scale: 1, color: '#111827' }}
          className="font-semibold"
        >
          ${price.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 8
          })}
        </motion.p>
        <div className="flex items-center gap-1 justify-end">
          {change >= 0 ? (
            <TrendingUp className="w-4 h-4 text-green-500" />
          ) : (
            <TrendingDown className="w-4 h-4 text-red-500" />
          )}
          <span className={change >= 0 ? 'text-green-500' : 'text-red-500'}>
            {Math.abs(change)}%
          </span>
        </div>
      </div>
    </motion.div>
  );
}