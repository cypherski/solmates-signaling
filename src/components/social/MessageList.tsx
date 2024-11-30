import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { useMessages } from '../../store/useMessages';
import { Check, CheckCheck } from 'lucide-react';

interface MessageListProps {
  friendId: string;
}

export function MessageList({ friendId }: MessageListProps) {
  const { getMessages, markAsRead } = useMessages();
  const messages = getMessages(friendId);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const unreadMessages = messages
      .filter(msg => msg.status !== 'read' && msg.senderId === friendId)
      .map(msg => msg.id);
    
    if (unreadMessages.length > 0) {
      markAsRead(unreadMessages);
    }

    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, friendId, markAsRead]);

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map((message, index) => (
        <motion.div
          key={message.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className={`flex ${message.senderId === 'currentUser' ? 'justify-end' : 'justify-start'}`}
        >
          <div
            className={`max-w-[70%] rounded-xl px-4 py-2 ${
              message.senderId === 'currentUser'
                ? 'bg-purple-600 text-white'
                : 'bg-white/10 text-white'
            }`}
          >
            <div className="break-words">{message.content}</div>
            <div className="flex items-center justify-end gap-1 mt-1">
              <span className="text-xs opacity-70">
                {format(new Date(message.timestamp), 'HH:mm')}
              </span>
              {message.senderId === 'currentUser' && (
                message.status === 'read' ? (
                  <CheckCheck className="w-4 h-4 opacity-70" />
                ) : (
                  <Check className="w-4 h-4 opacity-70" />
                )
              )}
            </div>
          </div>
        </motion.div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
}