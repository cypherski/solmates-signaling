import React from 'react';
import { DegenFeed as DegenFeedComponent } from '@/components/degen/DegenFeed';

export function DegenFeed() {
  return (
    <div className="min-h-screen bg-white pt-24 px-6">
      <div className="max-w-7xl mx-auto">
        <DegenFeedComponent />
      </div>
    </div>
  );
}