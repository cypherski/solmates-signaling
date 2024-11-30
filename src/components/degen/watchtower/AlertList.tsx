import React from 'react';
import { AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Alert } from '@/types/token';

interface AlertListProps {
  alerts: Alert[];
  onMarkAsRead: (index: number) => void;
}

export function AlertList({ alerts, onMarkAsRead }: AlertListProps) {
  return (
    <AnimatePresence mode="popLayout">
      {alerts.map((alert, index) => (
        <motion.div
          key={index}
          onClick={() => onMarkAsRead(index)}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          transition={{ delay: index * 0.1 }}
          layout
          className="flex items-center gap-2 p-3 rounded-lg text-sm cursor-pointer bg-white hover:bg-gray-50 border border-gray-200/50 transition-colors"
        >
          <AlertCircle className="w-4 h-4 text-yellow-600 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-gray-900">{alert.message}</p>
            <p className="text-xs text-gray-500 mt-1">
              {new Date(alert.timestamp).toLocaleString()}
            </p>
          </div>
        </motion.div>
      ))}
    </AnimatePresence>
  );
}