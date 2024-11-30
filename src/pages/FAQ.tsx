import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Search, ChevronDown } from 'lucide-react';

const faqs = {
  "Getting Started": [
    {
      question: "How do I connect my wallet?",
      answer: "Click the 'Connect' button in the top right corner and select your preferred wallet (Phantom, Solflare, etc.). Follow the prompts to complete the connection."
    },
    {
      question: "What are the minimum requirements?",
      answer: "You need a Solana wallet with a minimum balance of 0.1 SOL to access basic features."
    }
  ],
  "Trading & Chat": [
    {
      question: "How does the matching system work?",
      answer: "Our algorithm pairs you with traders based on your selected interests, experience level, and trading preferences."
    },
    {
      question: "Are conversations private?",
      answer: "Yes, all chats are end-to-end encrypted. Only you and your matched partner can see the messages."
    }
  ]
};

function FAQSection({ category, items }: { category: string, items: any[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="mb-12">
      <h2 className="text-2xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
        {category}
      </h2>
      <div className="space-y-4">
        {items.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            className="bg-black/30 backdrop-blur-lg rounded-xl border border-white/10 overflow-hidden"
          >
            <button
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              className="w-full px-6 py-4 flex items-center justify-between text-left"
            >
              <span className="font-medium text-white">{item.question}</span>
              <ChevronDown
                className={`w-5 h-5 transition-transform ${
                  openIndex === index ? 'rotate-180' : ''
                }`}
              />
            </button>
            <AnimatePresence>
              {openIndex === index && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="px-6 pb-4 text-gray-300"
                >
                  {item.answer}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export function FAQ() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredFaqs = Object.entries(faqs).reduce((acc: any, [category, items]) => {
    const filteredItems = items.filter(
      item =>
        item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.answer.toLowerCase().includes(searchTerm.toLowerCase())
    );
    if (filteredItems.length > 0) {
      acc[category] = filteredItems;
    }
    return acc;
  }, {});

  return (
    <div className="max-w-4xl mx-auto px-4 py-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <h1 className="text-5xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
          Frequently Asked Questions
        </h1>
        <p className="text-xl text-gray-300 mb-8">
          Find answers to common questions about SolMates
        </p>
        <div className="relative max-w-xl mx-auto">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search questions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-black/30 backdrop-blur-lg rounded-full py-3 pl-12 pr-6 text-white placeholder-gray-400 border border-white/10 focus:outline-none focus:border-purple-500"
          />
        </div>
      </motion.div>

      {Object.entries(filteredFaqs).map(([category, items], index) => (
        <FAQSection key={index} category={category} items={items as any} />
      ))}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="mt-16 text-center"
      >
        <h3 className="text-xl font-bold mb-4 text-white">Still have questions?</h3>
        <button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-full flex items-center gap-2 mx-auto transition-colors">
          <MessageCircle className="w-5 h-5" />
          Contact Support
        </button>
      </motion.div>
    </div>
  );
}