import React from 'react';
import { motion } from 'framer-motion';
import { Swords, Bell, Users, Share2 } from 'lucide-react';

const actions = [
  {
    icon: Swords,
    label: 'Join Battle',
    description: '3 battles available'
  },
  {
    icon: Bell,
    label: 'Set Alerts',
    description: 'Price & volume triggers'
  },
  {
    icon: Users,
    label: 'Create Team',
    description: 'Find trading partners'
  },
  {
    icon: Share2,
    label: 'Share Analysis',
    description: 'Contribute to community'
  }
];

export function QuickActions() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {actions.map((action, index) => (
        <motion.button
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-white rounded-xl border border-gray-200 p-6 text-left hover:shadow-md transition-all"
        >
          <div className="p-2 bg-gray-100 rounded-lg w-fit mb-4">
            <action.icon className="w-5 h-5 text-gray-600" />
          </div>
          
          <h3 className="font-medium text-gray-900 mb-1">{action.label}</h3>
          <p className="text-sm text-gray-400">{action.description}</p>
        </motion.button>
      ))}
    </div>
  );
}