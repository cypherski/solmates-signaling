import React from 'react';
import { motion } from 'framer-motion';
import { 
  Video, Shield, Zap, Users, 
  BarChart2, Brain, Trophy, MessageCircle, Code 
} from 'lucide-react';
import { cn } from "@/lib/utils";

const features = [
  {
    icon: Video,
    title: "Video Chat",
    description: "Connect with traders in real-time through secure video calls",
    status: "in-progress",
    progress: 75
  },
  {
    icon: MessageCircle,
    title: "Community Chat",
    description: "Engage with fellow traders in topic-focused chat rooms",
    status: "planned",
    progress: 5
  },
  {
    icon: BarChart2,
    title: "Trading Analytics",
    description: "Advanced analytics and performance tracking tools",
    status: "planned",
    progress: 5
  },
  {
    icon: Shield,
    title: "Risk Management",
    description: "Smart position sizing and portfolio protection",
    status: "planned",
    progress: 5
  },
  {
    icon: Users,
    title: "Trading Teams",
    description: "Form alliances and share strategies with fellow traders",
    status: "planned",
    progress: 5
  },
  {
    icon: Brain,
    title: "AI Insights",
    description: "Machine learning powered market analysis",
    status: "planned",
    progress: 5
  },
  {
    icon: Trophy,
    title: "Trading Competitions",
    description: "Compete in trading tournaments for rewards",
    status: "planned",
    progress: 5
  },
  {
    icon: Code,
    title: "Strategy Builder",
    description: "Create and backtest custom trading strategies",
    status: "planned",
    progress: 5
  },
  {
    icon: Zap,
    title: "Auto Trading",
    description: "Automated execution of your trading strategies",
    status: "planned",
    progress: 5
  }
];

export function Features() {
  return (
    <div className="min-h-screen pt-24 px-4 pb-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto"
      >
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-block px-4 py-1.5 mb-6 text-sm bg-white/50 backdrop-blur-sm rounded-lg border border-gray-200/50 text-gray-600 shadow-sm"
          >
            Building the Future 🚀
          </motion.div>
          
          <h1 className={cn(
            "text-4xl md:text-5xl font-bold mb-6",
            "bg-gradient-to-r from-purple-400 via-pink-500 to-red-500",
            "text-transparent bg-clip-text"
          )}>
            Features In Development
          </h1>
          
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Join us on our journey to build the ultimate crypto trading platform. 
            Get early access and shape the future of decentralized trading.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={cn(
                "group relative bg-white/50 backdrop-blur-sm rounded-xl",
                "border border-gray-200/50 p-6 hover:bg-white/60",
                "transition-all duration-300"
              )}
            >
              <div className="mb-4">
                <feature.icon className="w-8 h-8 text-gray-600" />
              </div>
              
              <h3 className="text-xl font-semibold mb-2 text-gray-900">
                {feature.title}
              </h3>
              
              <p className="text-gray-600 mb-4">
                {feature.description}
              </p>

              <div className="mt-auto">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className={cn(
                    "px-2 py-1 rounded-full capitalize",
                    feature.status === "in-progress" && "bg-green-100 text-green-700",
                    feature.status === "planned" && "bg-gray-100 text-gray-700"
                  )}>
                    {feature.status}
                  </span>
                  <span className="text-gray-500">{feature.progress}%</span>
                </div>
                
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={cn(
                      "h-2 rounded-full transition-all duration-500",
                      feature.status === "in-progress" && "bg-green-500",
                      feature.status === "planned" && "bg-gray-500"
                    )}
                    style={{ width: `${feature.progress}%` }}
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}