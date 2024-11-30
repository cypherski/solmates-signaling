import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Zap, Users } from 'lucide-react';

const menuItems = [
  { icon: Zap, label: 'Quick Match', path: '/quick-match' },
  { icon: Users, label: 'Trading Tribes', path: '/tribes' }
];

export function Sidebar() {
  const location = useLocation();
  
  if (location.pathname === '/' || location.pathname === '/video') {
    return null;
  }

  return (
    <aside className="w-64 min-h-screen bg-black/20 backdrop-blur-lg border-r border-white/10 pt-20 px-4">
      <nav className="space-y-2">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-white/70 hover:text-white hover:bg-white/5 transition-colors ${
              location.pathname === item.path ? 'bg-white/10 text-white' : ''
            }`}
          >
            <item.icon className="w-5 h-5" />
            <span>{item.label}</span>
          </Link>
        ))}
        <div className="px-4 py-3 text-sm text-gray-400">+ More Soon</div>
      </nav>
    </aside>
  );
}