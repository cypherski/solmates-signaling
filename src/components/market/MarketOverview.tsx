import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Activity, DollarSign } from 'lucide-react';

interface MarketAsset {
  name: string;
  symbol: string;
  price: number;
  change24h: number;
  volume: number;
  chart: number[];
}

interface MarketOverviewProps {
  assets: MarketAsset[];
}

export function MarketOverview({ assets }: MarketOverviewProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-black/30 backdrop-blur-lg rounded-xl border border-white/10 p-6"
    >
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold">Market Overview</h3>
        <button className="text-sm text-purple-400 hover:text-purple-300">View All</button>
      </div>

      <div className="space-y-4">
        {assets.map((asset, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-4 bg-black/20 rounded-lg hover:bg-black/30 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                <DollarSign className="w-4 h-4" />
              </div>
              
              <div>
                <h4 className="font-semibold">{asset.name}</h4>
                <span className="text-sm text-gray-400">{asset.symbol}</span>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="text-right">
                <p className="font-semibold">${asset.price.toLocaleString()}</p>
                <div className="flex items-center gap-1 text-sm">
                  {asset.change24h >= 0 ? (
                    <TrendingUp className="w-4 h-4 text-green-400" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-red-400" />
                  )}
                  <span className={asset.change24h >= 0 ? 'text-green-400' : 'text-red-400'}>
                    {Math.abs(asset.change24h)}%
                  </span>
                </div>
              </div>

              <div className="w-24 h-12">
                {/* Mini chart visualization would go here */}
                <div className="w-full h-full bg-black/10 rounded flex items-end">
                  {asset.chart.map((value, i) => (
                    <div
                      key={i}
                      className="w-1 mx-px bg-purple-400"
                      style={{ height: `${value}%` }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}