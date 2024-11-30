import React from 'react';

interface StatCardProps {
  number: string;
  label: string;
}

export function StatCard({ number, label }: StatCardProps) {
  return (
    <div>
      <div className="text-3xl font-bold mb-1 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
        {number}
      </div>
      <div className="text-gray-400">{label}</div>
    </div>
  );
}