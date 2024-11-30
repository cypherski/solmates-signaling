import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Crown, Building, Zap } from 'lucide-react';

const tiers = [
  {
    icon: Shield,
    name: 'Basic',
    price: 'Free',
    features: [
      'Basic matching',
      'Public chat rooms',
      'Limited signals',
      'Basic charts'
    ]
  },
  {
    icon: Zap,
    name: 'Pro Trader',
    price: '100 $MATE/month',
    features: [
      'Advanced matching',
      'Private messages',
      'Premium signals',
      'Trading tools'
    ]
  },
  {
    icon: Crown,
    name: 'Elite Member',
    price: '500 $MATE/month',
    features: [
      'Priority matching',
      'Group creation',
      'Signal creation',
      'Advanced analytics'
    ]
  },
  {
    icon: Building,
    name: 'Institution',
    price: 'Custom',
    features: [
      'White-label solution',
      'API access',
      'Custom features',
      'Dedicated support'
    ]
  }
];

export function PremiumTiers() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {tiers.map((tier, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-black/30 backdrop-blur-lg rounded-xl border border-white/10 p-6"
        >
          <tier.icon className="w-12 h-12 text-purple-400 mb-4" />
          <h3 className="text-xl font-bold mb-2">{tier.name}</h3>
          <p className="text-purple-400 font-semibold mb-6">{tier.price}</p>
          
          <ul className="space-y-3">
            {tier.features.map((feature, featureIndex) => (
              <li key={featureIndex} className="flex items-center gap-2 text-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                {feature}
              </li>
            ))}
          </ul>
          
          <button className="w-full mt-6 bg-purple-600 hover:bg-purple-700 text-white rounded-lg py-2 transition-colors">
            {tier.name === 'Basic' ? 'Current Plan' : 'Upgrade'}
          </button>
        </motion.div>
      ))}
    </div>
  );
}