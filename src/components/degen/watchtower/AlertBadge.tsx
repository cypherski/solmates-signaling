import React from 'react';
import { AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface AlertBadgeProps {
  count: number;
  className?: string;
}

export function AlertBadge({ count, className }: AlertBadgeProps) {
  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={cn(
        "flex items-center gap-2 px-3 py-1 rounded-full",
        "bg-yellow-400/10 text-yellow-400",
        className
      )}
    >
      <AlertCircle className="w-4 h-4" />
      <span className="text-sm font-medium">{count} Alerts</span>
    </motion.div>
  );
}