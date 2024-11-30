import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Settings, MessageCircle, Video, UserPlus } from 'lucide-react';
import { useProfile } from '../store/useProfile';
import { useWallet } from '../store/useWallet';
import { useNavigate } from 'react-router-dom';

export function Profile() {
  const navigate = useNavigate();
  const { isConnected } = useWallet();
  const { username, setUsername } = useProfile();
  const [isNameModalOpen, setIsNameModalOpen] = useState(!username);

  // Mock data for demonstration
  const mockFriends = [
    { id: '1', name: 'Alex', status: 'online', lastActive: 'Now' },
    { id: '2', name: 'Sarah', status: 'offline', lastActive: '2h ago' },
    { id: '3', name: 'Mike', status: 'online', lastActive: 'Now' }
  ];

  React.useEffect(() => {
    if (!isConnected) {
      navigate('/');
    }
  }, [isConnected, navigate]);

  return (
    <div className="pt-20 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-black/30 backdrop-blur-lg rounded-xl border border-white/10 p-6 mb-6"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                <User className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">{username || 'Set Username'}</h1>
                <button
                  onClick={() => setIsNameModalOpen(true)}
                  className="text-sm text-purple-400 hover:text-purple-300"
                >
                  {username ? 'Change Username' : 'Set Username'}
                </button>
              </div>
            </div>
            <button className="p-2 rounded-lg hover:bg-white/5">
              <Settings className="w-6 h-6" />
            </button>
          </div>
        </motion.div>

        {/* Friends Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-black/30 backdrop-blur-lg rounded-xl border border-white/10 p-6"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">Friends</h2>
            <button className="flex items-center gap-2 text-purple-400 hover:text-purple-300">
              <UserPlus className="w-5 h-5" />
              Add Friend
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mockFriends.map((friend) => (
              <div key={friend.id} className="bg-black/20 rounded-lg p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                      <User className="w-5 h-5 text-white" />
                    </div>
                    <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-gray-900 ${
                      friend.status === 'online' ? 'bg-green-500' : 'bg-gray-500'
                    }`} />
                  </div>
                  <div>
                    <p className="font-medium">{friend.name}</p>
                    <p className="text-sm text-gray-400">{friend.lastActive}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="p-2 rounded-lg hover:bg-white/10">
                    <MessageCircle className="w-5 h-5" />
                  </button>
                  <button className="p-2 rounded-lg hover:bg-white/10">
                    <Video className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}