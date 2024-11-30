import React from 'react';
import { WatchTower as WatchTowerComponent } from '@/components/degen/WatchTower';

export function WatchTower() {
  return (
    <div className="min-h-screen bg-white pt-24 px-6">
      <div className="max-w-7xl mx-auto">
        <WatchTowerComponent />
      </div>
    </div>
  );
}