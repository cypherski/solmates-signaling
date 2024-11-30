import React from 'react';
import { motion } from 'framer-motion';

const avatars = [
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=64&h=64&fit=crop&q=90',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=64&h=64&fit=crop&q=90',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=64&h=64&fit=crop&q=90',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=64&h=64&fit=crop&q=90',
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=64&h=64&fit=crop&q=90',
  'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=64&h=64&fit=crop&q=90'
];

export function FloatingAvatars() {
  return (
    <div className="relative h-40 md:h-60 max-w-2xl mx-auto">
      {avatars.map((avatar, index) => (
        <motion.div
          key={index}
          className="absolute"
          initial={{ 
            x: Math.random() * 200 - 100,
            y: Math.random() * 200 - 100,
            opacity: 0 
          }}
          animate={{ 
            x: Math.random() * 300 - 150,
            y: Math.random() * 300 - 150,
            opacity: 1
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            repeatType: "reverse",
            delay: index * 0.2
          }}
        >
          <img
            src={avatar}
            alt="User Avatar"
            className="w-12 h-12 md:w-16 md:h-16 rounded-full border-2 border-white/20"
          />
        </motion.div>
      ))}
    </div>
  );
}