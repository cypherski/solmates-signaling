import React from 'react';
import { motion } from 'framer-motion';

export function HeroContent() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <h1 className="text-[2.75rem] md:text-[3.5rem] font-bold leading-[1.1] tracking-tight mb-6 text-gray-900">
        Find your match
        <br />
        <span className="block mt-2">
          <span className="font-extrabold">By being</span>
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-accent">
            a Trader
          </span>
        </span>
      </h1>
      <p className="text-gray-600 text-lg mb-8 max-w-[420px]">
        We designed a platform for crypto traders to find their trading partners without being judged
      </p>
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="bg-gradient-to-r from-primary to-accent text-white px-8 py-4 rounded-full font-medium text-lg hover:shadow-lg transition-shadow duration-300"
      >
        START TRADING NOW
      </motion.button>
    </motion.div>
  );
}