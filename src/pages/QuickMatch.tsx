import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Users, BarChart2, Globe, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function QuickMatch() {
  const navigate = useNavigate();

  const matchOptions = [
    {
      icon: Zap,
      label: 'Random Match',
      description: 'Connect with anyone instantly',
      action: () => navigate('/video'),
      available: true
    },
    {
      icon: Users,
      label: 'Interest-Based',
      description: 'Find traders with similar interests',
      action: () => {},
      available: false
    },
    {
      icon: BarChart2,
      label: 'Experience Level',
      description: 'Match by trading experience',
      action: () => {},
      available: false
    },
    {
      icon: Globe,
      label: 'Trading Style',
      description: 'Connect by trading approach',
      action: () => {},
      available: false
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
          <h1 className="text-3xl font-bold">Quick Match</h1>
          <div className="bg-purple-600/20 text-purple-400 px-4 py-2 rounded-full text-sm">
            Beta
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {matchOptions.map((option, index) => (
            <motion.button
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={option.action}
              className="bg-black/30 backdrop-blur-lg rounded-xl border border-white/10 p-6 text-left hover:bg-white/5 transition-colors relative overflow-hidden group"
            >
              {!option.available && (
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="text-center">
                    <Lock className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                    <p className="text-lg font-semibold">Coming Soon</p>
                  </div>
                </div>
              )}
              <option.icon className="w-8 h-8 text-purple-400 mb-4" />
              <h3 className="text-lg font-semibold mb-2">{option.label}</h3>
              <p className="text-sm text-gray-400">{option.description}</p>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}