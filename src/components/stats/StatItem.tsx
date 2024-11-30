import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface StatItemProps {
  icon: LucideIcon;
  color: string;
  title: string;
  description: string;
}

export function StatItem({ icon: Icon, color, title, description }: StatItemProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="text-center"
    >
      <div className="flex justify-center mb-3">
        <Icon style={{ color }} className="w-8 h-8" />
      </div>
      <h3 className="text-xl font-bold mb-1 text-gray-900">{title}</h3>
      <p className="text-gray-500 text-sm">{description}</p>
    </motion.div>
  );
}