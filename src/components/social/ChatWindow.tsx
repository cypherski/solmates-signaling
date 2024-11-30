import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Paperclip, Smile } from 'lucide-react';
import { useMessages } from '../../store/useMessages';
import { MessageList } from './MessageList';

interface ChatWindowProps {
  friendId: string;
  mode: 'chat' | 'voice' | 'video';
}

export function ChatWindow({ friendId, mode }: ChatWindowProps) {
  const [message, setMessage] = useState('');
  const { sendMessage } = useMessages();

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

  if (mode === 'voice' || mode === 'video') {
    return (
      <div className="bg-black/30 backdrop-blur-lg rounded-xl border border-white/10 p-8 text-center h-[600px] flex items-center justify-center">
        <div>
          <p className="text-xl font-semibold mb-4">
            {mode === 'voice' ? 'Voice Call' : 'Video Call'}
          </p>
          <p className="text-gray-400">Coming soon...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black/30 backdrop-blur-lg rounded-xl border border-white/10 h-[600px] flex flex-col">
      <MessageList friendId={friendId} />

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
  );
}