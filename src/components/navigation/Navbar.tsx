import React from 'react';
import { motion } from 'framer-motion';
import { NavLogo } from './NavLogo';
import { NavLinks } from './NavLinks';
import { NavWallet } from './NavWallet';
import { cn } from "@/lib/utils";

export function Navbar() {
  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "fixed top-0 left-0 right-0 z-50",
        "bg-white",
        "h-20 border-b border-gray-100"
      )}
    >
      <div className={cn(
        "max-w-7xl mx-auto h-full",
        "px-6",
        "flex items-center justify-between"
      )}>
        <NavLogo />
        <NavLinks />
        <NavWallet />
      </div>
    </motion.nav>
  );
}