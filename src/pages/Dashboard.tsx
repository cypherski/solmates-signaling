import React from 'react';
import { motion } from 'framer-motion';
import { TradingTribe } from '../components/tribes/TradingTribe';
import { ReputationCard } from '../components/reputation/ReputationCard';
import { MarketOverview } from '../components/market/MarketOverview';
import { Award, Zap, Shield, Crown } from 'lucide-react';

export function Dashboard() {
  const mockTribeData = {
    name: "Alpha Hunters",
    members: 76,
    maxMembers: 100,
    treasury: 1250,
    performance: 15.4,
    activities: [
      { type: 'signal', message: 'New signal: SOL long position', time: '2h ago' },
      { type: 'member', message: 'New member joined', time: '4h ago' },
      { type: 'trade', message: 'Group trade executed', time: '6h ago' }
    ]
  };

  const mockReputationData = {
    tradingScore: 850,
    helperPoints: 1240,
    communityRank: "Diamond Trader",
    badges: [
      { name: "Top Signal Provider", icon: Award, color: "text-yellow-400" },
      { name: "Early Adopter", icon: Zap, color: "text-blue-400" },
      { name: "Trusted Member", icon: Shield, color: "text-green-400" },
      { name: "Premium User", icon: Crown, color: "text-purple-400" }
    ]
  };

  const mockMarketData = {
    assets: [
      {
        name: "Solana",
        symbol: "SOL",
        price: 123.45,
        change24h: 5.67,
        volume: 1234567,
        chart: [20, 40, 30, 50, 35, 45, 60, 45, 50, 55]
      },
      {
        name: "Bonk",
        symbol: "BONK",
        price: 0.00001234,
        change24h: -2.34,
        volume: 987654,
        chart: [50, 45, 40, 35, 30, 25, 30, 35, 32, 30]
      }
    ]
  };

  return (
    <div className="pt-20 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <TradingTribe {...mockTribeData} />
          <MarketOverview assets={mockMarketData.assets} />
        </div>
        <div>
          <ReputationCard {...mockReputationData} />
        </div>
      </div>
    </div>
  );
}