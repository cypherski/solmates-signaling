import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserPlus, X, Check } from 'lucide-react';
import { useFriends } from '../../store/useFriends';

interface NotificationPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NotificationPopup({ isOpen, onClose }: NotificationPopupProps) {
  const { pendingRequests, addFriend, removePendingRequest } = useFriends();

  const handleAccept = async (requestId: string) => {
    try {
      await addFriend(requestId);
    } catch (error) {
      console.error('Failed to accept friend request:', error);
    }
  };

  const handleDecline = async (requestId: string) => {
    try {
      await removePendingRequest(requestId);
    } catch (error) {
      console.error('Failed to decline friend request:', error);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="absolute top-full right-0 mt-2 w-80 bg-black/30 backdrop-blur-lg rounded-xl border border-white/10 shadow-xl overflow-hidden"
        >
          <div className="p-4 border-b border-white/10">
            <h3 className="font-semibold">Notifications</h3>
          </div>

          {pendingRequests.length > 0 ? (
            <div className="divide-y divide-white/10">
              {pendingRequests.map((request) => (
                <div key={request.id} className="p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                      <UserPlus className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-medium">{request.name}</p>
                      <p className="text-sm text-gray-400">Sent you a friend request</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleAccept(request.id)}
                      className="flex-1 bg-purple-600 hover:bg-purple-700 text-white rounded-lg py-2 flex items-center justify-center gap-2 transition-colors"
                    >
                      <Check className="w-4 h-4" />
                      Accept
                    </button>
                    <button
                      onClick={() => handleDecline(request.id)}
                      className="flex-1 bg-black/30 hover:bg-white/5 text-white rounded-lg py-2 flex items-center justify-center gap-2 transition-colors"
                    >
                      <X className="w-4 h-4" />
                      Decline
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-gray-400">
              <UserPlus className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>No new notifications</p>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}