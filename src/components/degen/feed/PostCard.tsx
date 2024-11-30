import React from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, Share2, ThumbsUp, ThumbsDown, Rocket, Skull } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface PostCardProps {
  post: {
    id: string;
    user: string;
    type: 'trade' | 'analysis' | 'prediction';
    content: string;
    reactions: {
      likes: number;
      dislikes: number;
      bullish: number;
      bearish: number;
    };
    userReaction?: 'like' | 'dislike' | 'bullish' | 'bearish' | null;
    created_at: string;
  };
  onReact: (id: string, type: 'like' | 'dislike' | 'bullish' | 'bearish') => void;
}

export function PostCard({ post, onReact }: PostCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      layout
      className={cn(
        "bg-white rounded-lg p-6 space-y-4",
        "border border-gray-100 shadow-sm",
        "hover:bg-gray-50 transition-all cursor-pointer",
        `border-l-4 ${
          post.type === 'trade' 
            ? 'border-l-green-500' 
            : post.type === 'analysis'
            ? 'border-l-blue-500'
            : 'border-l-purple-500'
        }`
      )}
    >
      {post.media && post.media.length > 0 && (
        <div className="relative w-full aspect-video rounded-lg overflow-hidden">
          <img
            src={post.media[0]}
            alt="Post media"
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
          <span className="font-bold text-white">{post.user.slice(0, 2).toUpperCase()}</span>
        </div>
        <div>
          <p className="font-semibold text-gray-900">{post.user}</p>
          <p className="text-sm text-gray-400">
            {format(new Date(post.created_at), 'MMM d, yyyy h:mm a')}
          </p>
        </div>
      </div>

      <p className="text-gray-600">{post.content}</p>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => onReact(post.id, 'like')}
            className={cn(
              "flex items-center gap-2 transition-all transform hover:scale-105",
              post.userReaction === 'like' ? "text-purple-600" : "text-gray-400 hover:text-purple-600"
            )}
          >
            <ThumbsUp className="w-4 h-4" />
            {post.reactions.likes}
          </button>
          <button 
            onClick={() => onReact(post.id, 'dislike')}
            className={cn(
              "flex items-center gap-2 transition-all transform hover:scale-105",
              post.userReaction === 'dislike' ? "text-red-600" : "text-gray-400 hover:text-red-600"
            )}
          >
            <ThumbsDown className="w-4 h-4" />
            {post.reactions.dislikes}
          </button>
          <button 
            onClick={() => onReact(post.id, 'bullish')}
            className={cn(
              "flex items-center gap-2 transition-all transform hover:scale-105",
              post.userReaction === 'bullish' ? "text-green-600" : "text-gray-400 hover:text-green-600"
            )}
          >
            <Rocket className="w-4 h-4" />
            {post.reactions.bullish}
          </button>
          <button
            onClick={() => onReact(post.id, 'bearish')}
            className={cn(
              "flex items-center gap-2 transition-all transform hover:scale-105",
              post.userReaction === 'bearish' ? "text-red-600" : "text-gray-400 hover:text-red-600"
            )}
          >
            <Skull className="w-4 h-4" />
            {post.reactions.bearish}
          </button>
        </div>
      </div>
    </motion.div>
  );
}