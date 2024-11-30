import React from 'react';
import { motion } from 'framer-motion';
import { Search, UserPlus } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface Friend {
  id: string;
  name: string;
  avatar: string;
  status: 'online' | 'offline' | 'busy';
  lastSeen?: Date;
}

interface FriendsListProps {
  friends: Friend[];
  selectedFriend: string | null;
  onSelectFriend: (friendId: string) => void;
}

export function FriendsList({ friends, selectedFriend, onSelectFriend }: FriendsListProps) {
  return (
    <div className="bg-black/30 backdrop-blur-lg rounded-xl border border-white/10 p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-semibold">Friends</h2>
        <button className="p-2 rounded-lg hover:bg-white/5">
          <UserPlus className="w-5 h-5" />
        </button>
      </div>

      <div className="relative mb-4">
        <input
          type="text"
          placeholder="Search friends..."
          className="w-full bg-black/30 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
      </div>

      <div className="space-y-2">
        {friends.map((friend) => (
          <motion.button
            key={friend.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={() => onSelectFriend(friend.id)}
            className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${
              selectedFriend === friend.id
                ? 'bg-purple-600'
                : 'hover:bg-white/5'
            }`}
          >
            <div className="relative">
              <img
                src={friend.avatar}
                alt={friend.name}
                className="w-10 h-10 rounded-full"
              />
              <div
                className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-gray-900 ${
                  friend.status === 'online'
                    ? 'bg-green-500'
                    : friend.status === 'busy'
                    ? 'bg-red-500'
                    : 'bg-gray-500'
                }`}
              />
            </div>
            <div className="flex-1 text-left">
              <div className="font-medium">{friend.name}</div>
              <div className="text-sm text-gray-400">
                {friend.status === 'offline' && friend.lastSeen
                  ? `Last seen ${formatDistanceToNow(friend.lastSeen)} ago`
                  : friend.status}
              </div>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}