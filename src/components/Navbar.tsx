import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Bell, Settings, Wallet } from 'lucide-react';
import { useWallet } from '../store/useWallet';
import { useProfile } from '../store/useProfile';
import { ProfileModal } from './profile/ProfileModal';
import { NotificationPopup } from './notifications/NotificationPopup';

export function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isConnected, connect, disconnect } = useWallet();
  const { username, setProfileModalOpen } = useProfile();
  const [showNotifications, setShowNotifications] = React.useState(false);

  const handleWalletAction = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      if (isConnected) {
        await disconnect();
        if (location.pathname === '/video') {
          navigate('/');
        }
      } else {
        await connect();
      }
    } catch (error) {
      console.error('Wallet action failed:', error);
    }
  };

  return (
    <nav className="fixed w-full z-50 bg-black/20 backdrop-blur-lg border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <svg className="w-8 h-8" viewBox="0 0 512 512">
            <defs>
              <radialGradient id="circleGradient" cx="30%" cy="30%" r="70%">
                <stop offset="0%" stopColor="#B44DFF"/>
                <stop offset="100%" stopColor="#FF4DED"/>
              </radialGradient>
            </defs>
            <circle cx="256" cy="256" r="256" fill="url(#circleGradient)"/>
            <path d="M208 154v204l147-102z" 
                  fill="white" 
                  stroke="white" 
                  strokeWidth="8"
                  strokeLinejoin="round"/>
          </svg>
          <span className="font-bold text-xl text-white">SolMates</span>
        </Link>
        
        <div className="hidden md:flex items-center gap-8">
          <Link to="/" className="text-gray-300 hover:text-white transition-colors">Home</Link>
          <Link to="/faq" className="text-gray-300 hover:text-white transition-colors">FAQ</Link>
        </div>

        <div className="flex items-center gap-4">
          {isConnected && (
            <>
              <div className="relative">
                <button 
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="p-2 rounded-lg text-white/70 hover:text-white hover:bg-white/5 transition-colors"
                >
                  <Bell className="w-5 h-5" />
                </button>
                <NotificationPopup 
                  isOpen={showNotifications} 
                  onClose={() => setShowNotifications(false)} 
                />
              </div>
              <button 
                onClick={() => navigate('/profile')}
                className="p-2 rounded-lg text-white/70 hover:text-white hover:bg-white/5 transition-colors"
              >
                <Settings className="w-5 h-5" />
              </button>
            </>
          )}

          <button 
            onClick={handleWalletAction}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-full flex items-center gap-2 transition-colors"
          >
            <Wallet className="w-4 h-4" />
            <span>{isConnected ? username || 'Set Username' : 'Connect'}</span>
          </button>
        </div>
      </div>

      <ProfileModal />
    </nav>
  );
}