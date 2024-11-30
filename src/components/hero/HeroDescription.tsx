import React from 'react';
import { motion } from 'framer-motion'; 
import { cn } from "@/lib/utils";

export function HeroDescription() {
  return (
    <motion.p 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.4 }}
      className={cn(
        "text-lg md:text-xl text-gray-600 mb-12",
        "max-w-2xl mx-auto leading-relaxed"
      )}
    >
      A unified hub for all your messages, ensuring you never
      miss a beat when it comes to your communication.
    </motion.p>
  );
}