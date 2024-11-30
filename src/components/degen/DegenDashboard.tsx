import React from 'react';
import { motion } from 'framer-motion';
import { BarChart2, Trophy, Users, Zap } from 'lucide-react';
import { StatsGrid } from './dashboard/StatsGrid';
import { ActivityFeed } from './dashboard/ActivityFeed';
import { QuickActions } from './dashboard/QuickActions';

export function DegenDashboard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-[1400px] mx-auto"
    >
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">Product Usage Dashboard</h1>
        <p className="text-gray-500">Use this dashboard to get insights into product-user engagement over time.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 space-y-6">
        <StatsGrid />
        <QuickActions />
        </div>
      
        <div className="lg:col-span-4">
          <ActivityFeed />
        </div>
      </div>
    </motion.div>
  );
}