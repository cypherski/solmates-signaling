import React from 'react';
import { motion } from 'framer-motion';

interface TradingCardProps {
  color: string;
  image: string;
  title: string;
  position: string;
  rotation: string;
  hoverRotation: string;
}

export function TradingCard({ color, image, title, position, rotation, hoverRotation }: TradingCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`w-[280px] ${position} transform ${rotation} hover:${hoverRotation} transition-transform duration-300`}
    >
      <div style={{ backgroundColor: color }} className="p-1 rounded-[32px]">
        <div className="bg-white p-4 rounded-[30px]">
          <img
            src={image}
            alt={title}
            className="w-full h-[320px] object-cover rounded-[24px] mb-4"
          />
          <p className="text-center font-medium text-gray-900">{title}</p>
        </div>
      </div>
    </motion.div>
  );
}