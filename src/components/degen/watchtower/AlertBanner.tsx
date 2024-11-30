import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, Bell } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Alert } from '@/types/token';

interface AlertBannerProps {
  alerts: Alert[];
  onAlertClick: (index: number) => void;
}

export function AlertBanner({ alerts, onAlertClick }: AlertBannerProps) {
  const unreadAlerts = alerts.filter(alert => !alert.isRead);

  return (
    <motion.div
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="sticky top-0 z-50 mb-4 transition-all"
    >
      {unreadAlerts.length > 0 && (
        <div className="bg-white rounded-lg p-4 border border-gray-200/50 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-purple-500" />
              <span className="font-medium text-gray-900">
                {unreadAlerts.length} New {unreadAlerts.length === 1 ? 'Alert' : 'Alerts'}
              </span>
            </div>
            <AnimatePresence mode="popLayout">
              {unreadAlerts.map((alert, index) => (
                <motion.button
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  onClick={() => onAlertClick(index)}
                  className="text-sm px-3 py-1 rounded-full bg-purple-100 text-purple-600 hover:bg-purple-200 transition-colors"
                >
                  View
                </motion.button>
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}
    </motion.div>
  );
}