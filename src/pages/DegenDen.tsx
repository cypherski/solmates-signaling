import React from 'react';
import { motion } from 'framer-motion';
import { LineChart, MessageCircle, Swords, Brain } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

const sections = [
  {
    icon: LineChart,
    title: "Watch Tower",
    description: "Real-time market monitoring with advanced analytics and price alerts",
    path: "/degen/watchtower",
    gradient: "from-blue-500/20 to-purple-500/20",
    preview: "Live price feeds, market trends, and automated alerts for your favorite tokens"
  },
  {
    icon: MessageCircle,
    title: "Degen Feed",
    description: "Community-driven trading signals and market insights",
    path: "/degen/feed",
    gradient: "from-purple-500/20 to-pink-500/20",
    preview: "Share and discover trading opportunities with fellow traders"
  },
  {
    icon: Swords,
    title: "Battle Station",
    description: "Compete in trading tournaments and earn rewards",
    path: "/degen/battle",
    gradient: "from-pink-500/20 to-red-500/20",
    preview: "Join trading competitions, track your performance, and win prizes"
  },
  {
    icon: Brain,
    title: "Intel Hub",
    description: "Advanced market analysis and research tools",
    path: "/degen/intel",
    gradient: "from-red-500/20 to-orange-500/20",
    preview: "Access professional-grade analysis tools and market research"
  }
];

export function DegenDen() {
  const navigate = useNavigate();

  const handleSectionClick = (path: string) => {
    if (path) {
      navigate(path);
    }
  };

  return (
    <div className="min-h-screen bg-white pt-24 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 text-transparent bg-clip-text tracking-tight">
            Welcome to the Degen Den
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Your command center for advanced trading tools, market analysis, and community engagement
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {sections.map((section, index) => (
            <motion.div
              key={section.path}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => handleSectionClick(section.path)}
            >
              <div
                className={cn(
                  "block h-full p-6 rounded-xl shadow-sm",
                  "bg-gradient-to-br border border-gray-200/50",
                  "hover:border-purple-500/20 hover:shadow-md transition-all",
                  "group relative overflow-hidden",
                  "cursor-pointer",
                  section.gradient
                )}
              >
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-white/80 rounded-lg">
                      <section.icon className="w-6 h-6 text-gray-900" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">{section.title}</h2>
                  </div>
                  
                  <p className="text-gray-600 mb-4">{section.description}</p>
                  
                  <div className="bg-white/80 rounded-lg p-4 backdrop-blur-sm">
                    <p className="text-sm text-gray-500">{section.preview}</p>
                  </div>
                </div>

                <div className="absolute inset-0 bg-gradient-to-t from-gray-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-12 text-center bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-100/50 shadow-sm"
        >
          <p className="text-gray-600">
            Visit our <Link to="/features" className="text-purple-600 hover:text-purple-700 font-medium">Features</Link> section to stay updated on the development progress of SolMates and upcoming platform enhancements.
          </p>
        </motion.div>
      </div>
    </div>
  );
}