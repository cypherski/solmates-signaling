import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Smile, Paperclip, Minimize2 } from 'lucide-react';
import { useMessages } from '../../store/useMessages';

interface ChatModalProps {
  isOpen: boolean;
  friendId: string;
  friendName: string;
  onClose: () => void;
}

export function ChatModal({ isOpen, friendId, friendName, onClose }: ChatModalProps) {
  const [message, setMessage] = useState('');
  const [isMinimized, setIsMinimized] = useState(false);
  const { sendMessage, getMessages } = useMessages();
  const messages = getMessages(friendId);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    try {
      await sendMessage(friendId, message.trim());
      setMessage('');
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className={`fixed ${isMinimized ? 'bottom-4 right-4' : 'inset-0'} z-50 flex items-end justify-end`}
      >
        <motion.div
          initial={isMinimized ? { y: 0, width: '300px', height: '60px' } : { y: 20, opacity: 0 }}
          animate={isMinimized 
            ? { y: 0, width: '300px', height: '60px', opacity: 1 }
            : { y: 0, width: '100%', height: '100%', opacity: 1 }
          }
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className={`bg-gray-900/95 backdrop-blur-lg ${
            isMinimized ? 'rounded-lg' : 'w-full md:w-[500px] h-full'
          }`}
        >
          {isMinimized ? (
            <button
              onClick={() => setIsMinimized(false)}
              className="w-full h-full flex items-center justify-between px-4"
            >
              <span className="font-medium">{friendName}</span>
              <X className="w-5 h-5" onClick={(e) => {
                e.stopPropagation();
                onClose();
              }} />
            </button>
          ) : (
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between p-4 border-b border-white/10">
                <h2 className="text-lg font-semibold">{friendName}</h2>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsMinimized(true)}
                    className="p-2 rounded-lg hover:bg-white/5"
                  >
                    <Minimize2 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={onClose}
                    className="p-2 rounded-lg hover:bg-white/5"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex ${msg.senderId === 'currentUser' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[70%] rounded-xl px-4 py-2 ${
                        msg.senderId === 'currentUser'
                          ? 'bg-purple-600 text-white'
                          : 'bg-white/10 text-white'
                      }`}
                    >
                      {msg.content}
                    </div>
                  </div>
                ))}
              </div>

              <form onSubmit={handleSendMessage} className="p-4 border-t border-white/10">
                <div className="flex gap-2">
                  <button
                    type="button"
                    className="p-2 rounded-lg hover:bg-white/5"
                  >
                    <Paperclip className="w-5 h-5" />
                  </button>
                  
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 bg-white/5 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  
                  <button
                    type="button"
                    className="p-2 rounded-lg hover:bg-white/5"
                  >
                    <Smile className="w-5 h-5" />
                  </button>
                  
                  <button
                    type="submit"
                    disabled={!message.trim()}
                    className="p-2 rounded-lg bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </form>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}