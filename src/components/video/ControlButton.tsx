import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ControlButtonProps {
  onClick: () => void;
  icon: React.ElementType;
  active?: boolean;
  variant: 'primary' | 'danger';
  className?: string;
  iconClassName?: string;
}

export function ControlButton({ 
  onClick, 
  icon: Icon, 
  active = true, 
  variant, 
  className,
  iconClassName
}: ControlButtonProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={cn(
        "w-12 h-12 rounded-full flex items-center justify-center",
        "transition-all duration-200",
        !active && variant === 'primary' && "bg-red-600",
        className
      )}
    >
      <Icon className={cn("w-5 h-5", iconClassName)} />
    </motion.button>
  );
}