import React from 'react';
import { motion } from 'framer-motion';
import { LineChart, MessageCircle, Swords, Brain, ChevronRight } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';

const navigationItems = [
  { 
    icon: LineChart, 
    label: 'Watch Tower',
    path: '/degen/watchtower',
    description: 'Real-time market monitoring.',
    badge: 'Beta'
  },
  { 
    icon: MessageCircle, 
    label: 'Degen Feed',
    path: '/degen/feed',
    description: 'Community updates and signals.',
    badge: 'Beta'
  },
  { 
    icon: Swords, 
    label: 'Battle Station',
    path: '/degen/battle',
    description: 'Trading competitions.',
    badge: 'Beta'
  },
  { 
    icon: Brain, 
    label: 'Intel Hub',
    path: '/degen/intel',
    description: 'Analysis and insights.',
    badge: 'Beta'
  }
];

export function DegenSidebar() {
  const location = useLocation();

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className={cn(
        "fixed left-0 top-20 h-[calc(100vh-5rem)] w-72",
        "bg-gradient-to-b from-white to-gray-50",
        "border-r border-gray-200/50 shadow-sm",
        "p-6 overflow-y-auto scrollbar-thin"
      )}
    >
      <div className="space-y-2">
        {navigationItems.map((item, index) => (
          <Link
            key={index}
            to={item.path}
            className={cn(
              "flex items-center justify-between p-4 rounded-lg transition-all",
              "hover:bg-gray-100 group relative",
              location.pathname === item.path 
                ? "bg-gradient-to-r from-purple-50 to-pink-50 text-gray-900" 
                : "text-gray-600"
            )}
          >
            <div className="flex items-center gap-3">
              <div className={cn(
                "w-10 h-10 rounded-lg flex items-center justify-center",
                "bg-white shadow-sm border border-gray-100",
                "group-hover:border-gray-200",
                "transition-colors"
              )}>
                <item.icon className={cn(
                  "w-5 h-5",
                  location.pathname === item.path
                    ? "text-purple-500"
                    : "text-gray-400 group-hover:text-gray-600"
                )} />
              </div>
              <div>
                <p className="font-medium text-sm">{item.label}</p>
                <p className="text-xs text-gray-400">{item.description}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {item.badge && (
                <span className={cn(
                  "text-xs px-2 py-0.5 rounded-full",
                  "bg-purple-100 text-purple-600"
                )}>
                  {item.badge}
                </span>
              )}
              <ChevronRight className={cn(
                "w-4 h-4 opacity-0 -translate-x-2",
                "group-hover:opacity-100 group-hover:translate-x-0",
                "transition-all text-gray-400"
              )} />
            </div>
          </Link>
        ))}
      </div>
    </motion.div>
  );
}