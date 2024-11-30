import React, { useState, useEffect, useRef } from 'react';
import { Send } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface Message {
  text: string;
  isSelf: boolean;
  timestamp: Date;
}

interface ChatPanelProps {
  onSendMessage: (message: string) => void;
  messages: Message[];
}

export function ChatPanel({ onSendMessage, messages }: ChatPanelProps) {
  const [message, setMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    onSendMessage(message.trim());
    setMessage('');
  };

  return (
    <div className={cn(
      "bg-white rounded-xl",
      "border border-gray-200",
      "shadow-xl",
      "h-full flex flex-col sticky top-0"
    )}>
      <div className="px-4 py-3 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Chat</h2>
      </div>

      <div className="flex-1 p-4 space-y-3 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
        {messages.map((msg, index) => (
          <Message key={index} {...msg} />
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-3 border-t border-gray-200">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
            className={cn(
              "flex-1 bg-gray-50 rounded-lg",
              "px-4 py-2 text-gray-900",
              "placeholder:text-gray-400",
              "border border-gray-200",
              "focus:outline-none focus:ring-2",
              "focus:ring-purple-500"
            )}
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={!message.trim()}
            className={cn(
              "p-2 rounded-lg bg-purple-600 hover:bg-purple-500",
              "disabled:opacity-50 disabled:cursor-not-allowed"
            )}
          >
            <Send className="w-5 h-5 text-white" />
          </motion.button>
        </form>
      </div>
    </div>
  );
}

interface MessageProps {
  text: string;
  isSelf: boolean;
}

function Message({ text, isSelf }: MessageProps) {
  return (
    <div className={cn(
      "flex",
      isSelf ? "justify-end" : "justify-start"
    )}>
      <div className={cn(
        "max-w-[80%] rounded-xl px-4 py-2",
        isSelf
          ? "bg-purple-600 text-white"
          : "bg-gray-100 text-gray-900"
      )}>
        {text}
      </div>
    </div>
  );
}