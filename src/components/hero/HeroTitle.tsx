import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Twitter, MessageSquare, BookOpen } from 'lucide-react';
import { cn } from "@/lib/utils";

const titleVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

export function HeroTitle() {
  const [showSocials, setShowSocials] = React.useState(false);

  return (
    <motion.div
      variants={titleVariants}
      initial="hidden"
      animate="visible"
      transition={{ duration: 0.8 }}
      className="max-w-5xl mx-auto text-center"
    > 
      <motion.span
        className="inline-block px-4 py-1.5 mb-8 text-sm bg-white/50 backdrop-blur-sm rounded-lg border border-gray-200/50 text-gray-600 shadow-sm cursor-pointer hover:bg-white/80 transition-colors group"
        onClick={() => setShowSocials(prev => !prev)}
      >
        Where traders connect and ideas flow 🔗
      </motion.span>
      <AnimatePresence>
        {showSocials && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={cn(
              "absolute left-1/2 -translate-x-1/2",
              "bg-white/95 backdrop-blur-sm rounded-lg",
              "border border-gray-200/50 shadow-lg",
              "py-2 min-w-[180px] z-50"
            )}
          >
            <a
              href="https://twitter.com/solmates"
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "flex items-center gap-3 px-4 py-2",
                "text-gray-600 hover:text-purple-600",
                "hover:bg-purple-50 transition-colors"
              )}
            >
              <Twitter className="w-4 h-4" />
              <span className="text-sm">Twitter</span>
            </a>
            <a
              href="https://t.me/solmates"
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "flex items-center gap-3 px-4 py-2",
                "text-gray-600 hover:text-purple-600",
                "hover:bg-purple-50 transition-colors"
              )}
            >
              <MessageSquare className="w-4 h-4" />
              <span className="text-sm">Telegram</span>
            </a>
            <a
              href="https://docs.solmates.club"
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "flex items-center gap-3 px-4 py-2",
                "text-gray-600 hover:text-purple-600",
                "hover:bg-purple-50 transition-colors"
              )}
            >
              <BookOpen className="w-4 h-4" />
              <span className="text-sm">Documentation</span>
            </a>
          </motion.div>
        )}
      </AnimatePresence>
      <h1 className={cn(
        "text-6xl md:text-7xl font-bold mb-6 text-gray-900",
        "tracking-tight leading-[1.1] font-display"
      )}>
        Connect with{' '}
        <br />
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
          Crypto Traders
        </span>
      </h1>
    </motion.div>
  );
}