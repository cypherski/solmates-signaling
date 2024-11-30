import React from 'react';
import { IntelHub as IntelHubComponent } from '@/components/degen/IntelHub';

export function IntelHub() {
  return (
    <div className="min-h-screen bg-white pt-24 px-6">
      <div className="max-w-7xl mx-auto">
        <IntelHubComponent />
      </div>
    </div>
  );
}