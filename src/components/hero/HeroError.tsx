import React from 'react';
import { motion } from 'framer-motion';

interface HeroErrorProps {
  error: string | null;
}

export function HeroError({ error }: HeroErrorProps) {
  if (!error) return null;

  return (
    <motion.p
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="mt-4 text-red-400 text-sm"
    >
      {error}
    </motion.p>
  );
}