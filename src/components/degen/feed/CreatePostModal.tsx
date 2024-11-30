import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Image, LineChart, Target, Send } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (post: any) => void;
}

export function CreatePostModal({ isOpen, onClose, onSubmit }: CreatePostModalProps) {
  const [postType, setPostType] = useState<'trade' | 'analysis' | 'prediction'>('trade');
  const [content, setContent] = useState('');
  const [media, setMedia] = useState<string[]>([]);
  const [metadata, setMetadata] = useState<any>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    try {
      onSubmit({
        type: postType,
        content,
        media,
        metadata: {
          ...metadata,
          timestamp: new Date().toISOString()
        }
      });
      setContent('');
      setMedia([]);
      setMetadata({});
      onClose();
    } catch (error) {
      console.error('Failed to create post:', error);
      // You could add error handling UI here
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="w-full max-w-2xl bg-white rounded-xl shadow-xl border border-gray-200/50 overflow-hidden"
          >
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Create Post</h2>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-4 space-y-4">
              <div className="flex gap-2">
                {[
                  { type: 'trade', icon: LineChart, label: 'Trade' },
                  { type: 'analysis', icon: Target, label: 'Analysis' },
                  { type: 'prediction', icon: Image, label: 'Prediction' }
                ].map(({ type, icon: Icon, label }) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setPostType(type as any)}
                    className={cn(
                      "flex items-center gap-2 px-4 py-2 rounded-lg",
                      "text-sm font-medium transition-colors",
                      postType === type
                        ? "bg-purple-100 text-purple-600"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    {label}
                  </button>
                ))}
              </div>

              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="What's on your mind?"
                className={cn(
                  "w-full min-h-[150px] p-4 rounded-lg",
                  "bg-gray-50 border border-gray-200",
                  "text-gray-900 placeholder-gray-400",
                  "focus:outline-none focus:ring-2 focus:ring-purple-500"
                )}
              />

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!content.trim()}
                  className={cn(
                    "px-4 py-2 rounded-lg text-sm font-medium",
                    "bg-gradient-to-r from-purple-600 to-pink-600",
                    "text-white hover:from-purple-700 hover:to-pink-700",
                    "disabled:opacity-50 disabled:cursor-not-allowed",
                    "transition-all transform hover:scale-105"
                  )}
                >
                  <Send className="w-4 h-4" />
                  Post
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}