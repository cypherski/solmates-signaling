import React from 'react';
import { MessageCircle, Shield, Users, Rocket, Trophy, Code } from 'lucide-react';
import { motion } from 'framer-motion';

interface FeatureCardProps {
  icon: React.ElementType;
  title: string;
  description: string;
  delay: number;
}

function FeatureCard({ icon: Icon, title, description, delay }: FeatureCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="bg-gradient-to-br from-purple-900/50 to-pink-900/50 backdrop-blur-lg p-6 rounded-xl border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300 hover:transform hover:scale-105"
    >
      <Icon className="w-8 h-8 mb-4 text-purple-400" />
      <h3 className="text-xl font-bold mb-2 text-white">{title}</h3>
      <p className="text-gray-300">{description}</p>
    </motion.div>
  );
}

export function Features() {
  const features = [
    {
      icon: MessageCircle,
      title: "Smart Matching",
      description: "Connect with traders and developers based on your interests and experience level"
    },
    {
      icon: Shield,
      title: "Secure Chat",
      description: "End-to-end encrypted conversations with built-in trading tools and chart sharing"
    },
    {
      icon: Users,
      title: "Community First",
      description: "Join a trusted network of verified crypto enthusiasts and professionals"
    },
    {
      icon: Trophy,
      title: "Earn Rewards",
      description: "Get $MATE tokens for valuable contributions and helpful interactions"
    },
    {
      icon: Code,
      title: "Dev Connect",
      description: "Share code snippets, review smart contracts, and discuss bounties"
    },
    {
      icon: Rocket,
      title: "Alpha Access",
      description: "Join exclusive rooms for trading signals and early opportunities"
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-20">
      <h2 className="text-4xl font-bold text-center mb-12 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
        Core Features
      </h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <FeatureCard
            key={index}
            icon={feature.icon}
            title={feature.title}
            description={feature.description}
            delay={index * 0.1}
          />
        ))}
      </div>
    </div>
  );
}