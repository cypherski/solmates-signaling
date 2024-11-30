import React from 'react';
import { BattleStation as BattleStationComponent } from '@/components/degen/BattleStation';

export function BattleStation() {
  return (
    <div className="min-h-screen bg-white pt-24 px-6">
      <div className="max-w-7xl mx-auto">
        <BattleStationComponent />
      </div>
    </div>
  );
}